const prisma = require("../../prisma/client");

class RequestKanban {
    /**
     * Find all Kanban requests with optimized pagination and includes
     */
    static async findAll(
        page = 1,
        limit = 10,
        search = "",
        sortBy = "id_kanban",
        sortOrder = "desc"
    ) {
        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        // Build search conditions more efficiently
        const searchConditions = search
            ? {
                  OR: [
                      {
                          nama_requester: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                      {
                          parts_number: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                      {
                          lokasi: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                  ],
              }
            : {};

        // Validate sort parameters
        const allowedSortFields = [
            "id_kanban",
            "tgl_produksi",
            "created_at",
            "nama_requester",
            "status",
        ];
        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "id_kanban";
        const order = ["asc", "desc"].includes(sortOrder.toLowerCase())
            ? sortOrder.toLowerCase()
            : "desc";

        // Use Promise.all for parallel execution
        const [data, total] = await Promise.all([
            prisma.requestKanban.findMany({
                where: searchConditions,
                include: {
                    user: {
                        select: {
                            id_users: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                    department: {
                        select: {
                            id_department: true,
                            name: true,
                        },
                    },
                    persetujuan: {
                        select: {
                            role: true,
                            approve: true,
                            approvedAt: true,
                            note: true,
                            user: {
                                select: {
                                    name: true,
                                    role: true,
                                },
                            },
                        },
                        orderBy: {
                            created_at: "asc",
                        },
                    },
                },
                orderBy: { [sortField]: order },
                skip,
                take,
            }),
            prisma.requestKanban.count({ where: searchConditions }),
        ]);

        return {
            data: data.map((request) => ({
                ...request,
                // Add computed fields for better frontend usage
                totalApprovals: request.persetujuan.length,
                approvedCount: request.persetujuan.filter((p) => p.approve)
                    .length,
                pendingCount: request.persetujuan.filter(
                    (p) => !p.approve && !p.note.includes("reject")
                ).length,
                rejectedCount: request.persetujuan.filter((p) =>
                    p.note.toLowerCase().includes("reject")
                ).length,
            })),
            pagination: {
                total,
                page: parseInt(page),
                limit: take,
                totalPages: Math.ceil(total / take),
                hasNextPage: page < Math.ceil(total / take),
                hasPreviousPage: page > 1,
            },
        };
    }

    /**
     * Enhanced create with transaction and better error handling
     */
    static async create(requestData) {
        return await prisma.$transaction(async (tx) => {
            // Validate department exists
            const department = await tx.department.findUnique({
                where: { id_department: requestData.id_department },
            });

            if (!department) {
                throw new Error(
                    `Department with ID ${requestData.id_department} not found`
                );
            }

            // Create the request
            const newRequest = await tx.requestKanban.create({
                data: {
                    ...requestData,
                    tgl_produksi: new Date(requestData.tgl_produksi),
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                    department: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            return newRequest;
        });
    }

    /**
     * Optimized findById with selective includes
     */
    static async findById(id, includeApprovals = false) {
        const include = {
            user: {
                select: {
                    id_users: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            department: {
                select: {
                    id_department: true,
                    name: true,
                },
            },
        };

        if (includeApprovals) {
            include.persetujuan = {
                select: {
                    id_users: true,
                    role: true,
                    approve: true,
                    approvedAt: true,
                    note: true,
                    created_at: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                    department: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: {
                    created_at: "asc",
                },
            };
        }

        return await prisma.requestKanban.findUnique({
            where: { id_kanban: parseInt(id) },
            include,
        });
    }

    /**
     * Optimized findKanbanById with better structure
     */
    static async findKanbanById(id) {
        return await this.findById(id, true);
    }

    /**
     * Enhanced update with validation and audit trail
     */
    static async updateById(id, updateData, userId = null) {
        return await prisma.$transaction(async (tx) => {
            // Get current data for audit
            const currentData = await tx.requestKanban.findUnique({
                where: { id_kanban: parseInt(id) },
            });

            if (!currentData) {
                throw new Error(`Request Kanban with ID ${id} not found`);
            }

            // Prepare update data
            const data = { ...updateData };
            if (data.tgl_produksi) {
                data.tgl_produksi = new Date(data.tgl_produksi);
            }
            data.updated_at = new Date();

            // Update the record
            const updatedRequest = await tx.requestKanban.update({
                where: { id_kanban: parseInt(id) },
                data,
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                    department: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            // Create audit log if userId provided
            if (userId) {
                await tx.auditLog.create({
                    data: {
                        user_id: parseInt(userId),
                        action: "UPDATE_REQUEST",
                        table_name: "request_kanban",
                        record_id: parseInt(id),
                        old_values: currentData,
                        new_values: updatedRequest,
                    },
                });
            }

            return updatedRequest;
        });
    }

    /**
     * Optimized status update with audit
     */
    static async updateStatus(id, status, userId = null, note = null) {
        return await prisma.$transaction(async (tx) => {
            const currentData = await tx.requestKanban.findUnique({
                where: { id_kanban: parseInt(id) },
                select: { id_kanban: true, status: true },
            });

            if (!currentData) {
                throw new Error(`Request Kanban with ID ${id} not found`);
            }

            const updatedRequest = await tx.requestKanban.update({
                where: { id_kanban: parseInt(id) },
                data: {
                    status,
                    updated_at: new Date(),
                },
            });

            // Create audit log
            if (userId) {
                await tx.auditLog.create({
                    data: {
                        user_id: parseInt(userId),
                        action: "STATUS_CHANGE",
                        table_name: "request_kanban",
                        record_id: parseInt(id),
                        old_values: { status: currentData.status },
                        new_values: { status, note },
                    },
                });
            }

            return updatedRequest;
        });
    }

    /**
     * Optimized findByUserId with pagination
     */
    static async findByUserId(
        userId,
        page = 1,
        limit = 10,
        search = "",
        status = null
    ) {
        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        // ✅ DEBUG LOGS
        console.log("=== DEBUG findByUserId ===");
        console.log("🔍 Received parameters:");
        console.log("  - userId:", userId);
        console.log("  - page:", page);
        console.log("  - limit:", limit);
        console.log("  - search:", `"${search}"`);
        console.log("  - search type:", typeof search);
        console.log("  - search length:", search.length);
        console.log("  - status:", status);

        // Build search conditions
        const searchConditions = search
            ? {
                  OR: [
                      {
                          nama_requester: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                      {
                          parts_number: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                      {
                          lokasi: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                  ],
              }
            : {};

        console.log(
            "🔍 Search conditions:",
            JSON.stringify(searchConditions, null, 2)
        );

        const where = {
            id_users: parseInt(userId),
            ...searchConditions,
            ...(status && { status }),
        };

        console.log("🔍 Final WHERE clause:", JSON.stringify(where, null, 2));
        console.log("===========================");

        try {
            const [data, total] = await Promise.all([
                prisma.requestKanban.findMany({
                    where,
                    include: {
                        department: {
                            select: {
                                name: true,
                            },
                        },
                        persetujuan: {
                            select: {
                                role: true,
                                approve: true,
                                approvedAt: true,
                                note: true,
                            },
                            orderBy: {
                                created_at: "asc",
                            },
                        },
                    },
                    orderBy: { id_kanban: "desc" },
                    skip,
                    take,
                }),
                prisma.requestKanban.count({ where }),
            ]);

            console.log("🔍 Database query results:");
            console.log("  - Total count:", total);
            console.log("  - Data length:", data.length);
            if (data.length > 0) {
                console.log("  - Sample data:", {
                    id_kanban: data[0].id_kanban,
                    nama_requester: data[0].nama_requester,
                    parts_number: data[0].parts_number,
                    lokasi: data[0].lokasi,
                });
            }

            return {
                data: data.map((request) => ({
                    ...request,
                    approvalSummary: {
                        total: request.persetujuan.length,
                        approved: request.persetujuan.filter((p) => p.approve)
                            .length,
                        pending: request.persetujuan.filter(
                            (p) => !p.approve && !p.note.includes("reject")
                        ).length,
                        rejected: request.persetujuan.filter((p) =>
                            p.note.toLowerCase().includes("reject")
                        ).length,
                    },
                })),
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: take,
                    totalPages: Math.ceil(total / take),
                },
            };
        } catch (error) {
            console.error("❌ Database query error:", error);
            throw error;
        }
    }

    /**
     * Enhanced approved requests with better filtering
     */
    static async findApproved(options = {}) {
        const {
            page = 1,
            limit = 10,
            role = "",
            search = "",
            userId = null,
            departmentId = null,
            dateFrom = null,
            dateTo = null,
            sortBy = "tgl_produksi",
            sortOrder = "desc",
        } = options;

        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        // Build search filter
        const searchFilter = search
            ? {
                  OR: [
                      {
                          nama_requester: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                      {
                          parts_number: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                      {
                          lokasi: {
                              contains: search,
                              mode: "insensitive",
                          },
                      },
                  ],
              }
            : {};

        // Build date filter
        const dateFilter = {};
        if (dateFrom || dateTo) {
            dateFilter.tgl_produksi = {};
            if (dateFrom) dateFilter.tgl_produksi.gte = new Date(dateFrom);
            if (dateTo) dateFilter.tgl_produksi.lte = new Date(dateTo);
        }

        // Build approval filter
        const approvalFilter = {
            persetujuan: {
                some: {
                    approve: true,
                    ...(role && { role }),
                    ...(userId && { id_users: parseInt(userId) }),
                    ...(departmentId && {
                        id_department: parseInt(departmentId),
                    }),
                },
            },
        };

        const where = {
            ...searchFilter,
            ...dateFilter,
            ...approvalFilter,
        };

        // Validate sort parameters
        const allowedSortFields = [
            "tgl_produksi",
            "created_at",
            "nama_requester",
        ];
        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : "tgl_produksi";
        const order = ["asc", "desc"].includes(sortOrder) ? sortOrder : "desc";

        const [data, total] = await Promise.all([
            prisma.requestKanban.findMany({
                where,
                include: {
                    persetujuan: {
                        where: {
                            approve: true,
                            ...(role && { role }),
                            ...(userId && { id_users: parseInt(userId) }),
                            ...(departmentId && {
                                id_department: parseInt(departmentId),
                            }),
                        },
                        select: {
                            approve: true,
                            role: true,
                            approvedAt: true,
                            note: true,
                            user: {
                                select: {
                                    name: true,
                                    role: true,
                                },
                            },
                            department: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            name: true,
                            role: true,
                        },
                    },
                    department: {
                        select: {
                            name: true,
                        },
                    },
                },
                orderBy: { [sortField]: order },
                skip,
                take,
            }),
            prisma.requestKanban.count({ where }),
        ]);

        // Format the data
        const formattedData = data.flatMap((item) =>
            item.persetujuan.map((approval) => ({
                id_kanban: item.id_kanban,
                request_data: {
                    nama_requester: item.nama_requester,
                    parts_number: item.parts_number,
                    lokasi: item.lokasi,
                    tgl_produksi: item.tgl_produksi,
                    status: item.status,
                },
                approval_data: {
                    role: approval.role,
                    approvedAt: approval.approvedAt,
                    note: approval.note,
                    approver: approval.user,
                    department: approval.department,
                },
                requester: item.user,
                department: item.department,
            }))
        );

        return {
            data: formattedData,
            pagination: {
                total,
                page: parseInt(page),
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    /**
     * Enhanced findApprovedByPC with better performance
     */
    static async findApprovedByPC(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const take = parseInt(limit);

        const [data, total] = await Promise.all([
            prisma.requestKanban.findMany({
                where: {
                    status: "APPROVED_BY_PC",
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    department: {
                        select: {
                            name: true,
                        },
                    },
                    note: true
                },
                orderBy: {
                    updated_at: "desc",
                },
                skip,
                take,
            }),
            prisma.requestKanban.count({
                where: {
                    status: "APPROVED_BY_PC",
                },
            }),
        ]);

        return {
            data,
            pagination: {
                total,
                page: parseInt(page),
                limit: take,
                totalPages: Math.ceil(total / take),
            },
        };
    }

    /**
     * Optimized hasApprovals check
     */
    static async hasApprovals(id) {
        const count = await prisma.persetujuan.count({
            where: {
                id_kanban: parseInt(id),
                approve: true,
            },
        });

        return count > 0;
    }

    /**
     * Enhanced ownership check with user validation
     */
    static async isOwnedByUser(kanbanId, userId) {
        const kanban = await prisma.requestKanban.findUnique({
            where: { id_kanban: parseInt(kanbanId) },
            select: { id_users: true },
        });

        return kanban?.id_users === parseInt(userId);
    }

    /**
     * Get request statistics for dashboard
     */
    static async getRequestStats(userId = null, departmentId = null) {
        const where = {};
        if (userId) where.id_users = parseInt(userId);
        if (departmentId) where.id_department = parseInt(departmentId);

        const [total, pending, approved, rejected, byStatus] =
            await Promise.all([
                prisma.requestKanban.count({ where }),
                prisma.requestKanban.count({
                    where: { ...where, status: "PENDING_APPROVAL" },
                }),
                prisma.requestKanban.count({
                    where: { ...where, status: "APPROVED_BY_PC" },
                }),
                prisma.requestKanban.count({
                    where: {
                        ...where,
                        status: {
                            in: ["REJECTED_BY_DEPARTMENT", "REJECTED_BY_PC"],
                        },
                    },
                }),
                prisma.requestKanban.groupBy({
                    by: ["status"],
                    where,
                    _count: {
                        status: true,
                    },
                }),
            ]);

        return {
            total,
            pending,
            approved,
            rejected,
            byStatus: byStatus.map((item) => ({
                status: item.status,
                count: item._count.status,
            })),
        };
    }

    /**
     * Bulk operations for admin
     */
    static async bulkUpdateStatus(kanbanIds, status, userId) {
        return await prisma.$transaction(async (tx) => {
            const validIds = kanbanIds
                .map((id) => parseInt(id))
                .filter((id) => !isNaN(id));

            if (validIds.length === 0) {
                throw new Error("No valid kanban IDs provided");
            }

            // Update all requests
            const result = await tx.requestKanban.updateMany({
                where: {
                    id_kanban: { in: validIds },
                },
                data: {
                    status,
                    updated_at: new Date(),
                },
            });

            // Create audit logs
            await tx.auditLog.createMany({
                data: validIds.map((id) => ({
                    user_id: parseInt(userId),
                    action: "BULK_STATUS_UPDATE",
                    table_name: "request_kanban",
                    record_id: id,
                    new_values: { status, updated_by: userId },
                })),
            });

            return { updated: result.count, kanbanIds: validIds };
        });
    }
}

module.exports = RequestKanban;

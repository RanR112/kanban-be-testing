const prisma = require("../../prisma/client");

class RequestKanban {
    /**
     * Find all Kanban requests with pagination
     */
    static async findAll(page = 1, limit = 10, search = "") {
        const skip = (page - 1) * limit;

        const where = search
            ? {
                  OR: [
                      {
                          nama_requester: {
                              contains: search,
                          },
                      },
                      {
                          parts_number: {
                              contains: search,
                          },
                      },
                  ],
              }
            : {};

        const total = await prisma.requestKanban.count({ where });

        const data = await prisma.requestKanban.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                persetujuan: {
                    select: {
                        role: true,
                        approve: true,
                        approvedAt: true,
                        note: true,
                    },
                },
                department: true,
            },
            orderBy: { id_kanban: "desc" },
            skip,
            take: parseInt(limit),
        });

        return {
            data,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Create a new Kanban request
     */
    static async create(requestData) {
        return await prisma.requestKanban.create({
            data: {
                ...requestData,
                // tgl_produksi: new Date(requestData.tgl_produksi),
            },
        });
    }

    /**
     * Find Kanban request by ID
     */
    static async findById(id) {
        return await prisma.requestKanban.findUnique({
            where: { id_kanban: parseInt(id) },
        });
    }

    static async findKanbanById(id) {
        return await prisma.requestKanban.findUnique({
            where: { id_kanban: parseInt(id) },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                persetujuan: {
                    select: {
                        role: true,
                        approve: true,
                        approvedAt: true,
                        note: true,
                        department: true,
                    },
                },
                department: true,
            },
        });
    }

    /**
     * Find Kanban request by ID with approvals
     */
    static async findByIdWithApprovals(id) {
        return await prisma.requestKanban.findUnique({
            where: { id_kanban: parseInt(id) },
            include: {
                persetujuan: {
                    select: {
                        approve: true,
                        id_users: true,
                        user: {
                            select: {
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    }

    /**
     * Find Kanban request by ID with user info
     */
    static async findByIdWithUser(id) {
        return await prisma.requestKanban.findUnique({
            where: { id_kanban: parseInt(id) },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    /**
     * Update Kanban request by ID
     */
    static async updateById(id, updateData) {
        const data = { ...updateData };
        if (data.tgl_produksi) {
            data.tgl_produksi = new Date(data.tgl_produksi);
        }

        return await prisma.requestKanban.update({
            where: { id_kanban: parseInt(id) },
            data,
        });
    }

    /**
     * Update Kanban status
     */
    static async updateStatus(id, status) {
        return await prisma.requestKanban.update({
            where: { id_kanban: parseInt(id) },
            data: { status },
        });
    }

    /**
     * Find all requests by user ID
     */
    static async findByUserId(userId) {
        return await prisma.requestKanban.findMany({
            where: { id_users: parseInt(userId) },
            include: {
                persetujuan: {
                    select: {
                        role: true,
                        approve: true,
                        approvedAt: true,
                        note: true,
                    },
                },
            },
            orderBy: { id_kanban: "desc" },
        });
    }

    /**
     * Find all approved Kanban requests
     */
    static async findApproved(
        page = 1,
        limit = 10,
        role = "",
        search = "",
        userId = null,
        departmentId = null
    ) {
        const searchFilter = search
            ? {
                  OR: [
                      {
                          nama_requester: {
                              contains: search,
                          },
                      },
                      {
                          parts_number: {
                              contains: search,
                          },
                      },
                  ],
              }
            : {};

        const approvalFilter = {
            persetujuan: {
                some: {
                    ...(role && { role }),
                    ...(userId && { id_users: userId }),
                    ...(departmentId && { id_department: departmentId }),
                },
            },
        };

        const combinedWhere = {
            ...searchFilter,
            ...approvalFilter,
        };

        const allData = await prisma.requestKanban.findMany({
            where: combinedWhere,
            include: {
                persetujuan: {
                    where: {
                        ...(role && { role }),
                        ...(userId && { id_users: userId }),
                        ...(departmentId && { id_department: departmentId }),
                    },
                    select: {
                        approve: true,
                        role: true,
                        approvedAt: true,
                        id_kanban: true,
                        note: true,
                        id_users: true,
                        id_department: true,
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
            orderBy: {
                tgl_produksi: "desc",
            },
        });

        const formattedData = allData.flatMap((item) =>
            item.persetujuan
                .map((p) => {
                    let status = "";
                    if (p.approve === true) {
                        status = "Approved";
                    } else if (
                        p.approve === false &&
                        typeof p.note === "string" &&
                        p.note.toLowerCase().includes("reject")
                    ) {
                        status = "Rejected";
                    } else {
                        return null;
                    }

                    return {
                        id: item.id_kanban,
                        id_kanban: item.id_kanban,
                        approvedAt: p.approvedAt || null,
                        parts_number: item.parts_number || "-",
                        status,
                        // Tambahan data jika diperlukan
                        requester_name: item.nama_requester,
                        tgl_produksi: item.tgl_produksi,
                        department_name: item.department.name,
                        user_name: item.user.name,
                    };
                })
                .filter((x) => x !== null)
        );

        const total = formattedData.length;
        const totalPages = Math.ceil(total / limit);

        const skip = (page - 1) * limit;
        const paginatedData = formattedData.slice(skip, skip + limit);

        return {
            data: paginatedData,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages,
        };
    }

    /**
     * Find all Kanban requests approved by PC
     */
    static async findApprovedByPC() {
        return await prisma.requestKanban.findMany({
            where: {
                status: "APPROVED_BY_PC",
            },
            orderBy: {
                id_kanban: "desc",
            },
        });
    }

    /**
     * Check if request has any approvals
     */
    static async hasApprovals(id) {
        const kanban = await prisma.requestKanban.findUnique({
            where: { id_kanban: parseInt(id) },
            select: {
                persetujuan: {
                    select: { approve: true },
                },
            },
        });

        return (
            kanban?.persetujuan.some((approval) => approval.approve === true) ||
            false
        );
    }

    /**
     * Check if user owns the request
     */
    static async isOwnedByUser(kanbanId, userId) {
        const kanban = await this.findById(kanbanId);
        return kanban?.id_users === parseInt(userId);
    }
}

module.exports = RequestKanban;

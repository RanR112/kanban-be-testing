const prisma = require("../../prisma/client");

class Persetujuan {
    /**
     * Create multiple approvals
     */
    static async createMany(approvalsData) {
        return await prisma.persetujuan.createMany({
            data: approvalsData,
        });
    }

    /**
     * Create multiple approvals with skip duplicates
     */
    static async createManySkipDuplicates(approvalsData) {
        return await prisma.persetujuan.createMany({
            data: approvalsData,
            skipDuplicates: true,
        });
    }

    /**
     * Find approval by composite key
     */
    static async findByCompositeKey(userId, departmentId, kanbanId, role) {
        return await prisma.persetujuan.findUnique({
            where: {
                id_users_id_department_id_kanban_role: {
                    id_users: parseInt(userId),
                    id_department: parseInt(departmentId),
                    id_kanban: parseInt(kanbanId),
                    role,
                },
            },
        });
    }

    /**
     * Update approval by composite key
     */
    static async updateByCompositeKey(
        userId,
        departmentId,
        kanbanId,
        role,
        updateData
    ) {
        return await prisma.persetujuan.update({
            where: {
                id_users_id_department_id_kanban_role: {
                    id_users: parseInt(userId),
                    id_department: parseInt(departmentId),
                    id_kanban: parseInt(kanbanId),
                    role,
                },
            },
            data: updateData,
        });
    }

    /**
     * Update multiple approvals
     */
    static async updateMany(whereCondition, updateData) {
        return await prisma.persetujuan.updateMany({
            where: whereCondition,
            data: updateData,
        });
    }

    /**
     * Find pending approvals for user
     */
    static async findPendingForUser(
        userId,
        rejectedNotes,
        rejectedStatuses,
        page = 1,
        limit = 10,
        search = ""
    ) {
        const skip = (page - 1) * limit;

        const requestKanbanSearch = search
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

        // Hitung total data
        const total = await prisma.persetujuan.count({
            where: {
                id_users: parseInt(userId),
                approve: false,
                note: { notIn: rejectedNotes },
                requestKanban: {
                    status: { notIn: rejectedStatuses },
                    ...requestKanbanSearch,
                },
            },
        });

        const data = await prisma.persetujuan.findMany({
            where: {
                id_users: parseInt(userId),
                approve: false,
                note: { notIn: rejectedNotes },
                requestKanban: {
                    status: { notIn: rejectedStatuses },
                    ...requestKanbanSearch,
                },
            },
            include: {
                requestKanban: {
                    select: {
                        id_kanban: true,
                        id_users: true,
                        id_department: true,
                        tgl_produksi: true,
                        nama_requester: true,
                        parts_number: true,
                        lokasi: true,
                        box: true,
                        klasifikasi: true,
                        keterangan: true,
                        status: true,
                    },
                },
            },
            orderBy: {
                id_kanban: "desc",
            },
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
     * Find incoming approvals for PC staff
     */
    static async findIncomingForPCStaff(
        userId,
        departmentId,
        rejectedNotes,
        rejectedStatuses
    ) {
        return await prisma.persetujuan.findMany({
            where: {
                id_users: parseInt(userId),
                id_department: parseInt(departmentId),
                approve: false,
                role: "STAFF",
                note: { notIn: rejectedNotes },
                requestKanban: {
                    status: { notIn: rejectedStatuses },
                },
            },
            include: {
                requestKanban: true,
            },
            orderBy: {
                id_kanban: "desc",
            },
        });
    }

    /**
     * Find manager approved Kanban IDs
     */
    static async findManagerApprovedKanbanIds(kanbanIds, departmentId) {
        const approvals = await prisma.persetujuan.findMany({
            where: {
                id_kanban: { in: kanbanIds },
                role: "MANAGER",
                approve: true,
                id_department: parseInt(departmentId),
            },
            select: { id_kanban: true },
        });

        return approvals.map((approval) => approval.id_kanban);
    }

    /**
     * Check if role already approved for a kanban
     */
    static async isRoleAlreadyApproved(kanbanId, role, departmentId) {
        const existingApproval = await prisma.persetujuan.findFirst({
            where: {
                id_kanban: parseInt(kanbanId),
                role: role,
                id_department: parseInt(departmentId),
                approve: true,
            },
        });

        return !!existingApproval;
    }

    /**
     * Auto approve all pending approvals for the same role in same department
     */
    static async autoApproveRoleInDepartment(
        kanbanId,
        role,
        departmentId,
        approvedAt,
        note
    ) {
        return await prisma.persetujuan.updateMany({
            where: {
                id_kanban: parseInt(kanbanId),
                role: role,
                id_department: parseInt(departmentId),
                approve: false,
            },
            data: {
                approve: true,
                approvedAt: approvedAt,
                note: note,
            },
        });
    }
}

module.exports = Persetujuan;

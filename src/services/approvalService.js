const prisma = require("../../prisma/client");
const Persetujuan = require("../models/Persetujuan");
const RequestKanban = require("../models/RequestKanban");
const { PC_DEPARTMENT_ID, APPROVAL_ROLES, STATUS, NOTE } = require("../utils/constants");

class ApprovalService {
    /**
     * Create initial LSM approvals for department
     */
    static async createLSMApprovals(departmentId, kanbanId) {
        const lsmUsers = await prisma.user.findMany({
            where: {
                id_department: parseInt(departmentId),
                role: { in: APPROVAL_ROLES.LSM },
            },
            select: {
                id_users: true,
                id_department: true,
                role: true,
                name: true,
                no_hp: true,
                email: true,
            },
        });

        if (lsmUsers.length > 0) {
            const approvalsData = lsmUsers.map((approver) => ({
                id_users: approver.id_users,
                id_department: approver.id_department,
                id_kanban: parseInt(kanbanId),
                role: approver.role,
                approve: false,
                note: NOTE.PENDING,
            }));

            await Persetujuan.createMany(approvalsData);
        }

        return lsmUsers;
    }

    /**
     * Handle manager approval logic
     */
    static async handleManagerApproval(userId, departmentId, kanbanId, requestDepartmentId) {
        const now = new Date();
        let notificationData = [];

        // Auto approve LEADER/SUPERVISOR when MANAGER approves
        await Persetujuan.updateMany({
            id_kanban: parseInt(kanbanId),
            id_department: parseInt(departmentId),
            role: { in: ["LEADER", "SUPERVISOR"] },
            approve: false,
        }, {
            approve: true,
            approvedAt: now,
            note: NOTE.APPROVED_BY_MANAGER,
        });

        if (departmentId === requestDepartmentId) {
            // Department Manager approving - send to PC
            await RequestKanban.updateStatus(kanbanId, STATUS.APPROVED_BY_DEPARTMENT);

            // Get PC staff
            const staffPC = await prisma.user.findMany({
                where: {
                    id_department: PC_DEPARTMENT_ID,
                    role: "STAFF",
                },
                select: {
                    id_users: true,
                    name: true,
                    email: true,
                },
            });

            if (staffPC.length > 0) {
                const approvalsData = staffPC.map((staff) => ({
                    id_users: staff.id_users,
                    id_department: PC_DEPARTMENT_ID,
                    id_kanban: parseInt(kanbanId),
                    role: "STAFF",
                    approve: false,
                    note: NOTE.PENDING,
                }));

                await Persetujuan.createManySkipDuplicates(approvalsData);

                notificationData = staffPC.map((staff) => ({
                    user: staff,
                    message: "Request Kanban baru menunggu approval Anda (Staff PC)",
                }));
            }
        } else if (departmentId === PC_DEPARTMENT_ID) {
            // PC Manager approving
            await RequestKanban.updateStatus(kanbanId, STATUS.APPROVED_BY_PC);

            // Auto approve LSM in PC department
            await Persetujuan.updateMany({
                id_kanban: parseInt(kanbanId),
                id_department: PC_DEPARTMENT_ID,
                role: { in: ["LEADER", "SUPERVISOR"] },
                approve: false,
            }, {
                approve: true,
                approvedAt: now,
                note: NOTE.APPROVED_BY_MANAGER,
            });

            // Update PC staff for closure
            const staffPC = await prisma.user.findMany({
                where: {
                    id_department: PC_DEPARTMENT_ID,
                    role: "STAFF",
                },
                select: {
                    id_users: true,
                    name: true,
                    email: true,
                },
            });

            if (staffPC.length > 0) {
                await Persetujuan.updateMany({
                    id_department: PC_DEPARTMENT_ID,
                    id_kanban: parseInt(kanbanId),
                    role: "STAFF",
                }, {
                    approve: false,
                    note: NOTE.PENDING_CLOSURE,
                });

                notificationData = staffPC.map((staff) => ({
                    user: staff,
                    message: "Request Kanban telah diapprove oleh Manager PC. Silakan klik DONE untuk menyelesaikan proses closure.",
                }));
            }
        }

        return notificationData;
    }

    /**
     * Handle PC Staff approval logic
     */
    static async handlePCStaffApproval(userId, kanbanId, requestStatus) {
        const now = new Date();
        let notificationData = [];

        const currentPersetujuan = await Persetujuan.findByCompositeKey(
            userId,
            PC_DEPARTMENT_ID,
            kanbanId,
            "STAFF"
        );

        const isClosureCase = 
            requestStatus === STATUS.APPROVED_BY_PC ||
            currentPersetujuan?.note === NOTE.PENDING_CLOSURE;

        if (isClosureCase) {
            // Closure case
            await Persetujuan.updateByCompositeKey(
                userId,
                PC_DEPARTMENT_ID,
                kanbanId,
                "STAFF",
                {
                    note: NOTE.CLOSURE,
                    approve: true,
                    approvedAt: now,
                }
            );

            return { type: "closure" };
        } else {
            // Initial PC staff approval - send to PC managers
            await RequestKanban.updateStatus(kanbanId, STATUS.PENDING_PC);

            const pcManagers = await prisma.user.findMany({
                where: {
                    id_department: PC_DEPARTMENT_ID,
                    role: { in: APPROVAL_ROLES.PC_APPROVERS },
                },
                select: {
                    id_users: true,
                    role: true,
                    name: true,
                    email: true,
                },
            });

            if (pcManagers.length > 0) {
                const approvalsData = pcManagers.map((manager) => ({
                    id_users: manager.id_users,
                    id_department: PC_DEPARTMENT_ID,
                    id_kanban: parseInt(kanbanId),
                    role: manager.role,
                    approve: false,
                    note: NOTE.PENDING,
                }));

                await Persetujuan.createManySkipDuplicates(approvalsData);

                notificationData = pcManagers.map((manager) => ({
                    user: manager,
                    message: `Request Kanban telah diapprove oleh Staff PC dan memerlukan approval ${manager.role} PC.`,
                }));
            }

            // Update closure notes
            await Persetujuan.updateMany({
                id_kanban: parseInt(kanbanId),
                note: NOTE.PENDING_CLOSURE,
            }, {
                approve: true,
                approvedAt: now,
                note: NOTE.CLOSURE,
            });

            return { type: "normal", notificationData };
        }
    }

    /**
     * Handle rejection logic
     */
    static async handleRejection(userId, departmentId, kanbanId, role, reason) {
        const status = departmentId === PC_DEPARTMENT_ID
            ? STATUS.REJECTED_BY_PC
            : STATUS.REJECTED_BY_DEPARTMENT;

        const rejectionNote = departmentId === PC_DEPARTMENT_ID
            ? NOTE.REJECTED_BY_PC
            : NOTE.REJECTED_BY_DEPARTMENT;

        // Update current user's approval to rejected
        await Persetujuan.updateByCompositeKey(
            userId,
            departmentId,
            kanbanId,
            role,
            {
                approve: false,
                note: reason || rejectionNote,
                approvedAt: new Date(),
            }
        );

        // Update kanban status
        await RequestKanban.updateStatus(kanbanId, status);

        // Batch update all pending approvals to rejected
        await Persetujuan.updateMany({
            id_kanban: parseInt(kanbanId),
            approve: false,
            note: NOTE.PENDING,
        }, {
            note: `Auto-rejected: ${reason || rejectionNote}`,
        });

        return { status, rejectionNote: reason || rejectionNote };
    }

    /**
     * Filter pending approvals based on manager approval status
     */
    static async filterPendingApprovals(pendingApprovals, userRole, departmentId) {
        if (userRole !== "LEADER" && userRole !== "SUPERVISOR") {
            return pendingApprovals;
        }

        const kanbanIds = pendingApprovals.map((approval) => approval.id_kanban);

        if (kanbanIds.length === 0) {
            return pendingApprovals;
        }

        const managerApprovedKanbanIds = await Persetujuan.findManagerApprovedKanbanIds(
            kanbanIds,
            departmentId
        );

        // Filter out kanban already approved by manager
        return pendingApprovals.filter(
            (approval) => !managerApprovedKanbanIds.includes(approval.id_kanban)
        );
    }
}

module.exports = ApprovalService;
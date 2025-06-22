const User = require("../models/User");
const RequestKanban = require("../models/RequestKanban");
const Persetujuan = require("../models/Persetujuan");
const ApprovalService = require("../services/approvalService");
const { sendBatchNotifications } = require("../utils/notification");
const {
    PC_DEPARTMENT_ID,
    STATUS,
    NOTE,
    REJECTED_NOTES,
    REJECTED_STATUSES,
} = require("../utils/constants");

/**
 * Get all Kanban requests with pagination
 */
exports.getAllKanban = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;

        const result = await RequestKanban.findAll(page, limit, search);

        res.json({
            message: "Data berhasil diambil",
            requests: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            },
        });
    } catch (err) {
        console.error("Error getting all Kanban:", err);
        res.status(500).json({
            message: "Gagal mengambil data Kanban",
        });
    }
};

/**
 * Get Kanban requests by ID
 */
exports.getKanbanById = async (req, res) => {
    try {
        const { id_kanban } = req.params;

        const kanban = await RequestKanban.findKanbanById(id_kanban);

        if (!kanban) {
            return res.status(404).json({
                success: false,
                message: "Kanban not found",
            });
        }

        res.json({
            message: "Data berhasil diambil",
            data: kanban,
        });
    } catch (err) {
        console.error("Error getting all Kanban:", err);
        res.status(500).json({
            message: "Gagal mengambil data Kanban",
        });
    }
};

/**
 * Create a new Kanban request
 */
exports.createKanban = async (req, res) => {
    const { id_users } = req.user;
    const {
        tgl_produksi,
        nama_requester,
        parts_number,
        lokasi,
        box,
        klasifikasi,
        keterangan,
    } = req.body;

    try {
        // Get user info
        const user = await User.findById(id_users);
        if (!user) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Create the kanban request
        const requestData = {
            id_users,
            id_department: user.id_department,
            tgl_produksi,
            nama_requester,
            parts_number,
            lokasi,
            box,
            klasifikasi,
            keterangan,
        };

        const newRequest = await RequestKanban.create(requestData);

        // Create LSM approvals and get notification data
        const lsmUsers = await ApprovalService.createLSMApprovals(
            user.id_department,
            newRequest.id_kanban
        );

        // Send batch notifications if there are LSM users
        if (lsmUsers.length > 0) {
            const notifications = lsmUsers.map((approver) => ({
                user: approver,
                request: newRequest,
                message: "Ada request Kanban baru yang perlu Anda approve.",
            }));

            // Send notifications asynchronously to avoid blocking response
            sendBatchNotifications(notifications);
        }

        res.json({
            message: "Request Kanban berhasil dibuat",
            kanban: newRequest,
        });
    } catch (err) {
        console.error("Error creating Kanban:", err);
        res.status(500).json({
            message: "Gagal membuat request Kanban",
        });
    }
};

/**
 * Update a Kanban request
 */
exports.updateKanban = async (req, res) => {
    const { id_users } = req.user;
    const { id_kanban } = req.params;
    const updateData = req.body;

    try {
        const kanbanId = parseInt(id_kanban);

        // Check if Kanban exists and user owns it
        const kanban = await RequestKanban.findByIdWithApprovals(kanbanId);

        if (!kanban) {
            return res.status(404).json({
                message: "Request Kanban tidak ditemukan",
            });
        }

        if (!(await RequestKanban.isOwnedByUser(kanbanId, id_users))) {
            return res.status(403).json({
                message: "Anda tidak memiliki akses untuk mengedit Kanban ini",
            });
        }

        // Check if any approvals have been made
        if (await RequestKanban.hasApprovals(kanbanId)) {
            return res.status(400).json({
                message:
                    "Request Kanban tidak dapat diedit karena sudah ada yang melakukan approve",
            });
        }

        // Update the Kanban request
        const updatedKanban = await RequestKanban.updateById(
            kanbanId,
            updateData
        );

        // Get pending approvers for notifications
        const pendingApprovers = kanban.persetujuan
            .filter((approval) => !approval.approve)
            .map((approval) => approval.user);

        // Send batch notifications asynchronously
        if (pendingApprovers.length > 0) {
            const notifications = pendingApprovers.map((user) => ({
                user,
                request: updatedKanban,
                message:
                    "Request Kanban yang perlu Anda approve telah diupdate.",
            }));

            sendBatchNotifications(notifications);
        }

        res.json({
            message: "Request Kanban berhasil diperbarui",
            kanban: updatedKanban,
        });
    } catch (err) {
        console.error("Error updating Kanban:", err);
        res.status(500).json({
            message: "Gagal memperbarui request Kanban",
        });
    }
};

/**
 * Get pending approvals for the current user
 */
exports.getPendingApprovals = async (req, res) => {
    const { id_users, role, id_department } = req.user;
    const { page = 1, limit = 10, search = "" } = req.query;

    try {
        // Get paginated pending approvals
        const pendingResult = await Persetujuan.findPendingForUser(
            id_users,
            REJECTED_NOTES,
            REJECTED_STATUSES,
            page,
            limit,
            search
        );

        let filteredData = await ApprovalService.filterPendingApprovals(
            pendingResult.data,
            role,
            id_department
        );

        filteredData = await Promise.all(
            filteredData.map(async (approval) => {
                const isRoleApproved = await Persetujuan.isRoleAlreadyApproved(
                    approval.id_kanban,
                    role,
                    id_department
                );
                return isRoleApproved ? null : approval;
            })
        );

        // Remove null values
        filteredData = filteredData.filter((approval) => approval !== null);

        res.json({
            data: filteredData,
            total: pendingResult.total,
            page: pendingResult.page,
            limit: pendingResult.limit,
            totalPages: pendingResult.totalPages,
        });
    } catch (err) {
        console.error("Error getting pending approvals:", err);
        res.status(500).json({ message: "Gagal mengambil data" });
    }
};

/**
 * Approve a Kanban request
 */
exports.approveKanban = async (req, res) => {
    const { id_kanban } = req.body;
    const { id_users, role, id_department } = req.user;

    try {
        const now = new Date();

        const isRoleApproved = await Persetujuan.isRoleAlreadyApproved(
            id_kanban,
            role,
            id_department
        );

        if (isRoleApproved) {
            return res.status(400).json({
                message: `Role ${role} sudah melakukan approve untuk request ini`,
            });
        }

        // Get request info
        const request = await RequestKanban.findById(id_kanban);
        if (!request) {
            return res.status(404).json({
                message: "Request Kanban tidak ditemukan",
            });
        }

        await Persetujuan.autoApproveRoleInDepartment(
            id_kanban,
            role,
            id_department,
            now,
            NOTE.APPROVED
        );

        let notificationData = [];
        let responseType = "normal";

        // Handle different approval scenarios
        if (role === "MANAGER") {
            notificationData = await ApprovalService.handleManagerApproval(
                id_users,
                id_department,
                id_kanban,
                request.id_department
            );
        } else if (role === "STAFF" && id_department === PC_DEPARTMENT_ID) {
            const result = await ApprovalService.handlePCStaffApproval(
                id_users,
                id_kanban,
                request.status
            );

            responseType = result.type;
            notificationData = result.notificationData || [];
        }

        // Send notifications asynchronously
        if (notificationData.length > 0) {
            const notifications = notificationData.map((item) => ({
                user: item.user,
                request: request,
                message: item.message,
            }));

            sendBatchNotifications(notifications);
        }

        const message =
            responseType === "closure"
                ? "Request Kanban telah di-closure oleh STAFF"
                : role === "STAFF" && id_department === PC_DEPARTMENT_ID
                ? "Staff PC approval berhasil dilakukan"
                : "Persetujuan berhasil dilakukan";

        res.status(200).json({
            message,
            info: `Semua ${role} di department ini telah di-approve secara otomatis`,
        });
    } catch (error) {
        console.error("Error approving Kanban:", error);
        res.status(500).json({
            message: "Terjadi kesalahan saat melakukan persetujuan",
        });
    }
};

/**
 * Get all requests created by the current user
 */
exports.getMyRequests = async (req, res) => {
    try {
        const myRequests = await RequestKanban.findByUserId(req.user.id_users);
        res.json({ requests: myRequests });
    } catch (err) {
        console.error("Error getting my requests:", err);
        res.status(500).json({ message: "Gagal mengambil data" });
    }
};

/**
 * Get all approved Kanban requests
 */
exports.getApprovedKanban = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.query.role || "";
        const search = req.query.search || "";
        const userId = parseInt(req.query.userId);
        const departmentId = parseInt(req.query.departmentId);

        if (!userId || !departmentId) {
            return res.status(400).json({
                message: "User ID dan Department ID harus disertakan",
            });
        }

        const approvedKanban = await RequestKanban.findApproved(
            page,
            limit,
            role,
            search,
            userId,
            departmentId
        );

        res.json({ approved: approvedKanban });
    } catch (error) {
        console.error("Error getting approved Kanban:", error);
        res.status(500).json({
            message: "Gagal mengambil data approved kanban",
        });
    }
};

/**
 * Get incoming Kanban requests for PC staff
 */
exports.getIncomingForPC = async (req, res) => {
    const { id_users, role } = req.user;

    if (role !== "STAFF") {
        return res.status(403).json({
            message: "Hanya Staff PC yang dapat mengakses ini",
        });
    }

    try {
        const incoming = await Persetujuan.findIncomingForPCStaff(
            id_users,
            PC_DEPARTMENT_ID,
            REJECTED_NOTES,
            REJECTED_STATUSES
        );

        res.json({ incoming });
    } catch (error) {
        console.error("Error getting incoming for PC:", error);
        res.status(500).json({
            message: "Gagal mengambil data",
        });
    }
};

/**
 * Get all Kanban requests approved by PC
 */
exports.getApprovedByPCKanban = async (req, res) => {
    try {
        const approvedKanbanList = await RequestKanban.findApprovedByPC();
        res.status(200).json(approvedKanbanList);
    } catch (err) {
        console.error("Error getting approved by PC Kanban:", err);
        res.status(500).json({
            message: "Gagal mengambil data kanban yang disetujui PC",
        });
    }
};

/**
 * Reject a Kanban request
 */
exports.rejectKanban = async (req, res) => {
    const { id_kanban, alasan } = req.body;
    const { id_users, id_department, role } = req.user;

    try {
        // Get request with user info for notification
        const request = await RequestKanban.findByIdWithUser(id_kanban);
        if (!request) {
            return res.status(404).json({
                message: "Request Kanban tidak ditemukan",
            });
        }

        // Handle rejection logic
        const result = await ApprovalService.handleRejection(
            id_users,
            id_department,
            id_kanban,
            role,
            alasan
        );

        // Send notification to requesting user asynchronously
        if (request.user) {
            const notifications = [
                {
                    user: request.user,
                    request: request,
                    message: `Request Kanban Anda telah ditolak dengan alasan: ${result.rejectionNote}`,
                },
            ];

            sendBatchNotifications(notifications);
        }

        res.json({
            message: "Request Kanban ditolak",
            status: result.status,
            detail: "Semua approval yang pending untuk kanban ini telah diubah menjadi rejected",
        });
    } catch (error) {
        console.error("Error rejecting Kanban:", error);
        res.status(500).json({
            message: "Gagal menolak request Kanban",
        });
    }
};

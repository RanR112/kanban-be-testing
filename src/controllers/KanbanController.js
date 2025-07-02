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
const {
    asyncHandler,
    ResponseUtil,
    NotFoundError,
    ValidationError,
    ForbiddenError,
    ConflictError,
} = require("../middlewares/ErrorHandler");

/**
 * Get all Kanban requests with enhanced pagination and filtering
 */
exports.getAllKanban = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "id_kanban",
        sortOrder = "desc",
        status = null,
        dateFrom = null,
        dateTo = null,
    } = req.query;

    // Validate pagination parameters
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Max 100 items per page

    const result = await RequestKanban.findAll(
        pageNum,
        limitNum,
        search,
        sortBy,
        sortOrder
    );

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        result.pagination,
        "Kanban requests retrieved successfully"
    );
});

/**
 * Get Kanban request by ID with enhanced data
 */
exports.getKanbanById = asyncHandler(async (req, res) => {
    const { id_kanban } = req.params;

    if (!id_kanban || isNaN(parseInt(id_kanban))) {
        throw new ValidationError("Invalid kanban ID provided");
    }

    const kanban = await RequestKanban.findKanbanById(id_kanban);

    if (!kanban) {
        throw new NotFoundError("Kanban request");
    }

    return ResponseUtil.success(
        res,
        kanban,
        "Kanban request retrieved successfully"
    );
});

/**
 * Create a new Kanban request with enhanced validation
 */
exports.createKanban = asyncHandler(async (req, res) => {
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

    // Enhanced input validation
    if (!tgl_produksi || !nama_requester || !parts_number || !lokasi) {
        throw new ValidationError("Required fields missing", [
            { field: "tgl_produksi", message: "Production date is required" },
            { field: "nama_requester", message: "Requester name is required" },
            { field: "parts_number", message: "Parts number is required" },
            { field: "lokasi", message: "Location is required" },
        ]);
    }

    // Validate production date
    const prodDate = new Date(tgl_produksi);
    if (isNaN(prodDate.getTime())) {
        throw new ValidationError("Invalid production date format");
    }

    // Check if production date is not in the past (optional business rule)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (prodDate < today) {
        throw new ValidationError("Production date cannot be in the past");
    }

    // Get user info with department validation
    const user = await User.findById(id_users);
    if (!user) {
        throw new NotFoundError("User");
    }

    if (!user.department) {
        throw new ValidationError("User department not found or invalid");
    }

    // Prepare request data
    const requestData = {
        id_users,
        id_department: user.id_department,
        tgl_produksi: prodDate,
        nama_requester: nama_requester.trim(),
        parts_number: parts_number.trim().toUpperCase(),
        lokasi: lokasi.trim(),
        box: box?.trim() || "",
        klasifikasi: klasifikasi?.trim() || "",
        keterangan: keterangan?.trim() || "",
    };

    // Create the kanban request
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
            message: `Ada request Kanban baru dari ${nama_requester} yang perlu Anda approve.`,
        }));

        // Send notifications asynchronously to avoid blocking response
        sendBatchNotifications(notifications).catch((err) => {
            console.error("Failed to send notifications:", err);
        });
    }

    return ResponseUtil.created(
        res,
        {
            ...newRequest,
            approvers_notified: lsmUsers.length,
        },
        "Kanban request created successfully"
    );
});

/**
 * Update a Kanban request with enhanced validation
 */
exports.updateKanban = asyncHandler(async (req, res) => {
    const { id_users } = req.user;
    const { id_kanban } = req.params;
    const updateData = req.body;

    if (!id_kanban || isNaN(parseInt(id_kanban))) {
        throw new ValidationError("Invalid kanban ID provided");
    }

    const kanbanId = parseInt(id_kanban);

    // Check if Kanban exists and user owns it
    const kanban = await RequestKanban.findByIdWithApprovals(kanbanId);

    if (!kanban) {
        throw new NotFoundError("Kanban request");
    }

    if (!(await RequestKanban.isOwnedByUser(kanbanId, id_users))) {
        throw new ForbiddenError(
            "You don't have permission to edit this Kanban request"
        );
    }

    // Check if any approvals have been made
    if (await RequestKanban.hasApprovals(kanbanId)) {
        throw new ConflictError(
            "Request cannot be edited because approvals have already been made",
            { hasApprovals: true }
        );
    }

    // Validate and sanitize update data
    const allowedFields = [
        "tgl_produksi",
        "nama_requester",
        "parts_number",
        "lokasi",
        "box",
        "klasifikasi",
        "keterangan",
    ];

    const sanitizedUpdateData = {};
    Object.keys(updateData).forEach((key) => {
        if (allowedFields.includes(key) && updateData[key] !== undefined) {
            if (key === "tgl_produksi") {
                const prodDate = new Date(updateData[key]);
                if (isNaN(prodDate.getTime())) {
                    throw new ValidationError("Invalid production date format");
                }
                sanitizedUpdateData[key] = prodDate;
            } else if (typeof updateData[key] === "string") {
                sanitizedUpdateData[key] = updateData[key].trim();
                if (key === "parts_number") {
                    sanitizedUpdateData[key] =
                        sanitizedUpdateData[key].toUpperCase();
                }
            } else {
                sanitizedUpdateData[key] = updateData[key];
            }
        }
    });

    if (Object.keys(sanitizedUpdateData).length === 0) {
        throw new ValidationError("No valid fields provided for update");
    }

    // Update the Kanban request
    const updatedKanban = await RequestKanban.updateById(
        kanbanId,
        sanitizedUpdateData,
        id_users
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
            message: `Request Kanban dari ${updatedKanban.nama_requester} telah diupdate dan perlu review ulang.`,
        }));

        sendBatchNotifications(notifications).catch((err) => {
            console.error("Failed to send update notifications:", err);
        });
    }

    return ResponseUtil.updated(
        res,
        {
            ...updatedKanban,
            approvers_notified: pendingApprovers.length,
        },
        "Kanban request updated successfully"
    );
});

/**
 * Get pending approvals for the current user with enhanced filtering
 */
exports.getPendingApprovals = asyncHandler(async (req, res) => {
    const { id_users, role, id_department } = req.user;
    const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "id_kanban",
        sortOrder = "desc",
    } = req.query;

    // Validate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    // Get paginated pending approvals
    const pendingResult = await Persetujuan.findPendingForUser(
        id_users,
        REJECTED_NOTES,
        REJECTED_STATUSES,
        pageNum,
        limitNum,
        search
    );

    let filteredData = await ApprovalService.filterPendingApprovals(
        pendingResult.data,
        role,
        id_department
    );

    // Check if role has already approved each request
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

    // Remove null values and add metadata
    filteredData = filteredData
        .filter((approval) => approval !== null)
        .map((approval) => ({
            ...approval,
            can_approve: true,
            approval_deadline: this.calculateApprovalDeadline(
                approval.requestKanban.created_at
            ),
        }));

    return ResponseUtil.successWithPagination(
        res,
        filteredData,
        {
            ...pendingResult,
            filtered_count: filteredData.length,
        },
        "Pending approvals retrieved successfully"
    );
});

/**
 * Approve a Kanban request with enhanced validation
 */
exports.approveKanban = asyncHandler(async (req, res) => {
    const { id_kanban } = req.body;
    const { id_users, role, id_department } = req.user;

    if (!id_kanban || isNaN(parseInt(id_kanban))) {
        throw new ValidationError("Invalid kanban ID provided");
    }

    const kanbanId = parseInt(id_kanban);

    // Check if role has already approved
    const isRoleApproved = await Persetujuan.isRoleAlreadyApproved(
        kanbanId,
        role,
        id_department
    );

    if (isRoleApproved) {
        throw new ConflictError(
            `Role ${role} has already approved this request`,
            { role, already_approved: true }
        );
    }

    // Get request info
    const request = await RequestKanban.findById(kanbanId);
    if (!request) {
        throw new NotFoundError("Kanban request");
    }

    // Check if request is in a valid state for approval
    if (REJECTED_STATUSES.includes(request.status)) {
        throw new ConflictError("Cannot approve a rejected request", {
            current_status: request.status,
        });
    }

    const now = new Date();

    // Auto approve all users with same role in same department
    await Persetujuan.autoApproveRoleInDepartment(
        kanbanId,
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
            kanbanId,
            request.id_department
        );
    } else if (role === "STAFF" && id_department === PC_DEPARTMENT_ID) {
        const result = await ApprovalService.handlePCStaffApproval(
            id_users,
            kanbanId,
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

        sendBatchNotifications(notifications).catch((err) => {
            console.error("Failed to send approval notifications:", err);
        });
    }

    // Prepare response message
    const message =
        responseType === "closure"
            ? "Request Kanban has been closed successfully"
            : role === "STAFF" && id_department === PC_DEPARTMENT_ID
            ? "PC Staff approval completed successfully"
            : "Approval completed successfully";

    const responseData = {
        id_kanban: kanbanId,
        approved_by: {
            user_id: id_users,
            role,
            department_id: id_department,
            approved_at: now,
        },
        notifications_sent: notificationData.length,
        approval_type: responseType,
    };

    return ResponseUtil.success(res, responseData, message);
});

/**
 * Get user's own requests with enhanced filtering
 */
exports.getMyRequests = asyncHandler(async (req, res) => {
    const { id_users } = req.user;
    const {
        page = 1,
        limit = 10,
        search = "",
        status = null,
        dateFrom = null,
        dateTo = null,
    } = req.query;

    // ✅ DEBUG LOGS
    console.log("=== DEBUG getMyRequests ===");
    console.log("🔍 User ID:", id_users);
    console.log("🔍 Search term:", `"${search}"`);
    console.log("🔍 Search length:", search.length);
    console.log("🔍 All req.query:", req.query);
    console.log("=============================");

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));

    const result = await RequestKanban.findByUserId(
        id_users,
        pageNum,
        limitNum,
        search, // Pastikan parameter ini ada
        status
    );

    console.log("🔍 Result from model:");
    console.log("  - Total found:", result.pagination.total);
    console.log("  - Data length:", result.data.length);

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        result.pagination,
        "Your requests retrieved successfully"
    );
});

/**
 * Get approved Kanban requests with enhanced filtering
 */
exports.getApprovedKanban = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        role = "",
        search = "",
        dateFrom = null,
        dateTo = null,
        sortBy = "tgl_produksi",
        sortOrder = "desc",
    } = req.query;
    const { id_users: userId, id_department: departmentId } = req.user;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const options = {
        page: pageNum,
        limit: limitNum,
        role,
        search,
        userId,
        departmentId,
        dateFrom,
        dateTo,
        sortBy,
        sortOrder,
    };

    const result = await RequestKanban.findApproved(options);

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        result.pagination,
        "Approved requests retrieved successfully"
    );
});

/**
 * Get incoming requests for PC staff
 */
exports.getIncomingForPC = asyncHandler(async (req, res) => {
    const { id_users, role, id_department } = req.user;

    if (id_department !== PC_DEPARTMENT_ID) {
        throw new ForbiddenError("Only PC can access this endpoint");
    }

    const incoming = await Persetujuan.findIncomingForPCStaff(
        id_users,
        PC_DEPARTMENT_ID,
        REJECTED_NOTES,
        REJECTED_STATUSES
    );

    const enrichedIncoming = incoming.map((approval) => ({
        ...approval,
        priority: this.calculatePriority(approval.requestKanban),
        days_pending: this.calculateDaysPending(approval.created_at),
    }));

    return ResponseUtil.success(
        res,
        enrichedIncoming,
        "Incoming PC requests retrieved successfully"
    );
});

/**
 * Get requests approved by PC
 */
exports.getApprovedByPCKanban = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));

    const result = await RequestKanban.findApprovedByPC(pageNum, limitNum);

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        result.pagination,
        "PC approved requests retrieved successfully"
    );
});

/**
 * Reject a Kanban request with enhanced validation
 */
exports.rejectKanban = asyncHandler(async (req, res) => {
    const { id_kanban, alasan } = req.body;
    const { id_users, id_department, role } = req.user;

    if (!id_kanban || isNaN(parseInt(id_kanban))) {
        throw new ValidationError("Invalid kanban ID provided");
    }

    if (!alasan || alasan.trim().length < 10) {
        throw new ValidationError(
            "Rejection reason must be at least 10 characters long"
        );
    }

    const kanbanId = parseInt(id_kanban);

    // Get request with user info for notification
    const request = await RequestKanban.findByIdWithUser(kanbanId);
    if (!request) {
        throw new NotFoundError("Kanban request");
    }

    // Check if request is already rejected
    if (REJECTED_STATUSES.includes(request.status)) {
        throw new ConflictError("Request has already been rejected", {
            current_status: request.status,
        });
    }

    // Handle rejection logic
    const result = await ApprovalService.handleRejection(
        id_users,
        id_department,
        kanbanId,
        role,
        alasan.trim()
    );

    // Send notification to requesting user asynchronously
    if (request.user) {
        const notifications = [
            {
                user: request.user,
                request: request,
                message: `Request Kanban Anda telah ditolak oleh ${role}. Alasan: ${alasan.trim()}`,
            },
        ];

        sendBatchNotifications(notifications).catch((err) => {
            console.error("Failed to send rejection notifications:", err);
        });
    }

    const responseData = {
        id_kanban: kanbanId,
        rejected_by: {
            user_id: id_users,
            role,
            department_id: id_department,
            rejected_at: new Date(),
        },
        rejection_reason: alasan.trim(),
        new_status: result.status,
    };

    return ResponseUtil.success(
        res,
        responseData,
        "Kanban request rejected successfully"
    );
});

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = asyncHandler(async (req, res) => {
    const { id_users, role, id_department } = req.user;

    // Different stats based on user role
    let statsPromises = [];

    if (role === "ADMIN") {
        // Admin gets overall statistics
        statsPromises = [
            RequestKanban.getRequestStats(),
            RequestKanban.getRequestStats(null, id_department),
        ];
    } else {
        // Regular users get their own stats + department stats
        statsPromises = [
            RequestKanban.getRequestStats(id_users),
            RequestKanban.getRequestStats(null, id_department),
        ];
    }

    const [userStats, departmentStats] = await Promise.all(statsPromises);

    return ResponseUtil.success(
        res,
        {
            user_stats: userStats,
            department_stats: departmentStats,
            role,
            generated_at: new Date(),
        },
        "Dashboard statistics retrieved successfully"
    );
});

// Helper methods
exports.calculateApprovalDeadline = (createdAt) => {
    const deadline = new Date(createdAt);
    deadline.setDate(deadline.getDate() + 3); // 3 days deadline
    return deadline;
};

exports.calculatePriority = (request) => {
    const daysSinceCreated = Math.floor(
        (Date.now() - new Date(request.created_at).getTime()) /
            (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreated >= 3) return "HIGH";
    if (daysSinceCreated >= 1) return "MEDIUM";
    return "LOW";
};

exports.calculateDaysPending = (createdAt) => {
    return Math.floor(
        (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
};

const AuditLogService = require("../services/AuditLogService");
const { ResponseUtil, asyncHandler } = require("../middlewares/ErrorHandler");

/**
 * Get all audit logs with filtering and pagination
 */
exports.getAllAuditLogs = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        search = "",
        sortBy = "created_at",
        sortOrder = "desc",
        userId,
        action,
        tableName,
        startDate,
        endDate,
        ipAddress,
    } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search: search.trim(),
        sortBy,
        sortOrder,
        userId: userId ? parseInt(userId) : null,
        action: action ? action.trim() : null,
        tableName: tableName ? tableName.trim() : null,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
        ipAddress: ipAddress ? ipAddress.trim() : null,
    };

    const result = await AuditLogService.findAll(options);

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
        },
        "Audit logs retrieved successfully"
    );
});

/**
 * Get audit log by ID with detailed information
 */
exports.getAuditLogById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return ResponseUtil.validationError(res, [
            { field: "id", message: "Valid audit log ID is required" },
        ]);
    }

    const auditLog = await AuditLogService.findById(id);

    if (!auditLog) {
        return ResponseUtil.notFound(res, "Audit log");
    }

    return ResponseUtil.success(
        res,
        auditLog,
        "Audit log details retrieved successfully"
    );
});

/**
 * Get audit logs for a specific user
 */
exports.getAuditLogsByUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 20, action, startDate, endDate } = req.query;

    if (!userId || isNaN(parseInt(userId))) {
        return ResponseUtil.validationError(res, [
            { field: "userId", message: "Valid user ID is required" },
        ]);
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        action: action ? action.trim() : null,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
    };

    const result = await AuditLogService.findByUserId(userId, options);

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
        },
        `Audit logs for user ${userId} retrieved successfully`
    );
});

/**
 * Get audit logs for a specific table
 */
exports.getAuditLogsByTable = asyncHandler(async (req, res) => {
    const { tableName } = req.params;
    const { page = 1, limit = 20, recordId, startDate, endDate } = req.query;

    if (!tableName || !tableName.trim()) {
        return ResponseUtil.validationError(res, [
            { field: "tableName", message: "Table name is required" },
        ]);
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        recordId: recordId ? parseInt(recordId) : null,
        startDate: startDate ? startDate : null,
        endDate: endDate ? endDate : null,
    };

    const result = await AuditLogService.findByTable(tableName.trim(), options);

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
        },
        `Audit logs for table ${tableName} retrieved successfully`
    );
});

/**
 * Get audit trail for a specific record
 */
exports.getRecordAuditTrail = asyncHandler(async (req, res) => {
    const { tableName, recordId } = req.params;

    if (!tableName || !tableName.trim()) {
        return ResponseUtil.validationError(res, [
            { field: "tableName", message: "Table name is required" },
        ]);
    }

    if (!recordId || isNaN(parseInt(recordId))) {
        return ResponseUtil.validationError(res, [
            { field: "recordId", message: "Valid record ID is required" },
        ]);
    }

    const auditTrail = await AuditLogService.getRecordAuditTrail(
        tableName.trim(),
        recordId
    );

    return ResponseUtil.success(
        res,
        auditTrail,
        `Audit trail for ${tableName} record ${recordId} retrieved successfully`
    );
});

/**
 * Get audit log statistics
 */
exports.getAuditLogStatistics = asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    const options = {};
    if (startDate) options.startDate = startDate;
    if (endDate) options.endDate = endDate;

    const statistics = await AuditLogService.getStatistics(options);

    return ResponseUtil.success(
        res,
        statistics,
        "Audit log statistics retrieved successfully"
    );
});

/**
 * Get recent audit activity
 */
exports.getRecentActivity = asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;

    const recentActivity = await AuditLogService.getRecentActivity(
        parseInt(limit)
    );

    return ResponseUtil.success(
        res,
        recentActivity,
        "Recent audit activity retrieved successfully"
    );
});

/**
 * Export audit logs to CSV
 */
exports.exportAuditLogs = asyncHandler(async (req, res) => {
    const { startDate, endDate, userId, action, format = "csv" } = req.query;

    if (format !== "csv") {
        return ResponseUtil.validationError(res, [
            {
                field: "format",
                message: "Only CSV format is currently supported",
            },
        ]);
    }

    const options = {};
    if (startDate) options.startDate = startDate;
    if (endDate) options.endDate = endDate;
    if (userId) options.userId = parseInt(userId);
    if (action) options.action = action.trim();

    const csvData = await AuditLogService.exportToCsv(options);

    // Set headers for file download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${csvData.filename}"`
    );

    // Create CSV content
    const csvContent = [
        csvData.headers.join(","),
        ...csvData.data.map((row) =>
            row
                .map((cell) =>
                    typeof cell === "string" &&
                    (cell.includes(",") ||
                        cell.includes('"') ||
                        cell.includes("\n"))
                        ? `"${cell.replace(/"/g, '""')}"`
                        : cell
                )
                .join(",")
        ),
    ].join("\n");

    res.send(csvContent);
});

/**
 * Get audit log summary/dashboard data
 */
exports.getAuditLogDashboard = asyncHandler(async (req, res) => {
    const { period = "week" } = req.query; // week, month, year

    // Calculate date range based on period
    const now = new Date();
    let startDate;

    switch (period) {
        case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case "month":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
        case "year":
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
        default:
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    const [statistics, recentActivity] = await Promise.all([
        AuditLogService.getStatistics({
            startDate: startDate.toISOString(),
            endDate: now.toISOString(),
        }),
        AuditLogService.getRecentActivity(5),
    ]);

    const dashboardData = {
        period: {
            type: period,
            startDate: startDate.toISOString(),
            endDate: now.toISOString(),
        },
        statistics,
        recentActivity,
        summary: {
            totalLogs: statistics.total,
            uniqueActions: statistics.byAction.length,
            uniqueTables: statistics.byTable.length,
            activeUsers: statistics.topActiveUsers.length,
        },
    };

    return ResponseUtil.success(
        res,
        dashboardData,
        "Audit log dashboard data retrieved successfully"
    );
});

/**
 * Search audit logs with advanced filters
 */
exports.searchAuditLogs = asyncHandler(async (req, res) => {
    const {
        q: searchTerm = "",
        page = 1,
        limit = 20,
        filters = {},
    } = req.query;

    if (!searchTerm.trim()) {
        return ResponseUtil.validationError(res, [
            { field: "q", message: "Search term is required" },
        ]);
    }

    // Parse filters if provided as JSON string
    let parsedFilters = {};
    if (typeof filters === "string") {
        try {
            parsedFilters = JSON.parse(filters);
        } catch (error) {
            return ResponseUtil.validationError(res, [
                { field: "filters", message: "Invalid filters format" },
            ]);
        }
    } else {
        parsedFilters = filters;
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search: searchTerm.trim(),
        ...parsedFilters,
    };

    const result = await AuditLogService.findAll(options);

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
        },
        "Audit log search completed successfully"
    );
});

/**
 * Get available audit log actions (for filter dropdown)
 */
exports.getAvailableActions = asyncHandler(async (req, res) => {
    const actions = await AuditLogService.getAvailableActions();

    return ResponseUtil.success(
        res,
        actions,
        "Available audit log actions retrieved successfully"
    );
});

/**
 * Get available table names (for filter dropdown)
 */
exports.getAvailableTables = asyncHandler(async (req, res) => {
    const tables = await AuditLogService.getAvailableTables();

    return ResponseUtil.success(
        res,
        tables,
        "Available table names retrieved successfully"
    );
});

/**
 * Health check for audit log system
 */
exports.healthCheck = asyncHandler(async (req, res) => {
    try {
        // Simple query to check if audit log system is working
        const recentCount = await AuditLogService.getRecentActivity(1);

        const healthData = {
            status: "healthy",
            timestamp: new Date().toISOString(),
            service: "audit_log",
            version: "1.0.0",
            checks: {
                database_connection: "ok",
                recent_logs_accessible:
                    recentCount.length >= 0 ? "ok" : "warning",
            },
        };

        return ResponseUtil.success(
            res,
            healthData,
            "Audit log service is healthy"
        );
    } catch (error) {
        const healthData = {
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            service: "audit_log",
            version: "1.0.0",
            error: error.message,
            checks: {
                database_connection: "error",
                recent_logs_accessible: "error",
            },
        };

        return ResponseUtil.error(
            res,
            "Audit log service health check failed",
            503,
            "SERVICE_UNHEALTHY",
            healthData
        );
    }
});

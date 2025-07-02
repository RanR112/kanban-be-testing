const express = require("express");
const kanbanRouter = express.Router();

// Controllers
const {
    createKanban,
    getPendingApprovals,
    approveKanban,
    getApprovedKanban,
    getMyRequests,
    getIncomingForPC,
    getApprovedByPCKanban,
    rejectKanban,
    updateKanban,
    getAllKanban,
    getKanbanById,
    getDashboardStats,
} = require("../controllers/KanbanController");

// Middleware
const { 
    authenticateToken,
    authorizeRoles,
    checkDepartmentAccess,
    checkDepartmentMembership,
    rateLimitSensitive,
    logAuthEvent,
} = require("../middlewares/AuthMiddleware");

const {
    validateCreateKanban,
    validateUpdateKanban,
    validateApproveKanban,
    validateRejectKanban,
    validateQueryParams,
    validatePathParams,
    securityValidation,
    fileUploadValidation,
    createRateLimit,
    validateBulkOperation,
} = require("../validators/kanbanValidator");

const {
    globalErrorHandler,
    sanitizeInput,
} = require("../middlewares/ErrorHandler");

// Rate limiting configurations

// Apply global middleware to all routes
kanbanRouter.use(authenticateToken);
kanbanRouter.use(sanitizeInput);
kanbanRouter.use(securityValidation);

// Audit logging for sensitive operations
const auditSensitiveOperations = logAuthEvent("KANBAN_OPERATION");

/**
 * Public Kanban Routes (accessible by all authenticated users)
 */

// Get all Kanban requests with enhanced filtering
kanbanRouter.get(
    "/all",
    // validateQueryParams,
    getAllKanban
);

// Get specific Kanban request by ID
kanbanRouter.get(
    "/get/:id_kanban",
    // validatePathParams,
    getKanbanById
);

// Get user's own requests
kanbanRouter.get(
    "/mine",
    validateQueryParams,
    getMyRequests
);

// Get dashboard statistics
kanbanRouter.get(
    "/dashboard-stats",
    getDashboardStats
);

/**
 * Request Management Routes
 */

// Create new Kanban request
kanbanRouter.post(
    "/request",
    validateCreateKanban,
    fileUploadValidation.validate,
    auditSensitiveOperations,
    createKanban
);

// Update existing Kanban request
kanbanRouter.put(
    "/:id_kanban",
    validatePathParams,
    validateUpdateKanban,
    auditSensitiveOperations,
    updateKanban
);

/**
 * Approval Management Routes
 */

// Get pending approvals for current user
kanbanRouter.get(
    "/pending",
    validateQueryParams,
    authorizeRoles("LEADER", "SUPERVISOR", "MANAGER", "STAFF"),
    getPendingApprovals
);

// Approve Kanban request
kanbanRouter.post(
    "/approve",
    validateApproveKanban,
    authorizeRoles("LEADER", "SUPERVISOR", "MANAGER", "STAFF"),
    auditSensitiveOperations,
    approveKanban
);

// Reject Kanban request
kanbanRouter.post(
    "/reject",
    validateRejectKanban,
    authorizeRoles("LEADER", "SUPERVISOR", "MANAGER", "STAFF"),
    auditSensitiveOperations,
    rejectKanban
);

// Get approved Kanban requests
kanbanRouter.get(
    "/approved",
    validateQueryParams,
    authorizeRoles("LEADER", "SUPERVISOR", "MANAGER", "STAFF"),
    getApprovedKanban
);

/**
 * PC Department Specific Routes
 */

// Get incoming requests for PC staff
kanbanRouter.get(
    "/incoming-pc",
    checkDepartmentMembership(1), // PC Department ID = 1
    authorizeRoles("STAFF"),
    getIncomingForPC
);

// Get requests approved by PC
kanbanRouter.get(
    "/done",
    validateQueryParams,
    getApprovedByPCKanban
);

/**
 * Admin Routes (Bulk Operations)
 */

// Bulk approve multiple requests
kanbanRouter.post(
    "/bulk/approve",
    authorizeRoles("ADMIN", "MANAGER"),
    validateBulkOperation,
    auditSensitiveOperations,
    async (req, res, next) => {
        try {
            const { kanban_ids } = req.validatedBody;
            const { id_users, role } = req.user;

            // Process bulk approval
            const results = [];
            for (const kanbanId of kanban_ids) {
                try {
                    // Reuse the single approval logic
                    req.body = { id_kanban: kanbanId };
                    await approveKanban(req, res, () => {});
                    results.push({ id_kanban: kanbanId, status: 'success' });
                } catch (error) {
                    results.push({ 
                        id_kanban: kanbanId, 
                        status: 'failed', 
                        error: error.message 
                    });
                }
            }

            return res.json({
                success: true,
                message: "Bulk approval completed",
                results,
                summary: {
                    total: kanban_ids.length,
                    successful: results.filter(r => r.status === 'success').length,
                    failed: results.filter(r => r.status === 'failed').length,
                },
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            next(error);
        }
    }
);

// Bulk reject multiple requests
kanbanRouter.post(
    "/bulk/reject",
    authorizeRoles("ADMIN", "MANAGER"),
    validateBulkOperation,
    auditSensitiveOperations,
    async (req, res, next) => {
        try {
            const { kanban_ids, reason } = req.validatedBody;
            const { id_users, role } = req.user;

            const results = [];
            for (const kanbanId of kanban_ids) {
                try {
                    req.body = { id_kanban: kanbanId, alasan: reason };
                    await rejectKanban(req, res, () => {});
                    results.push({ id_kanban: kanbanId, status: 'success' });
                } catch (error) {
                    results.push({ 
                        id_kanban: kanbanId, 
                        status: 'failed', 
                        error: error.message 
                    });
                }
            }

            return res.json({
                success: true,
                message: "Bulk rejection completed",
                results,
                summary: {
                    total: kanban_ids.length,
                    successful: results.filter(r => r.status === 'success').length,
                    failed: results.filter(r => r.status === 'failed').length,
                },
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            next(error);
        }
    }
);

/**
 * Analytics & Reporting Routes
 */

// Get detailed analytics (Admin only)
kanbanRouter.get(
    "/analytics",
    authorizeRoles("ADMIN"),
    validateQueryParams,
    async (req, res, next) => {
        try {
            const { dateFrom, dateTo, departmentId } = req.validatedQuery;
            
            // Calculate analytics data
            const analytics = await RequestKanban.getAnalytics({
                dateFrom,
                dateTo,
                departmentId,
            });

            return res.json({
                success: true,
                message: "Analytics data retrieved successfully",
                data: analytics,
                timestamp: new Date().toISOString(),
            });
        } catch (error) {
            next(error);
        }
    }
);

// Export data (Admin/Manager only)
kanbanRouter.get(
    "/export",
    authorizeRoles("ADMIN", "MANAGER"),
    validateQueryParams,
    rateLimitSensitive(5, 60 * 60 * 1000), // 5 exports per hour
    async (req, res, next) => {
        try {
            const { format = "csv", dateFrom, dateTo } = req.validatedQuery;
            
            // Generate export data
            const exportData = await RequestKanban.exportData({
                format,
                dateFrom,
                dateTo,
                userId: req.user.id_users,
            });

            // Set appropriate headers for file download
            res.setHeader('Content-Type', 
                format === 'csv' ? 'text/csv' : 'application/json'
            );
            res.setHeader('Content-Disposition', 
                `attachment; filename="kanban-export-${new Date().toISOString().split('T')[0]}.${format}"`
            );

            return res.send(exportData);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * Health Check & System Status
 */

// Health check endpoint
kanbanRouter.get(
    "/health",
    async (req, res) => {
        try {
            // Simple database connectivity check
            const healthCheck = await prisma.$queryRaw`SELECT 1 as status`;
            
            return res.json({
                success: true,
                message: "Service is healthy",
                data: {
                    status: "healthy",
                    timestamp: new Date().toISOString(),
                    database: healthCheck ? "connected" : "disconnected",
                    uptime: process.uptime(),
                },
            });
        } catch (error) {
            return res.status(503).json({
                success: false,
                message: "Service is unhealthy",
                data: {
                    status: "unhealthy",
                    timestamp: new Date().toISOString(),
                    error: error.message,
                },
            });
        }
    }
);

/**
 * Error Handling
 */

// 404 handler for undefined routes
kanbanRouter.use("*", (req, res) => {
    return res.status(404).json({
        success: false,
        message: "Kanban endpoint not found",
        code: "ENDPOINT_NOT_FOUND",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
});

// Apply global error handler
kanbanRouter.use(globalErrorHandler);

module.exports = kanbanRouter;
const express = require("express");
const {
    authenticateToken,
    authorizeAdmin,
    rateLimitSensitive,
} = require("../middlewares/AuthMiddleware");
const { sanitizeInput } = require("../middlewares/ErrorHandler");
const {
    getAllAuditLogs,
    getAuditLogById,
    getAuditLogsByUser,
    getAuditLogsByTable,
    getRecordAuditTrail,
    getAuditLogStatistics,
    getRecentActivity,
    exportAuditLogs,
    getAuditLogDashboard,
    searchAuditLogs,
    healthCheck,
} = require("../controllers/AuditLogController");

const auditLogRouter = express.Router();

// Apply authentication and admin authorization to all routes
auditLogRouter.use(authenticateToken);
auditLogRouter.use(authorizeAdmin); // Only admin can access audit logs

// Apply input sanitization
auditLogRouter.use(sanitizeInput);

// Rate limiting for export operations
const exportRateLimit = rateLimitSensitive(
    60 * 60 * 1000, // 1 hour window
    10, // max 10 exports per hour
    "Too many export requests. Please try again later."
);

// ======================
// MAIN AUDIT LOG ROUTES
// ======================

// Get audit log dashboard data
auditLogRouter.get("/dashboard", getAuditLogDashboard);

// Get all audit logs with filtering and pagination
auditLogRouter.get("/", getAllAuditLogs);

// Get audit log statistics
auditLogRouter.get("/statistics", getAuditLogStatistics);

// Get recent audit activity
auditLogRouter.get("/recent", getRecentActivity);

// Search audit logs with advanced filters
auditLogRouter.get("/search", searchAuditLogs);

// Export audit logs to CSV
auditLogRouter.get("/export", exportRateLimit, exportAuditLogs);

// Health check endpoint
auditLogRouter.get("/health", healthCheck);

// ======================
// SPECIFIC AUDIT LOG ROUTES
// ======================

// Get audit log by ID
auditLogRouter.get("/:id", getAuditLogById);

// Get audit logs for a specific user
auditLogRouter.get("/user/:userId", getAuditLogsByUser);

// Get audit logs for a specific table
auditLogRouter.get("/table/:tableName", getAuditLogsByTable);

// Get audit trail for a specific record
auditLogRouter.get("/trail/:tableName/:recordId", getRecordAuditTrail);

module.exports = auditLogRouter;

const express = require("express");
const reportRouter = express.Router();
const {
    checkDepartmentAccess,
    authenticateToken,
    authorizeRoles,
    rateLimitSensitive,
} = require("../middlewares/AuthMiddleware");
const { sanitizeInput } = require("../middlewares/ErrorHandler");
const {
    generateMonthlyReport,
    getMonthlyReportJson,
    generateMonthlyExcelReport,
    getCustomRangeReport,
    getDepartmentReport,
    getApprovalReport,
    getRequesterReport,
    getReportDashboard,
    exportCustomReport,
} = require("../controllers/ReportController");

// Apply authentication to all routes
reportRouter.use(authenticateToken);

// Apply input sanitization
reportRouter.use(sanitizeInput);

// Rate limiting for report generation (to prevent abuse)
const reportRateLimit = rateLimitSensitive(
    60 * 60 * 1000, // 1 hour window
    20, // max 20 reports per hour
    "Too many report requests. Please try again later."
);

const exportRateLimit = rateLimitSensitive(
    60 * 60 * 1000, // 1 hour window
    10, // max 10 exports per hour
    "Too many export requests. Please try again later."
);

// ======================
// DASHBOARD & OVERVIEW
// ======================

// Get report dashboard (PC department only)
reportRouter.get("/dashboard", checkDepartmentAccess, getReportDashboard);

// ======================
// MONTHLY REPORTS (PC Department Only)
// ======================

// Generate monthly PDF report
reportRouter.get(
    "/monthly-pdf",
    checkDepartmentAccess,
    reportRateLimit,
    generateMonthlyReport
);

// Get monthly report data in JSON format
reportRouter.get("/monthly-json", checkDepartmentAccess, getMonthlyReportJson);

// Generate monthly Excel report
reportRouter.get(
    "/monthly-excel",
    checkDepartmentAccess,
    reportRateLimit,
    generateMonthlyExcelReport
);

// ======================
// CUSTOM REPORTS (PC Department Only)
// ======================

// Get custom date range report
reportRouter.get("/custom-range", checkDepartmentAccess, getCustomRangeReport);

// Export custom report with multiple formats
reportRouter.post(
    "/export-custom",
    checkDepartmentAccess,
    exportRateLimit,
    exportCustomReport
);

// ======================
// DEPARTMENT REPORTS
// ======================

// Get department-specific report (PC can see all, others only their own)
reportRouter.get(
    "/department/:departmentId",
    // Allow managers and supervisors to see their own department reports
    authorizeRoles("ADMIN", "MANAGER", "SUPERVISOR"),
    getDepartmentReport
);

// ======================
// SPECIALIZED REPORTS (PC Department Only)
// ======================

// Get approval efficiency report
reportRouter.get(
    "/approval-efficiency",
    checkDepartmentAccess,
    getApprovalReport
);

// Get requester activity report
reportRouter.get(
    "/requester-activity",
    checkDepartmentAccess,
    getRequesterReport
);

module.exports = reportRouter;

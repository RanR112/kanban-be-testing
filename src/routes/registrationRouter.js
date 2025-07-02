const express = require("express");
const registrationRouter = express.Router();

const {
    register,
    verifyRegistrationEmail,
    resendRegistrationVerification,
    getRegistrationStatus,
    getAllRegistrations,
    getRegistrationById,
    approveRegistration,
    rejectRegistration,
    deleteRegistration,
    getRegistrationStatistics,
    searchRegistrations,
    bulkApproveRegistrations,
    getPendingCount,
    updateRegistration,
} = require("../controllers/RegistrationController");

const {
    authenticateToken,
    authorizeAdmin,
    rateLimitSensitive,
    logAuthEvent,
} = require("../middlewares/AuthMiddleware");

// Public routes (no authentication required)

/**
 * POST /api/registration/register
 * Submit new registration request
 */
registrationRouter.post(
    "/register",
    // rateLimitSensitive(3, 60 * 60 * 1000), // 3 attempts per hour
    logAuthEvent("REGISTRATION_ATTEMPT"),
    register
);

/**
 * POST /api/registration/verify-email
 * Verify email for registration
 */
registrationRouter.post(
    "/verify-email",
    rateLimitSensitive(5, 10 * 60 * 1000), // 5 attempts per 10 minutes
    verifyRegistrationEmail
);

/**
 * POST /api/registration/resend-verification
 * Resend email verification for registration
 */
registrationRouter.post(
    "/resend-verification",
    rateLimitSensitive(3, 10 * 60 * 1000), // 3 attempts per 10 minutes
    resendRegistrationVerification
);

/**
 * GET /api/registration/status/:email
 * Get registration status by email (public for user to check their own status)
 */
registrationRouter.get(
    "/status/:email",
    rateLimitSensitive(10, 5 * 60 * 1000), // 10 attempts per 5 minutes
    getRegistrationStatus
);

// Admin routes (require admin authentication)

/**
 * GET /api/registration/admin/all
 * Get all registrations with pagination and filters
 */
registrationRouter.get(
    "/admin/all",
    authenticateToken,
    authorizeAdmin,
    getAllRegistrations
);

/**
 * GET /api/registration/admin/statistics
 * Get registration statistics
 */
registrationRouter.get(
    "/admin/statistics",
    authenticateToken,
    authorizeAdmin,
    getRegistrationStatistics
);

/**
 * GET /api/registration/admin/pending-count
 * Get count of pending registrations for dashboard
 */
registrationRouter.get(
    "/admin/pending-count",
    authenticateToken,
    authorizeAdmin,
    getPendingCount
);

/**
 * GET /api/registration/admin/search
 * Search registrations with advanced filters
 */
registrationRouter.get(
    "/admin/search",
    authenticateToken,
    authorizeAdmin,
    searchRegistrations
);

/**
 * GET /api/registration/admin/:id
 * Get specific registration by ID
 */
registrationRouter.get(
    "/admin/:id",
    authenticateToken,
    authorizeAdmin,
    getRegistrationById
);

/**
 * PUT /api/registration/admin/:id
 * Update registration data
 */
registrationRouter.put(
    "/admin/:id",
    authenticateToken,
    authorizeAdmin,
    rateLimitSensitive(10, 15 * 60 * 1000), // 10 attempts per 15 minutes
    logAuthEvent("REGISTRATION_UPDATE"),
    updateRegistration
);

/**
 * POST /api/registration/admin/:id/approve
 * Approve registration and create user account
 */
registrationRouter.post(
    "/admin/:id/approve",
    authenticateToken,
    authorizeAdmin,
    logAuthEvent("REGISTRATION_APPROVAL"),
    approveRegistration
);

/**
 * POST /api/registration/admin/:id/reject
 * Reject registration with reason
 */
registrationRouter.post(
    "/admin/:id/reject",
    authenticateToken,
    authorizeAdmin,
    logAuthEvent("REGISTRATION_REJECTION"),
    rejectRegistration
);

/**
 * DELETE /api/registration/admin/:id
 * Delete registration (only for rejected or very old pending registrations)
 */
registrationRouter.delete(
    "/admin/:id",
    authenticateToken,
    authorizeAdmin,
    logAuthEvent("REGISTRATION_DELETION"),
    deleteRegistration
);

/**
 * POST /api/registration/admin/bulk-approve
 * Bulk approve multiple registrations
 */
registrationRouter.post(
    "/admin/bulk-approve",
    authenticateToken,
    authorizeAdmin,
    rateLimitSensitive(5, 15 * 60 * 1000), // 5 attempts per 15 minutes
    logAuthEvent("BULK_REGISTRATION_APPROVAL"),
    bulkApproveRegistrations
);

module.exports = registrationRouter;

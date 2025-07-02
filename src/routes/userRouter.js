const express = require("express");
const {
    authenticateToken,
    authorizeAdmin,
    checkResourceOwnership,
    requireEmailVerification,
    rateLimitSensitive,
} = require("../middlewares/AuthMiddleware");
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getMeById,
    updateProfile,
    changePassword,
    getUsersByDepartment,
    getUsersByRole,
    getUserStats,
    getUserSessions,
    revokeUserSessions,
    bulkUpdateUsers,
    searchUsers,
    verifyUserEmail,
} = require("../controllers/UserController");
const { sanitizeInput } = require("../middlewares/ErrorHandler");

const userRouter = express.Router();

// Apply authentication to all routes
userRouter.use(authenticateToken);

// Apply input sanitization to all routes
userRouter.use(sanitizeInput);

// Rate limiting for sensitive operations
const sensitiveRateLimit = rateLimitSensitive(
    15 * 60 * 1000,
    10,
    "Too many sensitive operations"
);
const authRateLimit = rateLimitSensitive(
    15 * 60 * 1000,
    5,
    "Too many authentication attempts"
);

// ======================
// ADMIN ONLY ROUTES
// ======================

// Get all users with advanced filtering
userRouter.get("/", authorizeAdmin, getAllUsers);

// Get user by ID (admin can see any user)
userRouter.get("/:id", authorizeAdmin, getUserById);

// Create new user (admin only)
userRouter.post("/", authorizeAdmin, sensitiveRateLimit, createUser);

// Update user (admin only)
userRouter.put("/:id", authorizeAdmin, sensitiveRateLimit, updateUser);

// Delete user (admin only)
userRouter.delete("/:id", authorizeAdmin, sensitiveRateLimit, deleteUser);

// Get users by department (admin only)
userRouter.get(
    "/department/:departmentId",
    authorizeAdmin,
    getUsersByDepartment
);

// Get users by role (admin only)
userRouter.get("/role/:role", authorizeAdmin, getUsersByRole);

// Search users with advanced filters (admin only)
userRouter.get("/search/advanced", authorizeAdmin, searchUsers);

// Bulk update users (admin only)
userRouter.patch(
    "/bulk/update",
    authorizeAdmin,
    sensitiveRateLimit,
    bulkUpdateUsers
);

// Verify user email (admin action)
userRouter.patch(
    "/:id/verify-email",
    authorizeAdmin,
    sensitiveRateLimit,
    verifyUserEmail
);

// Get user sessions (admin can see any user)
userRouter.get("/:id/sessions", authorizeAdmin, getUserSessions);

// Revoke user sessions (admin can revoke any user)
userRouter.post(
    "/:id/revoke-sessions",
    authorizeAdmin,
    sensitiveRateLimit,
    revokeUserSessions
);

// ======================
// USER SELF-SERVICE ROUTES
// ======================

// Get current user profile (user can only see their own)
userRouter.get("/me/:id", checkResourceOwnership("id"), getMeById);

// Update user profile (limited fields, user can only update their own)
userRouter.put("/me/:id/profile", checkResourceOwnership("id"), updateProfile);

// Change password (user can only change their own)
userRouter.post(
    "/me/:id/change-password",
    checkResourceOwnership("id"),
    authRateLimit,
    changePassword
);

// Get user statistics (user can only see their own, admin can see any)
userRouter.get("/me/:id/stats", checkResourceOwnership("id"), getUserStats);

// Get user sessions (user can only see their own)
userRouter.get(
    "/me/:id/sessions",
    checkResourceOwnership("id"),
    getUserSessions
);

// Revoke user sessions (user can only revoke their own)
userRouter.post(
    "/me/:id/revoke-sessions",
    checkResourceOwnership("id"),
    authRateLimit,
    revokeUserSessions
);

module.exports = userRouter;

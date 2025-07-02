const express = require("express");
const authRouter = express.Router();
const {
    login,
    logout,
    refreshToken,
    signup,
    verifyEmail,
    resendEmailVerification,
    forgotPassword,
    verifyOTP,
    resetPassword,
    resendOTP,
    changePassword,
    getCurrentUser,
    getUserSessions,
    revokeSession,
} = require("../controllers/AuthController");

const {
    authenticateToken,
    authenticateRefreshToken,
    rateLimitSensitive,
    logAuthEvent,
    requireEmailVerification,
} = require("../middlewares/AuthMiddleware");

// Public routes (no authentication required)
authRouter.post(
    "/login",
    logAuthEvent("LOGIN_ATTEMPT"),
    login
);
authRouter.post("/signup", rateLimitSensitive(20, 60 * 60 * 1000), signup);
authRouter.post("/refresh-token", authenticateRefreshToken, refreshToken);

// Email verification routes
authRouter.post(
    "/verify-email",
    rateLimitSensitive(5, 10 * 60 * 1000),
    verifyEmail
);
authRouter.post(
    "/resend-email-verification",
    rateLimitSensitive(3, 10 * 60 * 1000),
    resendEmailVerification
);

// Password reset routes
authRouter.post(
    "/forgot-password",
    rateLimitSensitive(3, 15 * 60 * 1000),
    forgotPassword
);
authRouter.post(
    "/verify-otp",
    rateLimitSensitive(5, 10 * 60 * 1000),
    verifyOTP
);
authRouter.post(
    "/reset-password",
    rateLimitSensitive(3, 10 * 60 * 1000),
    resetPassword
);
authRouter.post("/resend-otp", rateLimitSensitive(2, 5 * 60 * 1000), resendOTP);

// Protected routes (require authentication)
authRouter.post("/logout", authenticateToken, logAuthEvent("LOGOUT"), logout);
authRouter.get("/me", authenticateToken, getCurrentUser);
authRouter.post(
    "/change-password",
    authenticateToken,
    requireEmailVerification,
    rateLimitSensitive(3, 15 * 60 * 1000),
    changePassword
);

// Session management routes
authRouter.get("/sessions", authenticateToken, getUserSessions);
authRouter.delete("/sessions/:sessionId", authenticateToken, revokeSession);

module.exports = authRouter;

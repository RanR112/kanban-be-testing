// middleware/AuthMiddleware.js - Enhanced version with database token verification
const User = require("../models/User");
const AuthService = require("../services/authService");

// JWT authentication middleware with database verification
const authenticateToken = async (req, res, next) => {
    try {
        const token =
            req.cookies?.access_token || // HTTP-only cookie
            AuthService.extractTokenFromHeader(req.headers.authorization); // Authorization header

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
                code: "NO_TOKEN",
            });
        }

        // Verify token and get user data from database
        const verified = await AuthService.verifyToken(token, "ACCESS_TOKEN");

        // Add user data to request
        req.user = {
            id_users: verified.user.id_users,
            email: verified.user.email,
            role: verified.user.role,
            id_department: verified.user.id_department,
            department: verified.user.department,
            tokenId: verified.tokenId,
        };

        next();
    } catch (error) {
        let statusCode = 401;
        let message = "Authentication failed";
        let code = "AUTHENTICATION_FAILED";

        if (error.message.includes("No token provided")) {
            statusCode = 401;
            message = "No token provided";
            code = "NO_TOKEN";
        } else if (error.message.includes("Token has expired")) {
            statusCode = 401;
            message = "Token has expired. Please login again.";
            code = "TOKEN_EXPIRED";
        } else if (
            error.message.includes("Token not found") ||
            error.message.includes("revoked")
        ) {
            statusCode = 401;
            message = "Session invalid. Please login again.";
            code = "SESSION_INVALID";
        } else if (error.message.includes("Invalid token")) {
            statusCode = 401;
            message = "Invalid token";
            code = "INVALID_TOKEN";
        }

        return res.status(statusCode).json({
            success: false,
            message: message,
            code: code,
        });
    }
};

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            req.user = null;
            return next();
        }

        const token = AuthService.extractTokenFromHeader(authHeader);
        const verified = await AuthService.verifyToken(token, "ACCESS_TOKEN");

        req.user = {
            id_users: verified.user.id_users,
            email: verified.user.email,
            role: verified.user.role,
            id_department: verified.user.id_department,
            department: verified.user.department,
            tokenId: verified.tokenId,
        };

        next();
    } catch (error) {
        // In optional auth, we don't fail on token errors
        req.user = null;
        next();
    }
};

// Middleware to verify refresh token
const authenticateRefreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required",
                code: "NO_REFRESH_TOKEN",
            });
        }

        // Verify refresh token
        const verified = await AuthService.verifyToken(
            refreshToken,
            "REFRESH_TOKEN"
        );

        req.user = {
            id_users: verified.user.id_users,
            email: verified.user.email,
            role: verified.user.role,
            id_department: verified.user.id_department,
            department: verified.user.department,
            tokenId: verified.tokenId,
        };

        next();
    } catch (error) {
        let statusCode = 401;
        let message = "Invalid refresh token";
        let code = "INVALID_REFRESH_TOKEN";

        if (error.message.includes("Token has expired")) {
            statusCode = 401;
            message = "Refresh token has expired. Please login again.";
            code = "REFRESH_TOKEN_EXPIRED";
        } else if (
            error.message.includes("Token not found") ||
            error.message.includes("revoked")
        ) {
            statusCode = 401;
            message = "Refresh token is invalid. Please login again.";
            code = "REFRESH_TOKEN_INVALID";
        }

        return res.status(statusCode).json({
            success: false,
            message: message,
            code: code,
        });
    }
};

// Middleware to authorize admin users
const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Access denied. User not authenticated.",
            code: "NOT_AUTHENTICATED",
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Only ADMIN can perform this action.",
            code: "INSUFFICIENT_PERMISSIONS",
        });
    }

    next();
};

// Middleware to authorize specific roles
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Access denied. User not authenticated.",
                code: "NOT_AUTHENTICATED",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${allowedRoles.join(
                    ", "
                )}`,
                code: "INSUFFICIENT_PERMISSIONS",
                requiredRoles: allowedRoles,
                userRole: req.user.role,
            });
        }

        next();
    };
};

// Middleware to check if user belongs to Department ID 1 (PC)
const checkDepartmentAccess = async (req, res, next) => {
    try {
        const userId = req.user?.id_users;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Access denied. User not authenticated properly.",
                code: "NOT_AUTHENTICATED",
            });
        }

        // Use User model to get user data with fresh department info
        const user = await User.findById(userId);

        if (!user || user.id_department !== 1) {
            return res.status(403).json({
                success: false,
                message: "Only PC Department can perform this action",
                code: "DEPARTMENT_ACCESS_DENIED",
                userDepartment: user?.department?.name || "Unknown",
            });
        }

        // Add user data to request for further use
        req.userWithDepartment = user;
        next();
    } catch (error) {
        console.error("Department access check error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while verifying access",
            code: "DEPARTMENT_CHECK_ERROR",
        });
    }
};

// Middleware to check if user belongs to specific department(s)
const checkDepartmentMembership = (...allowedDepartmentIds) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id_users;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Access denied. User not authenticated.",
                    code: "NOT_AUTHENTICATED",
                });
            }

            const userDepartmentId = req.user.id_department;

            // Convert to numbers for comparison
            const allowedIds = allowedDepartmentIds.map((id) => parseInt(id));

            if (!allowedIds.includes(userDepartmentId)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. This action is restricted to specific departments.`,
                    code: "DEPARTMENT_ACCESS_DENIED",
                    allowedDepartments: allowedDepartmentIds,
                    userDepartment: userDepartmentId,
                });
            }

            next();
        } catch (error) {
            console.error("Department membership check error:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while verifying department access",
                code: "DEPARTMENT_CHECK_ERROR",
            });
        }
    };
};

// Middleware to check if user owns the resource or has admin privileges
const checkResourceOwnership = (userIdField = "id_users") => {
    return (req, res, next) => {
        try {
            const currentUserId = req.user?.id_users;
            const resourceUserId = parseInt(
                req.params[userIdField] || req.body[userIdField]
            );

            if (!currentUserId) {
                return res.status(401).json({
                    success: false,
                    message: "Access denied. User not authenticated.",
                    code: "NOT_AUTHENTICATED",
                });
            }

            // Allow if user owns the resource or is admin
            if (currentUserId === resourceUserId || req.user.role === "ADMIN") {
                return next();
            }

            return res.status(403).json({
                success: false,
                message:
                    "Access denied. You can only access your own resources.",
                code: "RESOURCE_ACCESS_DENIED",
            });
        } catch (error) {
            console.error("Resource ownership check error:", error);
            return res.status(500).json({
                success: false,
                message: "An error occurred while verifying resource ownership",
                code: "OWNERSHIP_CHECK_ERROR",
            });
        }
    };
};

// Middleware to check if email is verified
const requireEmailVerification = async (req, res, next) => {
    try {
        const userId = req.user?.id_users;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Access denied. User not authenticated.",
                code: "NOT_AUTHENTICATED",
            });
        }

        // Get fresh user data to check email verification status
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                code: "USER_NOT_FOUND",
            });
        }

        if (!user.email_verified) {
            return res.status(403).json({
                success: false,
                message:
                    "Email verification required. Please verify your email before accessing this resource.",
                code: "EMAIL_NOT_VERIFIED",
                email: user.email,
            });
        }

        next();
    } catch (error) {
        console.error("Email verification check error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while verifying email status",
            code: "EMAIL_CHECK_ERROR",
        });
    }
};

// Rate limiting middleware for sensitive operations
const rateLimitSensitive = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
    const attempts = new Map();

    return (req, res, next) => {
        try {
            const identifier = req.ip || req.connection.remoteAddress;
            const now = Date.now();
            const windowStart = now - windowMs;

            // Clean up old attempts
            if (attempts.has(identifier)) {
                const userAttempts = attempts
                    .get(identifier)
                    .filter((time) => time > windowStart);
                attempts.set(identifier, userAttempts);
            }

            const currentAttempts = attempts.get(identifier) || [];

            if (currentAttempts.length >= maxAttempts) {
                return res.status(429).json({
                    success: false,
                    message: "Too many attempts. Please try again later.",
                    code: "RATE_LIMIT_EXCEEDED",
                    retryAfter: Math.ceil(
                        (currentAttempts[0] + windowMs - now) / 1000
                    ),
                });
            }

            // Add current attempt
            currentAttempts.push(now);
            attempts.set(identifier, currentAttempts);

            next();
        } catch (error) {
            console.error("Rate limiting error:", error);
            next(); // Continue on error to avoid blocking legitimate requests
        }
    };
};

// Middleware to validate API key for external integrations (if needed)
const validateApiKey = async (req, res, next) => {
    try {
        const apiKey = req.headers["x-api-key"];

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: "API key is required",
                code: "NO_API_KEY",
            });
        }

        // Here you would validate the API key against your database
        // This is a placeholder implementation
        if (apiKey !== process.env.API_KEY) {
            return res.status(401).json({
                success: false,
                message: "Invalid API key",
                code: "INVALID_API_KEY",
            });
        }

        next();
    } catch (error) {
        console.error("API key validation error:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while validating API key",
            code: "API_KEY_VALIDATION_ERROR",
        });
    }
};

// Middleware to log authentication events
const logAuthEvent = (eventType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id_users;
            const ip = AuthService.getClientIP(req);
            const userAgent = req.get("User-Agent");

            // Log the event
            if (userId) {
                await AuthService.createAuditLog({
                    user_id: userId,
                    action: eventType,
                    ip_address: ip,
                    user_agent: userAgent,
                });
            }

            next();
        } catch (error) {
            console.error("Auth event logging error:", error);
            next(); // Continue on error to avoid blocking the request
        }
    };
};

module.exports = {
    authenticateToken,
    optionalAuth,
    authenticateRefreshToken,
    authorizeAdmin,
    authorizeRoles,
    checkDepartmentAccess,
    checkDepartmentMembership,
    checkResourceOwnership,
    requireEmailVerification,
    rateLimitSensitive,
    validateApiKey,
    logAuthEvent,
};

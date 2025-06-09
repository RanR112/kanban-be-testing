// middleware/AuthMiddleware.js
const User = require("../models/User");
const AuthService = require("../services/authService");

// JWT authentication middleware
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // Extract token
        const token = AuthService.extractTokenFromHeader(authHeader);
        
        // Verify token and get user data
        const verified = AuthService.verifyToken(token);
        req.user = verified;
        
        next();
    } catch (error) {
        let statusCode = 401;
        let message = "Authentication failed";

        if (error.message.includes("No token provided")) {
            statusCode = 401;
            message = "No token provided";
        } else if (error.message.includes("Session expired")) {
            statusCode = 401;
            message = "Session expired. Please login again.";
        } else if (error.message.includes("Session not found")) {
            statusCode = 403;
            message = "Session not found. Please login again.";
        } else if (error.message.includes("Token verification failed")) {
            statusCode = 403;
            message = "Invalid token";
        }

        return res.status(statusCode).json({
            success: false,
            message: message
        });
    }
};

// Middleware to authorize admin users
const authorizeAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Access denied. User not authenticated.",
        });
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Only ADMIN can perform this action.",
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
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${allowedRoles.join(', ')}`,
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
            });
        }

        // Use User model to get user data
        const user = await User.findById(userId);

        if (!user || user.id_department !== 1) {
            return res.status(403).json({
                success: false,
                message: "Only PC Department can perform this action",
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
        });
    }
};

module.exports = {
    authenticateToken,
    authorizeAdmin,
    authorizeRoles,
    checkDepartmentAccess,
};
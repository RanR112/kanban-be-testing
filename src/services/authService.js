// services/AuthService.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

class AuthService {
    constructor() {
        this.sessionSecrets = {};
    }

    // Authenticate user credentials
    async authenticateUser(email, password) {
        try {
            // Find user by email
            const user = await User.findByEmail(email);
            if (!user) {
                return { success: false, message: "User not found" };
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { success: false, message: "Invalid credentials" };
            }

            return { success: true, user };
        } catch (error) {
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    // Generate JWT token
    generateToken(user) {
        const secretKey = process.env.JWT_SECRET;
        this.sessionSecrets[user.id_users] = secretKey;

        return jwt.sign(
            {
                id_users: user.id_users,
                email: user.email,
                role: user.role,
                id_department: user.id_department,
            },
            secretKey,
            { expiresIn: "30m" }
        );
    }

    // Verify and decode token
    verifyToken(token) {
        try {
            const decoded = jwt.decode(token);
            const userId = decoded?.id_users;

            if (!userId || !this.sessionSecrets[userId]) {
                throw new Error("Session not found. Please login again.");
            }

            return jwt.verify(token, this.sessionSecrets[userId]);
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new Error("Session expired. Please login again.");
            }
            throw new Error(`Token verification failed: ${error.message}`);
        }
    }

    // Invalidate session
    invalidateSession(userId) {
        if (this.sessionSecrets[userId]) {
            delete this.sessionSecrets[userId];
            return true;
        }
        return false;
    }

    // Extract token from authorization header
    extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("No token provided");
        }
        return authHeader.split(" ")[1];
    }

    // Decode token without verification (for logout)
    decodeToken(token) {
        try {
            return jwt.decode(token);
        } catch (error) {
            throw new Error("Invalid token format");
        }
    }

    // Check if session exists
    hasActiveSession(userId) {
        return !!this.sessionSecrets[userId];
    }

    // Get session secrets (for external access if needed)
    getSessionSecrets() {
        return this.sessionSecrets;
    }
}

module.exports = new AuthService();
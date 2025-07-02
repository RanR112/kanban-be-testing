// services/AuthService.js - Enhanced version with database token management
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const prisma = require("../../prisma/client");
require("dotenv").config();

class AuthService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET;
        this.ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "30m";
        this.REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "1d";

        if (!this.JWT_SECRET) {
            throw new Error("JWT_SECRET environment variable is required");
        }
    }

    /**
     * Authenticate user credentials with enhanced security
     */
    async authenticateUser(email, password, req = null) {
        try {
            const user = await User.findByEmail(email.toLowerCase().trim());
            if (!user) {
                return { success: false, message: "Email not match our records" };
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(
                password,
                user.password
            );
            if (!isPasswordValid) {
                return { success: false, message: "Invalid credentials" };
            }

            // Check if email is verified
            // if (!user.email_verified) {
            //     return {
            //         success: false,
            //         message: "Please verify your email before logging in",
            //         code: "EMAIL_NOT_VERIFIED",
            //     };
            // }

            // Update last login
            await prisma.user.update({
                where: { id_users: user.id_users },
                data: { last_login: new Date() },
            });

            // Log successful login
            if (req) {
                await this.createAuditLog({
                    user_id: user.id_users,
                    action: "LOGIN",
                    ip_address: this.getClientIP(req),
                    user_agent: req.get("User-Agent"),
                });
            }

            return { success: true, user };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    /**
     * Generate access and refresh tokens
     */
    async generateTokens(user, req = null) {
        try {
            const payload = {
                id_users: user.id_users,
                email: user.email,
                role: user.role,
                id_department: user.id_department,
                type: "access",
            };

            // Generate tokens
            const accessToken = jwt.sign(payload, this.JWT_SECRET, {
                expiresIn: this.ACCESS_TOKEN_EXPIRY,
                issuer: "kanban-system",
                audience: "kanban-users",
            });

            const refreshTokenPayload = { ...payload, type: "refresh" };
            const refreshToken = jwt.sign(
                refreshTokenPayload,
                this.JWT_SECRET,
                {
                    expiresIn: this.REFRESH_TOKEN_EXPIRY,
                    issuer: "kanban-system",
                    audience: "kanban-users",
                }
            );

            // Calculate expiry times
            const accessExpiresAt = new Date(
                Date.now() + this.parseExpiry(this.ACCESS_TOKEN_EXPIRY)
            );
            const refreshExpiresAt = new Date(
                Date.now() + this.parseExpiry(this.REFRESH_TOKEN_EXPIRY)
            );

            // Store tokens in database
            const [accessTokenRecord, refreshTokenRecord] = await Promise.all([
                prisma.token.create({
                    data: {
                        user_id: user.id_users,
                        token: accessToken,
                        type: "ACCESS_TOKEN",
                        expires_at: accessExpiresAt,
                        ip_address: req ? this.getClientIP(req) : null,
                        user_agent: req ? req.get("User-Agent") : null,
                    },
                }),
                prisma.token.create({
                    data: {
                        user_id: user.id_users,
                        token: refreshToken,
                        type: "REFRESH_TOKEN",
                        expires_at: refreshExpiresAt,
                        ip_address: req ? this.getClientIP(req) : null,
                        user_agent: req ? req.get("User-Agent") : null,
                    },
                }),
            ]);

            return {
                accessToken,
                refreshToken,
                accessExpiresAt,
                refreshExpiresAt,
            };
        } catch (error) {
            console.error("Token generation error:", error);
            throw new Error(`Failed to generate tokens: ${error.message}`);
        }
    }

    /**
     * Verify and validate token from database
     */
    async verifyToken(token, tokenType = "ACCESS_TOKEN") {
        try {
            // First verify JWT signature and expiry
            const decoded = jwt.verify(token, this.JWT_SECRET, {
                issuer: "kanban-system",
                audience: "kanban-users",
            });

            // Check if token exists in database and is not revoked
            const tokenRecord = await prisma.token.findFirst({
                where: {
                    token,
                    type: tokenType,
                    is_revoked: false,
                    expires_at: {
                        gte: new Date(),
                    },
                },
                include: {
                    user: {
                        include: {
                            department: true,
                        },
                    },
                },
            });

            if (!tokenRecord) {
                throw new Error("Token not found or has been revoked");
            }

            // Return user data with token info
            return {
                ...decoded,
                user: tokenRecord.user,
                tokenId: tokenRecord.id,
            };
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new Error("Token has expired");
            } else if (error.name === "JsonWebTokenError") {
                throw new Error("Invalid token");
            }
            throw new Error(`Token verification failed: ${error.message}`);
        }
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshAccessToken(refreshToken, req = null) {
        try {
            // Verify refresh token
            const decoded = await this.verifyToken(
                refreshToken,
                "REFRESH_TOKEN"
            );

            if (decoded.type !== "refresh") {
                throw new Error("Invalid token type");
            }

            // Generate new access token
            const newTokens = await this.generateTokens(decoded.user, req);

            return {
                accessToken: newTokens.accessToken,
                expiresAt: newTokens.accessExpiresAt,
            };
        } catch (error) {
            throw new Error(`Token refresh failed: ${error.message}`);
        }
    }

    /**
     * Revoke token(s)
     */
    async revokeTokens(userId, tokenType = null, specificToken = null) {
        try {
            const where = {
                user_id: parseInt(userId),
                is_revoked: false,
            };

            if (tokenType) {
                where.type = tokenType;
            }

            if (specificToken) {
                where.token = specificToken;
            }

            const result = await prisma.token.updateMany({
                where,
                data: {
                    is_revoked: true,
                    updated_at: new Date(),
                },
            });

            return result.count > 0;
        } catch (error) {
            console.error("Token revocation error:", error);
            throw new Error(`Failed to revoke tokens: ${error.message}`);
        }
    }

    /**
     * Logout user - revoke all tokens
     */
    async logout(userId, req = null) {
        try {
            await this.revokeTokens(userId);

            // Log logout action
            if (req) {
                await this.createAuditLog({
                    user_id: parseInt(userId),
                    action: "LOGOUT",
                    ip_address: this.getClientIP(req),
                    user_agent: req.get("User-Agent"),
                });
            }

            return true;
        } catch (error) {
            console.error("Logout error:", error);
            throw new Error(`Logout failed: ${error.message}`);
        }
    }

    /**
     * Extract token from authorization header
     */
    extractTokenFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new Error("No token provided");
        }
        return authHeader.split(" ")[1];
    }

    /**
     * Clean up expired tokens (should be run periodically)
     */
    async cleanupExpiredTokens() {
        try {
            const result = await prisma.token.deleteMany({
                where: {
                    OR: [
                        { expires_at: { lt: new Date() } },
                        { is_revoked: true },
                    ],
                },
            });

            return result.count;
        } catch (error) {
            console.error("Token cleanup error:", error);
            return 0;
        }
    }

    /**
     * Get active sessions for user
     */
    async getUserSessions(userId) {
        try {
            return await prisma.token.findMany({
                where: {
                    user_id: parseInt(userId),
                    type: "ACCESS_TOKEN",
                    is_revoked: false,
                    expires_at: {
                        gte: new Date(),
                    },
                },
                select: {
                    id: true,
                    ip_address: true,
                    user_agent: true,
                    created_at: true,
                    expires_at: true,
                },
                orderBy: {
                    created_at: "desc",
                },
            });
        } catch (error) {
            console.error("Get user sessions error:", error);
            return [];
        }
    }

    /**
     * Create audit log entry
     */
    async createAuditLog(logData) {
        try {
            await prisma.auditLog.create({
                data: {
                    user_id: logData.user_id,
                    action: logData.action,
                    table_name: logData.table_name || null,
                    record_id: logData.record_id || null,
                    old_values: logData.old_values || null,
                    new_values: logData.new_values || null,
                    ip_address: logData.ip_address,
                    user_agent: logData.user_agent,
                },
            });
        } catch (error) {
            console.error("Audit log creation error:", error);
            // Don't throw error to avoid breaking main functionality
        }
    }

    /**
     * Get client IP address
     */
    getClientIP(req) {
        return (
            req.ip ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            req.headers["x-real-ip"] ||
            "unknown"
        );
    }

    /**
     * Parse expiry string to milliseconds
     */
    parseExpiry(expiry) {
        const units = {
            s: 1000,
            m: 1000 * 60,
            h: 1000 * 60 * 60,
            d: 1000 * 60 * 60 * 24,
        };

        const match = expiry.match(/^(\d+)([smhd])$/);
        if (!match) {
            throw new Error("Invalid expiry format");
        }

        const [, amount, unit] = match;
        return parseInt(amount) * units[unit];
    }
}

module.exports = new AuthService();

// services/OTPService.js - Enhanced version with database storage
const crypto = require("crypto");
const prisma = require("../../prisma/client");
const EmailService = require("./emailService");

class OTPService {
    constructor() {
        this.OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
        this.MAX_ATTEMPTS = 3; // Maximum verification attempts
        this.RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
        this.MAX_REQUESTS_PER_WINDOW = 3; // Maximum OTP requests per window
    }

    /**
     * Generate 6-digit OTP
     */
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Generate secure token for password reset session
     */
    generateResetToken() {
        return crypto.randomBytes(32).toString("hex");
    }

    /**
     * Store OTP in database with enhanced security
     */
    async storeOTP(email, otp, type = "PASSWORD_RESET", req = null) {
        try {
            const normalizedEmail = email.toLowerCase().trim();

            // Check rate limiting
            const rateLimitCheck = await this.checkRateLimit(
                normalizedEmail,
                type
            );
            if (!rateLimitCheck.allowed) {
                throw new Error(rateLimitCheck.message);
            }

            let userData = {
                user_id: null,
                registration_id: null,
            };

            if (type === "EMAIL_VERIFICATION") {
                const registration = await prisma.registration.findUnique({
                    where: { email: normalizedEmail },
                });

                if (!registration) {
                    throw new Error("Registration not found");
                }

                userData.registration_id = registration.id_registration;
                // Untuk cleanup, gunakan registration_id sebagai user_id sementara
                await this.cleanupUserOTPs(registration.id_registration, type);
            } else if (type === "PASSWORD_RESET") {
                const user = await prisma.user.findUnique({
                    where: { email: normalizedEmail },
                });

                if (!user) {
                    throw new Error("User not found");
                }

                userData.user_id = user.id_users;
                await this.cleanupUserOTPs(user.id_users, type);
            }

            const otpRecord = await prisma.otpCode.create({
                data: {
                    user_id: userData.user_id,
                    registration_id: userData.registration_id,
                    code: otp,
                    type: type,
                    expires_at: new Date(Date.now() + this.OTP_EXPIRY_TIME),
                    max_attempts: this.MAX_ATTEMPTS,
                    ip_address: req ? this.getClientIP(req) : null,
                    user_agent: req ? req.get("User-Agent") : null,
                },
            });

            return {
                success: true,
                otpId: otpRecord.id,
                expiresAt: otpRecord.expires_at,
            };
        } catch (error) {
            console.error("Store OTP error:", error);
            throw new Error(`Failed to store OTP: ${error.message}`);
        }
    }

    /**
     * Verify OTP code with enhanced security
     */
    async verifyOTP(email, inputOTP, type = "PASSWORD_RESET") {
        try {
            const normalizedEmail = email.toLowerCase().trim();
            let targetEntity = null;
            let entityType = null;
            let entityId = null;

            // Determine which entity to find based on OTP type
            if (type === "EMAIL_VERIFICATION") {
                // For email verification, find registration
                const registration = await prisma.registration.findUnique({
                    where: { email: normalizedEmail },
                });

                if (!registration) {
                    return {
                        success: false,
                        message: "Registration not found",
                        code: "REGISTRATION_NOT_FOUND",
                    };
                }

                targetEntity = registration;
                entityType = "registration";
                entityId = registration.id_registration;
            } else if (type === "PASSWORD_RESET") {
                // For password reset, find user
                const user = await prisma.user.findUnique({
                    where: { email: normalizedEmail },
                });

                if (!user) {
                    return {
                        success: false,
                        message: "User not found",
                        code: "USER_NOT_FOUND",
                    };
                }

                targetEntity = user;
                entityType = "user";
                entityId = user.id_users;
            } else {
                return {
                    success: false,
                    message: "Invalid OTP type",
                    code: "INVALID_TYPE",
                };
            }

            // Build where clause based on entity type
            const whereClause = {
                type: type,
                is_used: false,
                expires_at: {
                    gte: new Date(),
                },
            };

            // Add appropriate ID field to where clause
            if (entityType === "registration") {
                whereClause.registration_id = entityId;
            } else {
                whereClause.user_id = entityId;
            }

            // Find active OTP for this entity and type
            const otpRecord = await prisma.otpCode.findFirst({
                where: whereClause,
                orderBy: {
                    created_at: "desc",
                },
            });

            if (!otpRecord) {
                return {
                    success: false,
                    message:
                        "OTP not found or has expired. Please request a new code.",
                    code: "OTP_NOT_FOUND",
                };
            }

            // Check if maximum attempts exceeded
            if (otpRecord.attempts >= otpRecord.max_attempts) {
                await this.invalidateOTP(otpRecord.id);
                return {
                    success: false,
                    message:
                        "Maximum verification attempts exceeded. Please request a new code.",
                    code: "MAX_ATTEMPTS_EXCEEDED",
                };
            }

            // Increment attempt counter
            await prisma.otpCode.update({
                where: { id: otpRecord.id },
                data: { attempts: { increment: 1 } },
            });

            // Verify OTP
            if (otpRecord.code !== inputOTP.toString()) {
                const remainingAttempts =
                    otpRecord.max_attempts - (otpRecord.attempts + 1);
                return {
                    success: false,
                    message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
                    code: "INVALID_OTP",
                    remainingAttempts,
                };
            }

            // Mark OTP as used
            await prisma.otpCode.update({
                where: { id: otpRecord.id },
                data: {
                    is_used: true,
                    used_at: new Date(),
                },
            });

            // Handle different post-verification actions based on type
            let result = {
                success: true,
                message: "OTP verified successfully",
                otpId: otpRecord.id,
                entityType: entityType,
                entityId: entityId,
            };

            if (type === "PASSWORD_RESET") {
                // Generate reset token for password reset
                const resetToken = this.generateResetToken();

                // Store reset token securely
                await prisma.otpCode.update({
                    where: { id: otpRecord.id },
                    data: {
                        code: resetToken, // Store reset token after verification
                    },
                });

                result.resetToken = resetToken;
            } else if (type === "EMAIL_VERIFICATION") {
                // For email verification, you might want to:
                // 1. Mark registration as verified
                // 2. Create user account from registration
                // 3. Or any other business logic

                // Example: Mark registration as verified
                await prisma.registration.update({
                    where: { id_registration: entityId },
                    data: {
                        email_verified: true, // Assuming you have this field
                    },
                });

                result.registrationVerified = true;
            }

            return result;
        } catch (error) {
            console.error("Verify OTP error:", error);
            return {
                success: false,
                message: "Failed to verify OTP. Please try again.",
                code: "VERIFICATION_ERROR",
            };
        }
    }

    /**
     * Validate reset token for password change
     */
    async validateResetToken(resetToken) {
        try {
            // Find OTP record with this reset token
            const otpRecord = await prisma.otpCode.findFirst({
                where: {
                    code: resetToken, // Reset token stored in code field after verification
                    type: "PASSWORD_RESET",
                    is_used: true,
                    expires_at: {
                        gte: new Date(),
                    },
                },
                include: {
                    user: true,
                },
            });

            if (!otpRecord) {
                return {
                    success: false,
                    message: "Invalid or expired reset token",
                };
            }

            return {
                success: true,
                email: otpRecord.user.email,
                userId: otpRecord.user.id_users,
                otpId: otpRecord.id,
            };
        } catch (error) {
            console.error("Validate reset token error:", error);
            return {
                success: false,
                message: "Failed to validate reset token",
            };
        }
    }

    /**
     * Clean up OTP data after successful password reset
     */
    async cleanupOTP(email, type = "PASSWORD_RESET") {
        try {
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            });

            if (!user) return false;

            const result = await prisma.otpCode.deleteMany({
                where: {
                    user_id: user.id_users,
                    type: type,
                },
            });

            return result.count > 0;
        } catch (error) {
            console.error("Cleanup OTP error:", error);
            return false;
        }
    }

    /**
     * Clean up user's OTPs of specific type
     */
    async cleanupUserOTPs(userId, type = "PASSWORD_RESET") {
        try {
            await prisma.otpCode.deleteMany({
                where: {
                    user_id: parseInt(userId),
                    type: type,
                },
            });
            return true;
        } catch (error) {
            console.error("Cleanup user OTPs error:", error);
            return false;
        }
    }

    /**
     * Check if user has active OTP
     */
    async hasActiveOTP(email, type = "PASSWORD_RESET") {
        try {
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            });

            if (!user) return false;

            const activeOTP = await prisma.otpCode.findFirst({
                where: {
                    user_id: user.id_users,
                    type: type,
                    is_used: false,
                    expires_at: {
                        gte: new Date(),
                    },
                },
            });

            return !!activeOTP;
        } catch (error) {
            console.error("Check active OTP error:", error);
            return false;
        }
    }

    /**
     * Check rate limiting for OTP requests
     */
    async checkRateLimit(email, type = "PASSWORD_RESET") {
        try {
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            });

            if (!user) return { allowed: true };

            const windowStart = new Date(Date.now() - this.RATE_LIMIT_WINDOW);

            const recentAttempts = await prisma.otpCode.count({
                where: {
                    user_id: user.id_users,
                    type: type,
                    created_at: {
                        gte: windowStart,
                    },
                },
            });

            const allowed = recentAttempts < this.MAX_REQUESTS_PER_WINDOW;

            return {
                allowed,
                message: allowed
                    ? null
                    : `Too many OTP requests. Please wait before requesting a new code.`,
                remainingAttempts: Math.max(
                    0,
                    this.MAX_REQUESTS_PER_WINDOW - recentAttempts
                ),
                resetTime: new Date(Date.now() + this.RATE_LIMIT_WINDOW),
            };
        } catch (error) {
            console.error("Rate limit check error:", error);
            return { allowed: true }; // Allow if check fails
        }
    }

    /**
     * Invalidate OTP
     */
    async invalidateOTP(otpId) {
        try {
            await prisma.otpCode.update({
                where: { id: parseInt(otpId) },
                data: {
                    is_used: true,
                    used_at: new Date(),
                },
            });
            return true;
        } catch (error) {
            console.error("Invalidate OTP error:", error);
            return false;
        }
    }

    /**
     * Get OTP info for user (for debugging - remove in production)
     */
    async getOTPInfo(email, type = "PASSWORD_RESET") {
        try {
            const user = await prisma.user.findUnique({
                where: { email: email.toLowerCase().trim() },
            });

            if (!user) return null;

            const otpRecord = await prisma.otpCode.findFirst({
                where: {
                    user_id: user.id_users,
                    type: type,
                    is_used: false,
                },
                orderBy: {
                    created_at: "desc",
                },
            });

            if (!otpRecord) return null;

            return {
                email: user.email,
                hasOTP: true,
                attempts: otpRecord.attempts,
                maxAttempts: otpRecord.max_attempts,
                expiresAt: otpRecord.expires_at,
                isUsed: otpRecord.is_used,
                timeRemaining: Math.max(
                    0,
                    otpRecord.expires_at.getTime() - Date.now()
                ),
                createdAt: otpRecord.created_at,
            };
        } catch (error) {
            console.error("Get OTP info error:", error);
            return null;
        }
    }

    /**
     * Clean up expired OTPs (should be called periodically)
     */
    async cleanupExpiredOTPs() {
        try {
            const result = await prisma.otpCode.deleteMany({
                where: {
                    OR: [
                        { expires_at: { lt: new Date() } },
                        {
                            AND: [
                                { is_used: true },
                                {
                                    used_at: {
                                        lt: new Date(
                                            Date.now() - 24 * 60 * 60 * 1000
                                        ),
                                    },
                                }, // Delete used OTPs older than 24 hours
                            ],
                        },
                    ],
                },
            });

            return result.count;
        } catch (error) {
            console.error("Cleanup expired OTPs error:", error);
            return 0;
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
     * Send OTP for email verification
     */
    async sendEmailVerificationOTP(email, name, req = null) {
        try {
            const otp = this.generateOTP();
            const result = await this.storeOTP(
                email,
                otp,
                "EMAIL_VERIFICATION",
                req
            );

            let validName = "User";
            if (typeof name === "string" && name.trim()) {
                validName = name.trim();
            }

            await EmailService.sendEmailVerificationOTP(email, validName, otp);

            return {
                success: true,
                expiresAt: result.expiresAt,
            };
        } catch (error) {
            throw new Error(
                `Failed to send email verification OTP: ${error.message}`
            );
        }
    }

    /**
     * Verify email with OTP
     */
    async verifyEmailOTP(email, otp, name, departmentName) {
        try {
            const result = await this.verifyOTP(
                email,
                otp,
                "EMAIL_VERIFICATION"
            );

            if (result.success) {
                // Mark email as verified
                await prisma.registration.update({
                    where: { email: email.toLowerCase().trim() },
                    data: { email_verified: true },
                });

                // Send confirmation email to user
                EmailService.sendEmailVerified(email, name, departmentName);

                // Get all admin users
                const adminUsers = await prisma.user.findMany({
                    where: { role: "ADMIN" },
                    select: {
                        email: true,
                        name: true,
                    },
                });

                // Get registration data for admin notification
                const registrationData = await prisma.registration.findUnique({
                    where: { email: email.toLowerCase().trim() },
                    select: {
                        name: true,
                        email: true,
                        employee_id: true,
                        position: true,
                        department: true,
                        division: true,
                        work_location: true,
                        no_hp: true,
                        created_at: true,
                    },
                });

                // Send notification email to all admins
                if (adminUsers.length > 0 && registrationData) {
                    for (const admin of adminUsers) {
                        try {
                            await EmailService.sendAdminNotificationEmail(
                                admin.email,
                                admin.name,
                                registrationData
                            );
                        } catch (emailError) {
                            console.error(
                                `Failed to send admin notification to ${admin.email}:`,
                                emailError
                            );
                            // Continue sending to other admins even if one fails
                        }
                    }
                }
            }

            return result;
        } catch (error) {
            throw new Error(`Failed to verify email OTP: ${error.message}`);
        }
    }
}

module.exports = new OTPService();

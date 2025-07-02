const AuthService = require("../services/authService");
const User = require("../models/User");
const EmailService = require("../services/emailService");
const OTPService = require("../services/OTPService");
const bcrypt = require("bcryptjs");
const prisma = require("../../prisma/client");
const {
    validatePassword,
    hashPassword,
    comparePassword,
} = require("../utils/password");

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
});

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    try {
        // Authenticate user
        const authResult = await AuthService.authenticateUser(
            email,
            password,
            req
        );

        if (!authResult.success) {
            return res.status(401).json({
                success: false,
                message: authResult.message,
                code: authResult.code || "AUTHENTICATION_FAILED",
            });
        }

        // Generate tokens
        const tokens = await AuthService.generateTokens(authResult.user, req);

        res.cookie("access_token", tokens.accessToken, {
            httpOnly: true, // Tidak bisa diakses via JavaScript
            secure: process.env.NODE_ENV === "production", // HTTPS only di production
            sameSite: "strict", // CSRF protection
            maxAge: 1000 * 60 * 30, // 30 minutes
            path: "/",
        });

        res.cookie("refresh_token", tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 8, // 7 days
            path: "/",
        });

        return res.json({
            success: true,
            message: "Login successful",
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.accessExpiresAt,
            user: {
                id_users: authResult.user.id_users,
                name: authResult.user.name,
                email: authResult.user.email,
                role: authResult.user.role,
                id_department: authResult.user.id_department,
                department: authResult.user.department,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        // Clear cookies regardless of authentication status
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        // Try to revoke tokens if user is authenticated
        const userId = req.user?.id_users;

        if (userId) {
            try {
                // Logout user (revoke all tokens)
                await AuthService.logout(userId, req);

                return res.json({
                    success: true,
                    message: "Logout successful",
                });
            } catch (tokenError) {
                console.warn("Token revocation failed:", tokenError);
                // Still return success since cookies are cleared
                return res.json({
                    success: true,
                    message:
                        "Logout completed (tokens may have already expired)",
                });
            }
        } else {
            // No user found, but cookies cleared - still successful
            return res.json({
                success: true,
                message: "Logout completed (no active session found)",
            });
        }
    } catch (error) {
        console.error("Logout error:", error);

        // Even on error, try to clear cookies and return success
        // because the goal is to log the user out
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        res.clearCookie("refresh_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });

        return res.json({
            success: true,
            message: "Logout completed with cleanup",
        });
    }
};

/**
 * Get registration info for users who want to check registration status
 */
exports.getRegistrationInfo = async (req, res) => {
    return res.json({
        success: true,
        message: "Employee registration system information",
        data: {
            process: [
                "1. Submit registration with employee details",
                "2. Verify email address with OTP",
                "3. Wait for admin approval",
                "4. Receive welcome email when approved",
                "5. Login with approved credentials",
            ],
            endpoints: {
                register: "POST /api/registration/register",
                verify: "POST /api/registration/verify-email",
                status: "GET /api/registration/status/:email",
                resend: "POST /api/registration/resend-verification",
            },
            requirements: [
                "Valid company email address",
                "Employee ID from company system",
                "Valid department selection",
                "Complete employee information",
                "Strong password meeting security requirements",
            ],
        },
    });
};

/**
 * Check if email is eligible for registration
 */
exports.checkRegistrationEligibility = async (req, res) => {
    const { email, employee_id } = req.body;

    try {
        if (!email && !employee_id) {
            return res.status(400).json({
                success: false,
                message: "Email or employee ID is required",
            });
        }

        const checks = {
            email_available: true,
            employee_id_available: true,
            existing_user: false,
            pending_registration: false,
        };

        // Check email availability
        if (email) {
            const existingUser = await User.findByEmail(email);
            const Registration = require("../models/Registration");
            const existingRegistration = await Registration.findByEmail(email);

            if (existingUser) {
                checks.email_available = false;
                checks.existing_user = true;
            }

            if (existingRegistration) {
                checks.email_available = false;
                checks.pending_registration = true;
            }
        }

        // Check employee ID availability
        if (employee_id) {
            const Registration = require("../models/Registration");
            const existingEmployeeId = await Registration.findByEmployeeId(
                employee_id
            );

            if (existingEmployeeId) {
                checks.employee_id_available = false;
                checks.pending_registration = true;
            }
        }

        const isEligible =
            checks.email_available && checks.employee_id_available;

        return res.json({
            success: true,
            eligible: isEligible,
            checks: checks,
            message: isEligible
                ? "Email and Employee ID are available for registration"
                : "Email or Employee ID is already in use",
        });
    } catch (error) {
        console.error("Check registration eligibility error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to check registration eligibility",
        });
    }
};

/**
 * Get departments available for registration
 */
exports.getAvailableDepartments = async (req, res) => {
    try {
        // Get all departments except PC department (id = 1)
        const departments = await prisma.department.findMany({
            where: {
                id_department: {
                    not: 1, // Exclude PC department
                },
            },
            select: {
                id_department: true,
                name: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return res.json({
            success: true,
            data: departments,
            note: "PC Department registrations are handled separately by admin",
        });
    } catch (error) {
        console.error("Get available departments error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve departments",
        });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            success: false,
            message: "Refresh token is required",
        });
    }

    try {
        const result = await AuthService.refreshAccessToken(refreshToken, req);

        return res.json({
            success: true,
            message: "Token refreshed successfully",
            accessToken: result.accessToken,
            expiresAt: result.expiresAt,
        });
    } catch (error) {
        console.error("Token refresh error:", error);
        return res.status(401).json({
            success: false,
            message: error.message || "Token refresh failed",
        });
    }
};

exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id_users;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const user = await User.findMe(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            user: user,
        });
    } catch (error) {
        console.error("Get current user error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

exports.getUserSessions = async (req, res) => {
    try {
        const userId = req.user?.id_users;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const sessions = await AuthService.getUserSessions(userId);

        return res.json({
            success: true,
            sessions: sessions,
        });
    } catch (error) {
        console.error("Get user sessions error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve sessions",
        });
    }
};

exports.revokeSession = async (req, res) => {
    const { sessionId } = req.params;

    try {
        const userId = req.user?.id_users;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        // Find the specific session
        const session = await prisma.token.findFirst({
            where: {
                id: parseInt(sessionId),
                user_id: userId,
                type: "ACCESS_TOKEN",
                is_revoked: false,
            },
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        // Revoke the specific session
        await AuthService.revokeTokens(userId, "ACCESS_TOKEN", session.token);

        return res.json({
            success: true,
            message: "Session revoked successfully",
        });
    } catch (error) {
        console.error("Revoke session error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to revoke session",
        });
    }
};

exports.signup = async (req, res) => {
    const { id_department, name, email, no_hp, password } = req.body;

    try {
        // Validate required fields
        if (!id_department || !name || !email || !no_hp || !password) {
            return res.status(400).json({
                success: false,
                message:
                    "All fields are required (id_department, name, email, no_hp, password)",
            });
        }

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet requirements",
                errors: passwordValidation.errors,
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Check if department exists and is not PC (id_department = 1)
        const department = await prisma.department.findUnique({
            where: { id_department: parseInt(id_department) },
        });

        if (!department) {
            return res.status(400).json({
                success: false,
                message: "Department not found",
            });
        }

        // Prevent registration for PC department (id_department = 1)
        if (parseInt(id_department) === 1) {
            return res.status(403).json({
                success: false,
                message: "Registration not allowed for PC department",
            });
        }

        // Check if email already exists
        const existingUser = await User.findByEmail(email.toLowerCase().trim());
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Create user data with USER role (fixed role for signup)
        const userData = {
            id_department: parseInt(id_department),
            name: name.trim(),
            role: "USER", // Fixed role for sign up
            email: email.toLowerCase().trim(),
            no_hp: no_hp.trim(),
            password,
            email_verified: false, // Require email verification
        };

        // Create new user
        const hashedPassword = await hashPassword(password);
        const newUser = await User.create({
            ...userData,
            password: hashedPassword,
        });

        // Send email verification OTP
        try {
            let safeName = "User"; // ultimate fallback

            // Try multiple access patterns
            if (
                newUser.registration &&
                typeof newUser.registration.name === "string" &&
                newUser.registration.name.trim()
            ) {
                safeName = newUser.registration.name.trim();
            } else if (
                newUser.name &&
                typeof newUser.name === "string" &&
                newUser.name.trim()
            ) {
                safeName = newUser.name.trim();
            } else if (
                userData.name &&
                typeof userData.name === "string" &&
                userData.name.trim()
            ) {
                safeName = userData.name.trim();
            } else if (
                req.body.name &&
                typeof req.body.name === "string" &&
                req.body.name.trim()
            ) {
                safeName = req.body.name.trim();
            }

            await OTPService.sendEmailVerificationOTP(
                newUser.registration?.email || userData.email,
                safeName, // menggunakan safeName yang sudah divalidasi
                req
            );

            return res.status(201).json({
                success: true,
                message:
                    "Account created successfully. Please check your email for verification code.",
                user: {
                    id_users: newUser.registration.id_users,
                    name: safeName,
                    email: newUser.registration.email,
                    role: newUser.registration.role,
                    id_department: newUser.registration.id_department,
                    email_verified: newUser.registration.email_verified,
                    department: {
                        id_department: newUser.department.id_department,
                        name: newUser.department.name,
                    },
                },
                requiresEmailVerification: true,
            });
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);

            // Still return success since user was created
            return res.status(201).json({
                success: true,
                message:
                    "Account created successfully. However, verification email could not be sent. Please try to resend later.",
                user: {
                    id_users: newUser.registration.id_users,
                    name: safeName,
                    email: newUser.registration.email,
                    role: newUser.registration.role,
                    id_department: newUser.registration.id_department,
                    email_verified: newUser.registration.email_verified,
                    department: {
                        id_department: newUser.department.id_department,
                        name: newUser.department.name,
                    },
                },
                requiresEmailVerification: true,
            });
        }
    } catch (error) {
        console.error("Signup error:", error);

        // Handle Prisma unique constraint errors
        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error during registration",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const userData = await User.findByEmail(email.toLowerCase().trim());

        if (email !== userData.email) {
            return res.status(400).json({
                success: false,
                message: "Email not match our records",
            });
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "OTP must be 6 digits",
            });
        }

        // Verify email OTP
        const result = await OTPService.verifyEmailOTP(
            email,
            otp,
            userData.name,
            userData.department.name
        );

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                code: result.code,
                remainingAttempts: result.remainingAttempts,
            });
        }

        return res.json({
            success: true,
            message:
                "Email verified successfully. You can now login to your account.",
        });
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify email. Please try again.",
        });
    }
};

exports.resendEmailVerification = async (req, res) => {
    const { email } = req.body;

    try {
        // Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Check if user exists and email is not already verified
        const user = await User.findByEmail(email.toLowerCase().trim());
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.email_verified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        // Send new verification OTP
        await OTPService.sendEmailVerificationOTP(email, req);

        return res.json({
            success: true,
            message: "Verification code has been sent to your email.",
        });
    } catch (error) {
        console.error("Resend email verification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to resend verification code.",
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Check if user exists
        const user = await User.findByEmail(email.toLowerCase().trim());
        if (!user) {
            return res.json({
                success: true,
                message:
                    "If the email exists in our system, you will receive a verification code shortly.",
            });
        }

        // Check if there's already an active OTP
        const hasActiveOTP = await OTPService.hasActiveOTP(email);
        if (hasActiveOTP) {
            return res.status(429).json({
                success: false,
                message:
                    "An OTP is already active. Please wait before requesting a new one or check your email.",
                code: "OTP_ALREADY_ACTIVE",
            });
        }

        // Generate OTP
        const otp = OTPService.generateOTP();

        // Store OTP
        const result = await OTPService.storeOTP(
            email,
            otp,
            "PASSWORD_RESET",
            req
        );

        // Send OTP via email
        await EmailService.sendOTPEmail(email, otp, user.name);

        return res.json({
            success: true,
            message:
                "Verification code has been sent to your email. Please check your inbox.",
            expiresAt: result.expiresAt,
        });
    } catch (error) {
        console.error("Forgot password error:", error);

        // Clean up OTP if email sending failed
        if (email) {
            await OTPService.cleanupOTP(email);
        }

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to process password reset request. Please try again later.",
        });
    }
};

exports.verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "OTP must be 6 digits",
            });
        }

        // Verify OTP
        const verificationResult = await OTPService.verifyOTP(
            email,
            otp,
            "PASSWORD_RESET"
        );

        if (!verificationResult.success) {
            return res.status(400).json({
                success: false,
                message: verificationResult.message,
                code: verificationResult.code,
                remainingAttempts: verificationResult.remainingAttempts,
            });
        }

        return res.json({
            success: true,
            message:
                "OTP verified successfully. You can now reset your password.",
            resetToken: verificationResult.resetToken,
        });
    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify OTP. Please try again.",
        });
    }
};

exports.resetPassword = async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;

    try {
        // Validate input
        if (!resetToken || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Reset token, new password, and password confirmation are required",
            });
        }

        // Validate password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match",
            });
        }

        // Validate password strength
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Password does not meet requirements",
                errors: passwordValidation.errors,
            });
        }

        // Validate reset token
        const tokenValidation = await OTPService.validateResetToken(resetToken);
        if (!tokenValidation.success) {
            return res.status(400).json({
                success: false,
                message: tokenValidation.message,
            });
        }

        // Update user password
        await User.updateById(tokenValidation.userId, {
            password: newPassword,
        });

        // Clean up OTP data
        await OTPService.cleanupOTP(tokenValidation.email);

        // Invalidate all existing user sessions for security
        await AuthService.revokeTokens(tokenValidation.userId);

        return res.json({
            success: true,
            message:
                "Password has been reset successfully. Please login with your new password.",
        });
    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password. Please try again.",
        });
    }
};

exports.resendOTP = async (req, res) => {
    const { email } = req.body;

    try {
        // Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Check rate limiting
        const rateLimitCheck = await OTPService.checkRateLimit(
            email,
            "PASSWORD_RESET"
        );
        if (!rateLimitCheck.allowed) {
            return res.status(429).json({
                success: false,
                message: rateLimitCheck.message,
                resetTime: rateLimitCheck.resetTime,
            });
        }

        // Check if user exists
        const user = await User.findByEmail(email.toLowerCase().trim());
        if (!user) {
            return res.json({
                success: true,
                message:
                    "If the email exists in our system, you will receive a verification code shortly.",
            });
        }

        // Clean up any existing OTP
        await OTPService.cleanupOTP(email);

        // Generate new OTP
        const otp = OTPService.generateOTP();

        // Store new OTP
        const result = await OTPService.storeOTP(
            email,
            otp,
            "PASSWORD_RESET",
            req
        );

        // Send OTP via email
        await EmailService.sendOTPEmail(email, otp, user.name);

        return res.json({
            success: true,
            message: "New verification code has been sent to your email.",
            expiresAt: result.expiresAt,
        });
    } catch (error) {
        console.error("Resend OTP error:", error);
        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Failed to resend verification code. Please try again later.",
        });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    try {
        const userId = req.user?.id_users;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        // Validate input
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "Current password, new password, and confirmation are required",
            });
        }

        // Validate password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New passwords do not match",
            });
        }

        // Validate new password strength
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                success: false,
                message: "New password does not meet requirements",
                errors: passwordValidation.errors,
            });
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await comparePassword(
            currentPassword,
            user.password
        );
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Check if new password is different from current
        const isSamePassword = await comparePassword(
            newPassword,
            user.password
        );
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from current password",
            });
        }

        // Update password
        await User.updateById(userId, { password: newPassword });

        // Log password change
        await AuthService.createAuditLog({
            user_id: userId,
            action: "PASSWORD_CHANGE",
            ip_address: AuthService.getClientIP(req),
            user_agent: req.get("User-Agent"),
        });

        // Optionally revoke all sessions except current
        // await AuthService.revokeTokens(userId, "REFRESH_TOKEN");

        return res.json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to change password",
        });
    }
};

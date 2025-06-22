const AuthService = require("../services/authService");
const User = require("../models/User");
const EmailService = require("../services/emailService");
const OTPService = require("../services/OTPService");
const bcrypt = require("bcryptjs");
const prisma = require("../../prisma/client");

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
        const authResult = await AuthService.authenticateUser(email, password);

        if (!authResult.success) {
            return res
                .status(authResult.message === "User not found" ? 404 : 401)
                .json({
                    success: false,
                    message: authResult.message,
                });
        }

        // Generate token
        const token = AuthService.generateToken(authResult.user);

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id_users: authResult.user.id_users,
                name: authResult.user.name,
                email: authResult.user.email,
                role: authResult.user.role,
                id_department: authResult.user.id_department,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

exports.logout = (req, res) => {
    try {
        // Extract token from header
        const token = AuthService.extractTokenFromHeader(
            req.headers.authorization
        );

        // Decode token to get user ID
        const decoded = AuthService.decodeToken(token);
        const userId = decoded?.id_users;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid token",
            });
        }

        // Invalidate session
        const sessionInvalidated = AuthService.invalidateSession(userId);

        if (!sessionInvalidated) {
            return res.status(400).json({
                success: false,
                message: "Session not found",
            });
        }

        return res.json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get current user info (optional endpoint)
exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id_users;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            user: {
                id_users: user.id_users,
                name: user.name,
                email: user.email,
                role: user.role,
                id_department: user.id_department,
                department: user.department,
            },
        });
    } catch (error) {
        console.error("Get current user error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
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

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Validate password strength
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long",
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
        const existingUser = await User.findByEmail(email);
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
        };

        // Create new user
        const newUser = await User.create(userData);

        // Return success response with user data and token
        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id_users: newUser.id_users,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                id_department: newUser.id_department,
                department: {
                    id_department: newUser.department.id_department,
                    name: newUser.department.name,
                },
            },
        });
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

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Validate input
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        // Check if user exists
        const user = await User.findByEmail(email.toLowerCase().trim());
        if (!user) {
            // For security, don't reveal if email exists or not
            return res.json({
                success: true,
                message: "If the email exists in our system, you will receive a verification code shortly."
            });
        }

        // Check if there's already an active OTP
        if (OTPService.hasActiveOTP(email)) {
            return res.status(429).json({
                success: false,
                message: "An OTP is already active. Please wait before requesting a new one or check your email.",
                code: "OTP_ALREADY_ACTIVE"
            });
        }

        // Generate OTP
        const otp = OTPService.generateOTP();
        
        // Store OTP
        const resetToken = OTPService.storeOTP(email, otp);

        // Send OTP via email
        await EmailService.sendOTPEmail(email, otp, user.name);

        return res.json({
            success: true,
            message: "Verification code has been sent to your email. Please check your inbox.",
            resetToken // This will be used in subsequent requests
        });

    } catch (error) {
        console.error("Forgot password error:", error);
        
        // Clean up OTP if email sending failed
        if (email) {
            OTPService.cleanupOTP(email);
        }

        return res.status(500).json({
            success: false,
            message: "Failed to process password reset request. Please try again later."
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
                message: "Email and OTP are required"
            });
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "OTP must be 6 digits"
            });
        }

        // Verify OTP
        const verificationResult = OTPService.verifyOTP(email, otp);

        if (!verificationResult.success) {
            return res.status(400).json({
                success: false,
                message: verificationResult.message,
                code: verificationResult.code,
                remainingAttempts: verificationResult.remainingAttempts
            });
        }

        return res.json({
            success: true,
            message: "OTP verified successfully. You can now reset your password.",
            resetToken: verificationResult.resetToken
        });

    } catch (error) {
        console.error("OTP verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify OTP. Please try again."
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
                message: "Reset token, new password, and password confirmation are required"
            });
        }

        // Validate password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Validate reset token
        const tokenValidation = OTPService.validateResetToken(resetToken);
        if (!tokenValidation.success) {
            return res.status(400).json({
                success: false,
                message: tokenValidation.message
            });
        }

        // Get user by email
        const user = await User.findByEmail(tokenValidation.email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update user password
        await User.updateById(user.id_users, { password: newPassword });

        // Clean up OTP data
        OTPService.cleanupOTP(tokenValidation.email);

        // Invalidate all existing user sessions for security
        AuthService.invalidateSession(user.id_users);

        return res.json({
            success: true,
            message: "Password has been reset successfully. Please login with your new password."
        });

    } catch (error) {
        console.error("Reset password error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reset password. Please try again."
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
                message: "Email is required"
            });
        }

        // Check if user exists
        const user = await User.findByEmail(email.toLowerCase().trim());
        if (!user) {
            return res.json({
                success: true,
                message: "If the email exists in our system, you will receive a verification code shortly."
            });
        }

        // Clean up any existing OTP
        OTPService.cleanupOTP(email);

        // Generate new OTP
        const otp = OTPService.generateOTP();
        
        // Store new OTP
        const resetToken = OTPService.storeOTP(email, otp);

        // Send OTP via email
        await EmailService.sendOTPEmail(email, otp, user.name);

        return res.json({
            success: true,
            message: "New verification code has been sent to your email.",
            resetToken
        });

    } catch (error) {
        console.error("Resend OTP error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to resend verification code. Please try again later."
        });
    }
};

// Export session secrets for backward compatibility with middleware
exports.sessionSecrets = AuthService.getSessionSecrets();

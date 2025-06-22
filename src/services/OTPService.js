const crypto = require("crypto");

class OTPService {
    constructor() {
        // Store OTP data in memory (in production, use Redis or database)
        this.otpStore = new Map();
        this.OTP_EXPIRY_TIME = 2 * 60 * 1000; // 2 minutes in milliseconds
        this.MAX_ATTEMPTS = 3; // Maximum verification attempts
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
     * Store OTP with expiry time and attempt counter
     */
    storeOTP(email, otp) {
        const resetToken = this.generateResetToken();
        const otpData = {
            otp,
            email,
            resetToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + this.OTP_EXPIRY_TIME,
            attempts: 0,
            verified: false,
        };

        // Use email as key for OTP storage
        this.otpStore.set(email.toLowerCase(), otpData);

        return resetToken;
    }

    /**
     * Verify OTP code
     */
    verifyOTP(email, inputOTP) {
        const normalizedEmail = email.toLowerCase();
        const otpData = this.otpStore.get(normalizedEmail);

        if (!otpData) {
            return {
                success: false,
                message: "OTP not found. Please request a new code.",
                code: "OTP_NOT_FOUND",
            };
        }

        // Check if OTP has expired
        if (Date.now() > otpData.expiresAt) {
            this.otpStore.delete(normalizedEmail);
            return {
                success: false,
                message: "OTP has expired. Please request a new code.",
                code: "OTP_EXPIRED",
            };
        }

        // Check if maximum attempts exceeded
        if (otpData.attempts >= this.MAX_ATTEMPTS) {
            this.otpStore.delete(normalizedEmail);
            return {
                success: false,
                message:
                    "Maximum verification attempts exceeded. Please request a new code.",
                code: "MAX_ATTEMPTS_EXCEEDED",
            };
        }

        // Increment attempt counter
        otpData.attempts++;

        // Verify OTP
        if (otpData.otp !== inputOTP.toString()) {
            const remainingAttempts = this.MAX_ATTEMPTS - otpData.attempts;
            return {
                success: false,
                message: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
                code: "INVALID_OTP",
                remainingAttempts,
            };
        }

        // OTP is valid, mark as verified
        otpData.verified = true;
        return {
            success: true,
            message: "OTP verified successfully",
            resetToken: otpData.resetToken,
        };
    }

    /**
     * Validate reset token for password change
     */
    validateResetToken(resetToken) {
        // Find OTP data by reset token
        for (const [email, otpData] of this.otpStore.entries()) {
            if (otpData.resetToken === resetToken) {
                // Check if token is still valid and OTP was verified
                if (Date.now() <= otpData.expiresAt && otpData.verified) {
                    return {
                        success: true,
                        email: otpData.email,
                    };
                } else {
                    // Clean up expired or unverified token
                    this.otpStore.delete(email);
                    return {
                        success: false,
                        message: "Reset token has expired or is invalid",
                    };
                }
            }
        }

        return {
            success: false,
            message: "Invalid reset token",
        };
    }

    /**
     * Clean up OTP data after successful password reset
     */
    cleanupOTP(email) {
        const normalizedEmail = email.toLowerCase();
        return this.otpStore.delete(normalizedEmail);
    }

    /**
     * Check if OTP exists for email
     */
    hasActiveOTP(email) {
        const normalizedEmail = email.toLowerCase();
        const otpData = this.otpStore.get(normalizedEmail);

        if (!otpData) return false;

        // Check if OTP is still valid
        if (Date.now() > otpData.expiresAt) {
            this.otpStore.delete(normalizedEmail);
            return false;
        }

        return true;
    }

    /**
     * Get OTP info (for debugging - remove in production)
     */
    getOTPInfo(email) {
        const normalizedEmail = email.toLowerCase();
        const otpData = this.otpStore.get(normalizedEmail);

        if (!otpData) return null;

        return {
            email: otpData.email,
            hasOTP: true,
            attempts: otpData.attempts,
            maxAttempts: this.MAX_ATTEMPTS,
            expiresAt: new Date(otpData.expiresAt),
            verified: otpData.verified,
            timeRemaining: Math.max(0, otpData.expiresAt - Date.now()),
        };
    }

    /**
     * Clean up expired OTPs (should be called periodically)
     */
    cleanupExpiredOTPs() {
        const now = Date.now();
        let cleanedCount = 0;

        for (const [email, otpData] of this.otpStore.entries()) {
            if (now > otpData.expiresAt) {
                this.otpStore.delete(email);
                cleanedCount++;
            }
        }

        return cleanedCount;
    }
}

module.exports = new OTPService();

// services/CleanupService.js - Service for cleaning up expired tokens and OTPs
const AuthService = require("./authService");
const OTPService = require("./OTPService");
const cron = require("node-cron");

class CleanupService {
    constructor() {
        this.isRunning = false;
        this.isCleaning = false;
        this.stats = {
            lastRun: null,
            totalTokensCleanedUp: 0,
            totalOTPsCleanedUp: 0,
            totalAuditLogsCleanedUp: 0,
            errors: [],
        };
    }

    /**
     * Start cleanup scheduler
     */
    startScheduler() {
        if (this.isRunning) {
            console.log("⚠️ Cleanup service is already running");
            return;
        }

        console.log("🧹 Starting cleanup service scheduler...");

        // Run every hour to cleanup expired tokens and OTPs
        cron.schedule("0 * * * *", async () => {
            await this.performCleanup();
        });

        // Run daily at 2 AM to cleanup old audit logs
        cron.schedule("0 2 * * *", async () => {
            await this.performDeepCleanup();
        });

        this.isRunning = true;
        console.log("✅ Cleanup service started successfully");

        // Run initial cleanup
        this.performCleanup();
    }

    /**
     * Stop cleanup scheduler
     */
    stopScheduler() {
        this.isRunning = false;
        console.log("🛑 Cleanup service stopped");
    }

    /**
     * Perform regular cleanup (tokens and OTPs)
     */
    async performCleanup() {
        if (!this.isRunning || this.isCleaning) return;

        this.isCleaning = true;
        const startTime = Date.now();
        console.log("🧹 Starting regular cleanup...");

        try {
            // Cleanup expired tokens
            const tokensCleanedUp = await this.cleanupExpiredTokens();

            // Cleanup expired OTPs
            const otpsCleanedUp = await this.cleanupExpiredOTPs();

            // Update stats
            this.stats.lastRun = new Date();
            this.stats.totalTokensCleanedUp += tokensCleanedUp;
            this.stats.totalOTPsCleanedUp += otpsCleanedUp;

            const duration = Date.now() - startTime;
            console.log(`✅ Regular cleanup completed in ${duration}ms`);
            console.log(`   - Tokens cleaned: ${tokensCleanedUp}`);
            console.log(`   - OTPs cleaned: ${otpsCleanedUp}`);
        } catch (error) {
            console.error("❌ Error during regular cleanup:", error);
            this.stats.errors.push({
                timestamp: new Date(),
                type: "regular_cleanup",
                error: error.message,
            });
        } finally {
            this.isCleaning = false;
        }
    }

    /**
     * Perform deep cleanup (includes audit logs and other old data)
     */
    async performDeepCleanup() {
        if (!this.isRunning || this.isCleaning) return;

        this.isCleaning = true;
        const startTime = Date.now();
        console.log("🔍 Starting deep cleanup...");

        try {
            // Perform regular cleanup first
            await this.performCleanup();

            // Cleanup old audit logs (older than 90 days)
            const auditLogsCleanedUp = await this.cleanupOldAuditLogs(90);

            // Update stats
            this.stats.totalAuditLogsCleanedUp += auditLogsCleanedUp;

            // Cleanup old error logs from stats (keep only last 100)
            if (this.stats.errors.length > 100) {
                this.stats.errors = this.stats.errors.slice(-100);
            }

            const duration = Date.now() - startTime;
            console.log(`✅ Deep cleanup completed in ${duration}ms`);
            console.log(`   - Audit logs cleaned: ${auditLogsCleanedUp}`);
        } catch (error) {
            console.error("❌ Error during deep cleanup:", error);
            this.stats.errors.push({
                timestamp: new Date(),
                type: "deep_cleanup",
                error: error.message,
            });
        } finally {
            this.isCleaning = false;
        }
    }

    /**
     * Cleanup expired tokens
     */
    async cleanupExpiredTokens() {
        try {
            console.log("🧹 Cleaning up expired tokens...");
            const count = await AuthService.cleanupExpiredTokens();
            console.log(`   - Removed ${count} expired tokens`);
            return count;
        } catch (error) {
            console.error("❌ Error cleaning up tokens:", error);
            throw error;
        }
    }

    /**
     * Cleanup expired OTPs
     */
    async cleanupExpiredOTPs() {
        try {
            console.log("🧹 Cleaning up expired OTPs...");
            const count = await OTPService.cleanupExpiredOTPs();
            console.log(`   - Removed ${count} expired OTPs`);
            return count;
        } catch (error) {
            console.error("❌ Error cleaning up OTPs:", error);
            throw error;
        }
    }

    /**
     * Cleanup old audit logs
     */
    async cleanupOldAuditLogs(daysOld = 90) {
        try {
            console.log(
                `🧹 Cleaning up audit logs older than ${daysOld} days...`
            );

            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const prisma = require("../../prisma/client");
            const result = await prisma.auditLog.deleteMany({
                where: {
                    created_at: {
                        lt: cutoffDate,
                    },
                },
            });

            console.log(`   - Removed ${result.count} old audit logs`);
            return result.count;
        } catch (error) {
            console.error("❌ Error cleaning up audit logs:", error);
            throw error;
        }
    }

    /**
     * Manual cleanup trigger
     */
    async manualCleanup(type = "regular") {
        console.log(`🔧 Manual ${type} cleanup triggered`);

        if (type === "deep") {
            await this.performDeepCleanup();
        } else {
            await this.performCleanup();
        }
    }

    /**
     * Get cleanup statistics
     */
    getStats() {
        return {
            ...this.stats,
            isRunning: this.isRunning,
            uptime: this.stats.lastRun
                ? Date.now() - this.stats.lastRun.getTime()
                : null,
        };
    }

    /**
     * Reset statistics
     */
    resetStats() {
        this.stats = {
            lastRun: null,
            totalTokensCleanedUp: 0,
            totalOTPsCleanedUp: 0,
            totalAuditLogsCleanedUp: 0,
            errors: [],
        };
        console.log("📊 Cleanup statistics reset");
    }

    /**
     * Health check for cleanup service
     */
    async healthCheck() {
        const now = Date.now();
        const lastRunTime = this.stats.lastRun
            ? this.stats.lastRun.getTime()
            : 0;
        const timeSinceLastRun = now - lastRunTime;

        // Consider unhealthy if last run was more than 2 hours ago
        const isHealthy =
            this.isRunning &&
            (timeSinceLastRun < 2 * 60 * 60 * 1000 || !this.stats.lastRun);

        return {
            healthy: isHealthy,
            isRunning: this.isRunning,
            lastRun: this.stats.lastRun,
            timeSinceLastRun: timeSinceLastRun,
            recentErrors: this.stats.errors.slice(-5), // Last 5 errors
            stats: this.getStats(),
        };
    }

    /**
     * Cleanup specific user data (for GDPR compliance)
     */
    async cleanupUserData(userId) {
        try {
            console.log(`🗑️ Cleaning up data for user ${userId}...`);

            const prisma = require("../../prisma/client");

            // Count records before deletion
            const [tokenCount, otpCount, auditCount] = await Promise.all([
                prisma.token.count({ where: { user_id: parseInt(userId) } }),
                prisma.otpCode.count({ where: { user_id: parseInt(userId) } }),
                prisma.auditLog.count({ where: { user_id: parseInt(userId) } }),
            ]);

            // Delete user-related data
            await prisma.$transaction([
                prisma.token.deleteMany({
                    where: { user_id: parseInt(userId) },
                }),
                prisma.otpCode.deleteMany({
                    where: { user_id: parseInt(userId) },
                }),
                // Note: Audit logs might be kept for compliance, or anonymized instead of deleted
                prisma.auditLog.updateMany({
                    where: { user_id: parseInt(userId) },
                    data: { user_id: null }, // Anonymize instead of delete
                }),
            ]);

            console.log(`✅ User data cleanup completed for user ${userId}:`);
            console.log(`   - Tokens removed: ${tokenCount}`);
            console.log(`   - OTPs removed: ${otpCount}`);
            console.log(`   - Audit logs anonymized: ${auditCount}`);

            return {
                success: true,
                tokensRemoved: tokenCount,
                otpsRemoved: otpCount,
                auditLogsAnonymized: auditCount,
            };
        } catch (error) {
            console.error(`❌ Error cleaning up user ${userId} data:`, error);
            throw error;
        }
    }

    /**
     * Emergency cleanup - removes all expired data immediately
     */
    async emergencyCleanup() {
        console.log("🚨 Emergency cleanup initiated...");

        try {
            const startTime = Date.now();

            // Run all cleanup operations
            const [tokens, otps, auditLogs] = await Promise.all([
                this.cleanupExpiredTokens(),
                this.cleanupExpiredOTPs(),
                this.cleanupOldAuditLogs(30), // More aggressive - 30 days instead of 90
            ]);

            const duration = Date.now() - startTime;

            console.log(`✅ Emergency cleanup completed in ${duration}ms`);
            console.log(
                `   - Total items cleaned: ${tokens + otps + auditLogs}`
            );

            return {
                success: true,
                duration: duration,
                tokensCleanedUp: tokens,
                otpsCleanedUp: otps,
                auditLogsCleanedUp: auditLogs,
                totalCleaned: tokens + otps + auditLogs,
            };
        } catch (error) {
            console.error("❌ Emergency cleanup failed:", error);
            throw error;
        }
    }
}

module.exports = new CleanupService();

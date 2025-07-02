// utils/logger.js - Enhanced logging system
const fs = require("fs");
const path = require("path");
const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
            timestamp,
            level,
            message,
            ...meta,
        });
    })
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: logFormat,
    defaultMeta: {
        service: "kanban-system",
        version: process.env.APP_VERSION || "1.0.0",
    },
    transports: [
        // Console output for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
                winston.format.printf(
                    ({ timestamp, level, message, ...meta }) => {
                        const metaStr = Object.keys(meta).length
                            ? JSON.stringify(meta, null, 2)
                            : "";
                        return `${timestamp} [${level}]: ${message} ${metaStr}`;
                    }
                )
            ),
        }),

        // General application logs
        new DailyRotateFile({
            filename: path.join(logsDir, "application-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d",
            level: "info",
        }),

        // Error logs
        new DailyRotateFile({
            filename: path.join(logsDir, "error-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "30d",
            level: "error",
        }),

        // Security logs
        new DailyRotateFile({
            filename: path.join(logsDir, "security-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "90d",
            level: "warn",
        }),
    ],
});

// Performance monitoring class
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.startTimes = new Map();
    }

    startTimer(operation, metadata = {}) {
        const timerId = `${operation}_${Date.now()}_${Math.random()}`;
        this.startTimes.set(timerId, {
            start: process.hrtime.bigint(),
            operation,
            metadata,
        });
        return timerId;
    }

    endTimer(timerId) {
        const timerData = this.startTimes.get(timerId);
        if (!timerData) {
            logger.warn("Timer not found", { timerId });
            return null;
        }

        const duration =
            Number(process.hrtime.bigint() - timerData.start) / 1000000; // Convert to ms
        this.startTimes.delete(timerId);

        // Log performance metric
        logger.info("Performance metric", {
            operation: timerData.operation,
            duration_ms: duration,
            metadata: timerData.metadata,
        });

        // Store metrics for reporting
        if (!this.metrics.has(timerData.operation)) {
            this.metrics.set(timerData.operation, []);
        }
        this.metrics.get(timerData.operation).push({
            duration,
            timestamp: new Date(),
            metadata: timerData.metadata,
        });

        return duration;
    }

    getMetrics(operation) {
        const operationMetrics = this.metrics.get(operation) || [];
        if (operationMetrics.length === 0) return null;

        const durations = operationMetrics.map((m) => m.duration);
        return {
            operation,
            count: durations.length,
            avg: durations.reduce((a, b) => a + b, 0) / durations.length,
            min: Math.min(...durations),
            max: Math.max(...durations),
            recent: operationMetrics.slice(-10), // Last 10 operations
        };
    }

    getAllMetrics() {
        const allMetrics = {};
        for (const [operation] of this.metrics) {
            allMetrics[operation] = this.getMetrics(operation);
        }
        return allMetrics;
    }

    clearMetrics() {
        this.metrics.clear();
        this.startTimes.clear();
    }
}

// Create global performance monitor instance
const performanceMonitor = new PerformanceMonitor();

// Request logging middleware
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const timerId = performanceMonitor.startTimer("http_request", {
        method: req.method,
        url: req.originalUrl,
        userAgent: req.get("User-Agent"),
        ip: req.ip,
        userId: req.user?.id_users,
    });

    // Log incoming request
    logger.info("Incoming request", {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        userId: req.user?.id_users,
        requestId: timerId,
    });

    // Override res.json to log response
    const originalJson = res.json;
    res.json = function (data) {
        const duration = performanceMonitor.endTimer(timerId);

        // Log response
        logger.info("Request completed", {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration_ms: duration,
            userId: req.user?.id_users,
            requestId: timerId,
            success: data?.success || res.statusCode < 400,
        });

        // Call original json method
        return originalJson.call(this, data);
    };

    next();
};

// Security event logger
const securityLogger = {
    logFailedLogin: (email, ip, userAgent, reason) => {
        logger.warn("Failed login attempt", {
            event: "FAILED_LOGIN",
            email,
            ip,
            userAgent,
            reason,
            severity: "medium",
        });
    },

    logSuspiciousActivity: (userId, activity, details, ip) => {
        logger.warn("Suspicious activity detected", {
            event: "SUSPICIOUS_ACTIVITY",
            userId,
            activity,
            details,
            ip,
            severity: "high",
        });
    },

    logSecurityViolation: (violation, details, req) => {
        logger.error("Security violation", {
            event: "SECURITY_VIOLATION",
            violation,
            details,
            ip: req.ip,
            userAgent: req.get("User-Agent"),
            userId: req.user?.id_users,
            url: req.originalUrl,
            method: req.method,
            severity: "critical",
        });
    },

    logPrivilegeEscalation: (
        userId,
        attemptedAction,
        currentRole,
        requiredRole
    ) => {
        logger.error("Privilege escalation attempt", {
            event: "PRIVILEGE_ESCALATION",
            userId,
            attemptedAction,
            currentRole,
            requiredRole,
            severity: "critical",
        });
    },
};

// Business operation logger
const businessLogger = {
    logKanbanCreated: (kanbanData, userId) => {
        logger.info("Kanban request created", {
            event: "KANBAN_CREATED",
            kanbanId: kanbanData.id_kanban,
            userId,
            requester: kanbanData.nama_requester,
            partsNumber: kanbanData.parts_number,
            department: kanbanData.id_department,
        });
    },

    logKanbanApproved: (kanbanId, userId, role, department) => {
        logger.info("Kanban request approved", {
            event: "KANBAN_APPROVED",
            kanbanId,
            approvedBy: userId,
            role,
            department,
        });
    },

    logKanbanRejected: (kanbanId, userId, role, reason) => {
        logger.warn("Kanban request rejected", {
            event: "KANBAN_REJECTED",
            kanbanId,
            rejectedBy: userId,
            role,
            reason,
        });
    },

    logStatusChange: (kanbanId, oldStatus, newStatus, userId) => {
        logger.info("Kanban status changed", {
            event: "STATUS_CHANGE",
            kanbanId,
            oldStatus,
            newStatus,
            changedBy: userId,
        });
    },

    logNotificationSent: (type, recipients, success, failure) => {
        logger.info("Notifications sent", {
            event: "NOTIFICATION_SENT",
            type,
            recipientsCount: recipients,
            successCount: success,
            failureCount: failure,
        });
    },
};

// System health checker
class HealthChecker {
    constructor() {
        this.checks = new Map();
        this.lastCheck = null;
        this.status = "unknown";
    }

    addCheck(name, checkFunction) {
        this.checks.set(name, checkFunction);
    }

    async runChecks() {
        const results = {};
        let overallHealthy = true;

        for (const [name, checkFunction] of this.checks) {
            try {
                const startTime = Date.now();
                const result = await checkFunction();
                const duration = Date.now() - startTime;

                results[name] = {
                    status: "healthy",
                    duration_ms: duration,
                    details: result,
                    timestamp: new Date(),
                };
            } catch (error) {
                overallHealthy = false;
                results[name] = {
                    status: "unhealthy",
                    error: error.message,
                    timestamp: new Date(),
                };

                logger.error("Health check failed", {
                    check: name,
                    error: error.message,
                    stack: error.stack,
                });
            }
        }

        this.lastCheck = {
            timestamp: new Date(),
            status: overallHealthy ? "healthy" : "unhealthy",
            checks: results,
            metrics: performanceMonitor.getAllMetrics(),
        };

        this.status = this.lastCheck.status;

        // Log overall health status
        logger.info("Health check completed", {
            status: this.status,
            checksCount: this.checks.size,
            healthyCount: Object.values(results).filter(
                (r) => r.status === "healthy"
            ).length,
        });

        return this.lastCheck;
    }

    getLastCheck() {
        return this.lastCheck;
    }

    isHealthy() {
        return this.status === "healthy";
    }
}

// Initialize health checker with default checks
const healthChecker = new HealthChecker();

// Add database health check
healthChecker.addCheck("database", async () => {
    const prisma = require("../../prisma/client");
    await prisma.$queryRaw`SELECT 1`;
    return { connection: "active" };
});

// Add memory usage check
healthChecker.addCheck("memory", async () => {
    const memUsage = process.memoryUsage();
    const usage = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
    };

    // Alert if memory usage is high
    if (usage.heapUsed > 500) {
        // 500MB threshold
        logger.warn("High memory usage detected", usage);
    }

    return usage;
});

// Error aggregator for monitoring
class ErrorAggregator {
    constructor() {
        this.errors = [];
        this.errorCounts = new Map();
    }

    addError(error, context = {}) {
        const errorInfo = {
            message: error.message,
            stack: error.stack,
            context,
            timestamp: new Date(),
            count: 1,
        };

        // Count similar errors
        const errorKey = `${error.message}_${context.url || "unknown"}`;
        if (this.errorCounts.has(errorKey)) {
            this.errorCounts.set(errorKey, this.errorCounts.get(errorKey) + 1);
            errorInfo.count = this.errorCounts.get(errorKey);
        } else {
            this.errorCounts.set(errorKey, 1);
        }

        this.errors.push(errorInfo);

        // Keep only last 1000 errors
        if (this.errors.length > 1000) {
            this.errors = this.errors.slice(-1000);
        }

        // Log if error occurs frequently
        if (errorInfo.count > 5) {
            logger.error("Frequent error detected", {
                message: error.message,
                count: errorInfo.count,
                context,
            });
        }
    }

    getErrorSummary() {
        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentErrors = this.errors.filter(
            (e) => e.timestamp > last24Hours
        );

        const errorsByType = {};
        for (const error of recentErrors) {
            if (!errorsByType[error.message]) {
                errorsByType[error.message] = 0;
            }
            errorsByType[error.message]++;
        }

        return {
            total: recentErrors.length,
            errorTypes: errorsByType,
            mostFrequent: Object.entries(errorsByType)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5),
        };
    }
}

const errorAggregator = new ErrorAggregator();

// Export all utilities
module.exports = {
    logger,
    performanceMonitor,
    requestLogger,
    securityLogger,
    businessLogger,
    healthChecker,
    errorAggregator,
};

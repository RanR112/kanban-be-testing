require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

// Import enhanced utilities
const { config, configManager } = require("./config");
// const { healthChecker, performanceMonitor } = require("./utils/logger");
const {
    globalErrorHandler,
    sanitizeInput,
    createRateLimit,
} = require("./middlewares/ErrorHandler");

// Import services
const CleanupService = require("./services/CleanupService");
const EmailService = require("./services/emailService");

// Import routes
const router = require("./routes");
const cookieParser = require("cookie-parser");

const app = express();

/**
 * SECURITY MIDDLEWARE
 */
if (config.security.helmetEnabled) {
    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
            crossOriginEmbedderPolicy: false,
        })
    );
}

/**
 * CORS CONFIGURATION
 */

const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "x-api-key",
            "Accept",
            "Origin",
            "X-Requested-With",
        ],
        credentials: true,
        maxAge: 86400, // 24 hours
        preflightContinue: false,
        optionsSuccessStatus: 200,
    })
);


app.use(cookieParser());
/**
 * COMPRESSION & PERFORMANCE
 */
if (config.production.enableCompression) {
    app.use(compression());
}

/**
 * RATE LIMITING
 */
const globalRateLimit = createRateLimit(
    config.security.rateLimitWindow,
    config.security.rateLimitMax,
    "Too many requests from this IP, please try again later."
);
app.use(globalRateLimit);

/**
 * BODY PARSING & SANITIZATION
 */
app.use(
    express.json({
        limit: "10mb",
        verify: (req, res, buf) => {
            try {
                JSON.parse(buf);
            } catch (e) {
                const error = new Error("Invalid JSON format");
                error.status = 400;
                error.code = "INVALID_JSON";
                throw error;
            }
        },
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

// Input sanitization
app.use(sanitizeInput);

/**
 * HEALTH CHECK ENDPOINT
 */
// app.get("/health", async (req, res) => {
//     try {
//         const healthResult = await healthChecker.runChecks();

//         const status = healthResult.status === "healthy" ? 200 : 503;

//         res.status(status).json({
//             success: healthResult.status === "healthy",
//             ...healthResult,
//             uptime: process.uptime(),
//             version: config.app.version,
//             environment: config.app.environment,
//         });
//     } catch (error) {
//         res.status(503).json({
//             success: false,
//             status: "unhealthy",
//             timestamp: new Date().toISOString(),
//             error: error.message,
//         });
//     }
// });

/**
 * API ROUTES
 */
app.use(config.api.prefix, router);

// Admin monitoring endpoints
// app.get("/api/v2/admin/metrics", async (req, res) => {
//     try {
//         // Add proper admin authentication here
//         const metrics = performanceMonitor.getAllMetrics();
//         const healthStatus = healthChecker.getLastCheck();

//         res.json({
//             success: true,
//             data: {
//                 performance: metrics,
//                 health: healthStatus,
//                 config: configManager.healthCheck(),
//                 uptime: process.uptime(),
//                 memory: process.memoryUsage(),
//             },
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to get system metrics",
//         });
//     }
// });

// app.get("/api/v2/admin/cleanup/stats", async (req, res) => {
//     try {
//         const stats = CleanupService.getStats();
//         res.json({
//             success: true,
//             data: stats,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Failed to get cleanup stats",
//         });
//     }
// });

// app.post("/api/v2/admin/cleanup/manual", async (req, res) => {
//     try {
//         const { type = "regular" } = req.body;
//         await CleanupService.manualCleanup(type);

//         res.json({
//             success: true,
//             message: `Manual ${type} cleanup completed`,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: "Manual cleanup failed",
//         });
//     }
// });

/**
 * 404 HANDLER
 */
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        code: "ROUTE_NOT_FOUND",
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
});

/**
 * GLOBAL ERROR HANDLER
 */
app.use(globalErrorHandler);

/**
 * GRACEFUL SHUTDOWN
 */
// const gracefulShutdown = async (signal) => {
//     console.log(`${signal} received. Starting graceful shutdown...`);

//     try {
//         // Stop cleanup service
//         CleanupService.stopScheduler();
//         console.log("Cleanup service stopped");

//         // Close database connections
//         const prisma = require("../prisma/client");
//         await prisma.$disconnect();
//         console.log("Database disconnected");

//         // Close email service
//         await EmailService.close();
//         console.log("Email service closed");

//         console.log("Graceful shutdown completed");
//         process.exit(0);
//     } catch (error) {
//         console.error("Error during graceful shutdown:", error.message);
//         process.exit(1);
//     }
// };

// Handle shutdown signals
// process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
// process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
// process.on("uncaughtException", (error) => {
//     console.error("Uncaught Exception:", error.message, error.stack);
//     gracefulShutdown("UNCAUGHT_EXCEPTION");
// });

// process.on("unhandledRejection", (reason, promise) => {
//     console.error("Unhandled Rejection:", reason, promise);
//     gracefulShutdown("UNHANDLED_REJECTION");
// });

/**
 * START SERVER
 */
const startServer = async () => {
    // const timerId = performanceMonitor.startTimer("server_startup");

    try {
        // Validate configuration
        const configHealth = configManager.healthCheck();
        if (!configHealth.healthy) {
            console.warn("Configuration issues detected:", configHealth.issues);
        }

        // Test database connection
        const prisma = require("../prisma/client");
        await prisma.$connect();
        console.log("Database connected successfully");

        // Test email service
        if (config.email.user && config.email.password) {
            const emailHealth = await EmailService.testConnection();
            if (emailHealth.success) {
                console.log("Email service configured successfully");
            } else {
                console.warn("Email service configuration issue:", emailHealth.message);
            }
        } else {
            console.warn("Email configuration incomplete - notifications may not work");
        }

        // Start cleanup service
        CleanupService.startScheduler();
        console.log("Cleanup service started");

        // Start health monitoring
        // if (config.monitoring.enabled) {
        //     setInterval(async () => {
        //         await healthChecker.runChecks();
        //     }, config.monitoring.healthCheckInterval);
        //     console.log("Health monitoring started");
        // }

        // Start HTTP server
        const server = app.listen(config.app.port, config.app.host, () => {
            // performanceMonitor.endTimer(timerId);

            console.log("Server started successfully:", {
                port: config.app.port,
                host: config.app.host,
                environment: config.app.environment,
                version: config.app.version,
                healthCheck: `http://${config.app.host}:${config.app.port}/health`,
            });

            if (configManager.isDevelopment()) {
                console.log("Development mode features enabled:", {
                    debug: config.development.enableDebug,
                    mockNotifications: config.development.mockNotifications,
                });
            }
        });

        // Handle server errors
        server.on("error", (error) => {
            console.error("Server error:", error.message);

            if (error.syscall !== "listen") {
                throw error;
            }

            switch (error.code) {
                case "EACCES":
                    console.error(`Port ${config.app.port} requires elevated privileges`);
                    process.exit(1);
                    break;
                case "EADDRINUSE":
                    console.error(`Port ${config.app.port} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

        // Set production optimizations
        if (configManager.isProduction() && config.production.trustProxy) {
            app.set("trust proxy", true);
        }

        return server;
    } catch (error) {
        console.error("Failed to start server:", error.message, error.stack);
        process.exit(1);
    }
};

// Start the application
if (require.main === module) {
    startServer();
}

module.exports = app;
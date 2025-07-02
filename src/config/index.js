require("dotenv").config();

class ConfigManager {
    constructor() {
        this.env = process.env.NODE_ENV || "development";
        this.config = this.loadConfig();
        this.validateConfig();
    }

    loadConfig() {
        return {
            // Application Settings
            app: {
                name: process.env.APP_NAME || "Kanban System",
                version: process.env.APP_VERSION || "1.0.0",
                environment: this.env,
                port: parseInt(process.env.PORT) || 3000,
                host: process.env.HOST || "localhost",
                timezone: process.env.TZ || "Asia/Jakarta",
                defaultLanguage: process.env.DEFAULT_LANGUAGE || "id",
            },

            // Database Configuration
            database: {
                url: process.env.DATABASE_URL,
                ssl: process.env.DATABASE_SSL === "true",
                poolSize: parseInt(process.env.DATABASE_POOL_SIZE) || 10,
                connectionTimeout:
                    parseInt(process.env.DATABASE_CONNECTION_TIMEOUT) || 10000,
                queryTimeout:
                    parseInt(process.env.DATABASE_QUERY_TIMEOUT) || 30000,
                logQueries: process.env.DATABASE_LOG_QUERIES === "true",
            },

            // JWT Configuration
            jwt: {
                secret: process.env.JWT_SECRET,
                accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || "30m",
                refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
                issuer: process.env.JWT_ISSUER || "kanban-system",
                audience: process.env.JWT_AUDIENCE || "kanban-users",
            },

            // Security Settings
            security: {
                bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
                rateLimitWindow:
                    parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 minutes
                rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
                corsOrigins: process.env.CORS_ORIGINS?.split(",") || [
                    "http://localhost:3000",
                ],
                sessionSecret: process.env.SESSION_SECRET,
                csrfEnabled: process.env.CSRF_ENABLED === "true",
                helmetEnabled: process.env.HELMET_ENABLED !== "false",
            },

            // Email Configuration
            email: {
                service: process.env.EMAIL_SERVICE || "gmail",
                host: process.env.EMAIL_HOST,
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: process.env.EMAIL_SECURE === "true",
                user: process.env.EMAIL_USER,
                password: process.env.EMAIL_PASS,
                from: process.env.EMAIL_FROM || "noreply@kanban-system.com",
                replyTo: process.env.EMAIL_REPLY_TO,
                maxRetries: parseInt(process.env.EMAIL_MAX_RETRIES) || 3,
                retryDelay: parseInt(process.env.EMAIL_RETRY_DELAY) || 5000,
            },

            // WhatsApp/Fonnte Configuration
            whatsapp: {
                apiKey: process.env.FONNTE_API_KEY,
                apiUrl:
                    process.env.FONNTE_API_URL || "https://api.fonnte.com/send",
                defaultCountryCode: process.env.WA_DEFAULT_COUNTRY_CODE || "62",
                enabled: process.env.WHATSAPP_ENABLED !== "false",
                maxRetries: parseInt(process.env.WA_MAX_RETRIES) || 2,
                retryDelay: parseInt(process.env.WA_RETRY_DELAY) || 3000,
            },

            // Logging Configuration
            logging: {
                level: process.env.LOG_LEVEL || "info",
                enableConsole: process.env.LOG_CONSOLE !== "false",
                enableFile: process.env.LOG_FILE !== "false",
                logDirectory: process.env.LOG_DIRECTORY || "./logs",
                maxFiles: process.env.LOG_MAX_FILES || "14d",
                maxSize: process.env.LOG_MAX_SIZE || "20m",
                enableSecurity: process.env.LOG_SECURITY !== "false",
                enablePerformance: process.env.LOG_PERFORMANCE !== "false",
            },

            // File Upload Configuration
            upload: {
                enabled: process.env.FILE_UPLOAD_ENABLED === "true",
                maxSize: parseInt(process.env.UPLOAD_MAX_SIZE) || 5242880, // 5MB
                allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(",") || [
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "application/pdf",
                    "text/plain",
                ],
                destination: process.env.UPLOAD_DESTINATION || "./uploads",
                enableVirusScan: process.env.UPLOAD_VIRUS_SCAN === "true",
            },

            // Cache Configuration (for future implementation)
            cache: {
                enabled: process.env.CACHE_ENABLED === "true",
                type: process.env.CACHE_TYPE || "memory", // memory, redis
                redisUrl: process.env.REDIS_URL,
                defaultTTL: parseInt(process.env.CACHE_DEFAULT_TTL) || 3600, // 1 hour
                maxKeys: parseInt(process.env.CACHE_MAX_KEYS) || 10000,
            },

            // Monitoring & Health Check
            monitoring: {
                enabled: process.env.MONITORING_ENABLED !== "false",
                healthCheckInterval:
                    parseInt(process.env.HEALTH_CHECK_INTERVAL) || 300000, // 5 minutes
                metricsRetention:
                    parseInt(process.env.METRICS_RETENTION) || 86400000, // 24 hours
                alertThresholds: {
                    memoryUsage:
                        parseInt(process.env.ALERT_MEMORY_THRESHOLD) || 500, // MB
                    responseTime:
                        parseInt(process.env.ALERT_RESPONSE_TIME) || 5000, // ms
                    errorRate: parseFloat(process.env.ALERT_ERROR_RATE) || 0.05, // 5%
                },
            },

            // Business Rules
            business: {
                approval: {
                    deadlineDays:
                        parseInt(process.env.APPROVAL_DEADLINE_DAYS) || 3,
                    autoEscalationEnabled:
                        process.env.AUTO_ESCALATION_ENABLED === "true",
                    escalationDays: parseInt(process.env.ESCALATION_DAYS) || 2,
                    maxPendingRequests:
                        parseInt(process.env.MAX_PENDING_REQUESTS) || 50,
                },
                kanban: {
                    maxFutureDate:
                        parseInt(process.env.KANBAN_MAX_FUTURE_DAYS) || 365,
                    allowPastDate:
                        process.env.KANBAN_ALLOW_PAST_DATE === "true",
                    autoCleanupDays:
                        parseInt(process.env.KANBAN_AUTO_CLEANUP_DAYS) || 90,
                },
                department: {
                    pcDepartmentId: parseInt(process.env.PC_DEPARTMENT_ID) || 1,
                    allowCrossDepartmentApproval:
                        process.env.CROSS_DEPT_APPROVAL === "true",
                },
            },

            // API Configuration
            api: {
                prefix: process.env.API_PREFIX || "/api/v1",
                enableDocs: process.env.API_DOCS_ENABLED !== "false",
                docsPath: process.env.API_DOCS_PATH || "/docs",
                enableVersioning: process.env.API_VERSIONING === "true",
                defaultVersion: process.env.API_DEFAULT_VERSION || "v1",
                enableEtag: process.env.API_ETAG_ENABLED === "true",
            },

            // Development Settings
            development: {
                enableDebug:
                    this.env === "development" ||
                    process.env.DEBUG_ENABLED === "true",
                mockNotifications: process.env.MOCK_NOTIFICATIONS === "true",
                seedDatabase: process.env.SEED_DATABASE === "true",
                enableHotReload: process.env.HOT_RELOAD_ENABLED === "true",
                enableProfiler: process.env.PROFILER_ENABLED === "true",
            },

            // Production Settings
            production: {
                enableCompression: process.env.COMPRESSION_ENABLED !== "false",
                enableMinification:
                    process.env.MINIFICATION_ENABLED !== "false",
                enableCaching: process.env.PRODUCTION_CACHING !== "false",
                trustProxy: process.env.TRUST_PROXY === "true",
                enableStrictSSL: process.env.STRICT_SSL !== "false",
            },
        };
    }

    validateConfig() {
        const requiredEnvVars = [
            "DATABASE_URL",
            "JWT_SECRET",
            "EMAIL_USER",
            "EMAIL_PASS",
        ];

        const missing = requiredEnvVars.filter(
            (envVar) => !process.env[envVar]
        );

        if (missing.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missing.join(", ")}`
            );
        }

        // Validate JWT secret strength
        if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
            console.warn(
                "Warning: JWT_SECRET should be at least 32 characters long for security"
            );
        }

        // Validate email configuration
        if (!this.config.email.user || !this.config.email.password) {
            console.warn(
                "Warning: Email configuration incomplete. Notifications may not work"
            );
        }

        // Validate WhatsApp configuration
        if (this.config.whatsapp.enabled && !this.config.whatsapp.apiKey) {
            console.warn("Warning: WhatsApp is enabled but API key is missing");
        }

        // Environment-specific validations
        if (this.env === "production") {
            this.validateProductionConfig();
        }
    }

    validateProductionConfig() {
        const productionRequirements = ["SESSION_SECRET"];

        const missing = productionRequirements.filter(
            (envVar) => !process.env[envVar]
        );

        if (missing.length > 0) {
            console.warn(
                `Warning: Missing recommended production environment variables: ${missing.join(
                    ", "
                )}`
            );
        }

        // Security warnings for production
        if (this.config.development.enableDebug) {
            console.warn("Warning: Debug mode is enabled in production");
        }

        if (!this.config.database.ssl && this.env === "production") {
            console.warn("Warning: Database SSL is disabled in production");
        }
    }

    get(path) {
        return path.split(".").reduce((obj, key) => obj?.[key], this.config);
    }

    set(path, value) {
        const keys = path.split(".");
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => {
            if (!obj[key]) obj[key] = {};
            return obj[key];
        }, this.config);
        target[lastKey] = value;
    }

    isDevelopment() {
        return this.env === "development";
    }

    isProduction() {
        return this.env === "production";
    }

    isTesting() {
        return this.env === "test";
    }

    getAll() {
        return { ...this.config };
    }

    // Dynamic configuration updates (for runtime changes)
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    // Configuration health check
    healthCheck() {
        const issues = [];

        // Check database connection
        if (!this.config.database.url) {
            issues.push("Database URL not configured");
        }

        // Check JWT configuration
        if (!this.config.jwt.secret) {
            issues.push("JWT secret not configured");
        }

        // Check email configuration
        if (!this.config.email.user || !this.config.email.password) {
            issues.push("Email configuration incomplete");
        }

        // Check WhatsApp configuration if enabled
        if (this.config.whatsapp.enabled && !this.config.whatsapp.apiKey) {
            issues.push("WhatsApp enabled but API key missing");
        }

        return {
            healthy: issues.length === 0,
            issues: issues,
            environment: this.env,
            timestamp: new Date(),
        };
    }

    // Export configuration for external tools
    exportConfig(includeSecrets = false) {
        const config = { ...this.config };

        if (!includeSecrets) {
            // Remove sensitive information
            delete config.jwt.secret;
            delete config.email.password;
            delete config.whatsapp.apiKey;
            delete config.security.sessionSecret;
            delete config.database.url;
        }

        return config;
    }
}

// Create singleton instance
const configManager = new ConfigManager();

// Configuration middleware for Express
const configMiddleware = (req, res, next) => {
    req.config = configManager;
    next();
};

// Environment-specific configurations
const environments = {
    development: {
        logging: { level: "debug" },
        security: { rateLimitMax: 1000 },
        development: { enableDebug: true },
    },

    production: {
        logging: { level: "warn" },
        security: { rateLimitMax: 100 },
        development: { enableDebug: false },
        production: { enableCompression: true },
    },

    test: {
        logging: { level: "silent" },
        database: { logQueries: false },
        development: { mockNotifications: true },
    },
};

// Apply environment-specific overrides
if (environments[configManager.env]) {
    configManager.updateConfig(environments[configManager.env]);
}

module.exports = {
    config: configManager.config,
    configManager,
    configMiddleware,
};

class AppError extends Error {
    constructor(message, statusCode, code = null, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, details = null) {
        super(message, 400, "VALIDATION_ERROR", details);
    }
}

class NotFoundError extends AppError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, 404, "NOT_FOUND");
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized access") {
        super(message, 401, "UNAUTHORIZED");
    }
}

class ForbiddenError extends AppError {
    constructor(message = "Access forbidden") {
        super(message, 403, "FORBIDDEN");
    }
}

class ConflictError extends AppError {
    constructor(message, details = null) {
        super(message, 409, "CONFLICT", details);
    }
}

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error("Error Stack:", err.stack);

    // Prisma errors
    if (err.code === "P2002") {
        error = new ConflictError("Duplicate entry found", {
            field: err.meta?.target,
            constraint: "unique_constraint",
        });
    } else if (err.code === "P2025") {
        error = new NotFoundError("Record");
    } else if (err.code === "P2003") {
        error = new ValidationError("Foreign key constraint failed", {
            field: err.meta?.field_name,
        });
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        error = new UnauthorizedError("Invalid token");
    } else if (err.name === "TokenExpiredError") {
        error = new UnauthorizedError("Token expired");
    }

    // Validation errors
    if (err.name === "ValidationError") {
        const details = Object.values(err.errors).map((val) => ({
            field: val.path,
            message: val.message,
        }));
        error = new ValidationError("Validation failed", details);
    }

    // Default to 500 server error
    if (!error.isOperational) {
        error = new AppError(
            "Something went wrong",
            500,
            "INTERNAL_SERVER_ERROR"
        );
    }

    res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
        ...(error.details && { details: error.details }),
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
    });
};

// Async error catcher wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Response utilities
class ResponseUtil {
    static success(res, data, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }

    static successWithPagination(
        res,
        data,
        pagination,
        message = "Data retrieved successfully"
    ) {
        return res.status(200).json({
            success: true,
            message,
            data,
            pagination,
            timestamp: new Date().toISOString(),
        });
    }

    static created(res, data, message = "Resource created successfully") {
        return this.success(res, data, message, 201);
    }

    static updated(res, data, message = "Resource updated successfully") {
        return this.success(res, data, message, 200);
    }

    static deleted(res, message = "Resource deleted successfully") {
        return res.status(200).json({
            success: true,
            message,
            timestamp: new Date().toISOString(),
        });
    }

    static noContent(res) {
        return res.status(204).send();
    }

    static error(res, message, statusCode = 500, code = null, details = null) {
        return res.status(statusCode).json({
            success: false,
            message,
            code,
            ...(details && { details }),
            timestamp: new Date().toISOString(),
        });
    }

    static validationError(res, errors) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            details: Array.isArray(errors) ? errors : [errors],
            timestamp: new Date().toISOString(),
        });
    }

    static unauthorized(res, message = "Unauthorized access") {
        return res.status(401).json({
            success: false,
            message,
            code: "UNAUTHORIZED",
            timestamp: new Date().toISOString(),
        });
    }

    static forbidden(res, message = "Access forbidden") {
        return res.status(403).json({
            success: false,
            message,
            code: "FORBIDDEN",
            timestamp: new Date().toISOString(),
        });
    }

    static notFound(res, resource = "Resource") {
        return res.status(404).json({
            success: false,
            message: `${resource} not found`,
            code: "NOT_FOUND",
            timestamp: new Date().toISOString(),
        });
    }

    static conflict(res, message, details = null) {
        return res.status(409).json({
            success: false,
            message,
            code: "CONFLICT",
            ...(details && { details }),
            timestamp: new Date().toISOString(),
        });
    }
}

// Request validation middleware
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            const validatedData = await schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            req.validatedData = validatedData;
            next();
        } catch (error) {
            const validationErrors = error.inner?.map((err) => ({
                field: err.path,
                message: err.message,
                value: err.value,
            })) || [{ message: error.message }];

            return ResponseUtil.validationError(res, validationErrors);
        }
    };
};

// Input sanitization
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        for (let key in obj) {
            if (typeof obj[key] === "string") {
                // Remove potentially dangerous characters
                obj[key] = obj[key]
                    .replace(
                        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                        ""
                    )
                    .replace(/javascript:/gi, "")
                    .replace(/on\w+\s*=/gi, "");
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
};

// Rate limiting for specific endpoints
const createRateLimit = (
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = "Too many requests"
) => {
    const requests = new Map();

    return (req, res, next) => {
        const key = req.ip || req.connection.remoteAddress || "unknown";
        const now = Date.now();
        const windowStart = now - windowMs;

        // Clean up old requests
        if (requests.has(key)) {
            const userRequests = requests
                .get(key)
                .filter((time) => time > windowStart);
            requests.set(key, userRequests);
        }

        const currentRequests = requests.get(key) || [];

        if (currentRequests.length >= max) {
            return ResponseUtil.error(
                res,
                message,
                429,
                "RATE_LIMIT_EXCEEDED",
                {
                    limit: max,
                    windowMs,
                    retryAfter: Math.ceil(
                        (currentRequests[0] + windowMs - now) / 1000
                    ),
                }
            );
        }

        currentRequests.push(now);
        requests.set(key, currentRequests);
        next();
    };
};

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ConflictError,
    globalErrorHandler,
    asyncHandler,
    ResponseUtil,
    validateRequest,
    sanitizeInput,
    createRateLimit,
};

const yup = require("yup");

// Create Kanban Request Schema
const createKanbanSchema = yup.object({
    tgl_produksi: yup
        .string()
        .required("Production date is required")
        .test("is-valid-date", "Invalid date format", function (value) {
            if (!value) return false;
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
        .test(
            "not-past",
            "Production date cannot be in the past",
            function (value) {
                if (!value) return true;
                const date = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date >= today;
            }
        )
        .test(
            "not-too-future",
            "Production date cannot be more than 1 year in the future",
            function (value) {
                if (!value) return true;
                const date = new Date(value);
                const maxDate = new Date();
                maxDate.setFullYear(maxDate.getFullYear() + 1);
                return date <= maxDate;
            }
        ),

    nama_requester: yup
        .string()
        .required("Requester name is required")
        .min(2, "Requester name must be at least 2 characters")
        .max(100, "Requester name cannot exceed 100 characters")
        .matches(
            /^[a-zA-Z\s.-]+$/,
            "Requester name can only contain letters, spaces, dots, and hyphens"
        ),

    parts_number: yup
        .string()
        .required("Parts number is required")
        .min(3, "Parts number must be at least 3 characters")
        .max(50, "Parts number cannot exceed 50 characters")
        .matches(
            /^[A-Z0-9-_]+$/i,
            "Parts number can only contain letters, numbers, hyphens, and underscores"
        ),

    lokasi: yup
        .string()
        .required("Location is required")
        .min(2, "Location must be at least 2 characters")
        .max(100, "Location cannot exceed 100 characters"),

    box: yup.string().max(50, "Box cannot exceed 50 characters").default(""),

    klasifikasi: yup
        .string()
        .max(50, "Classification cannot exceed 50 characters")
        .default("NORMAL"),

    keterangan: yup
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .default(""),
});

// Update Kanban Request Schema (more flexible than create)
const updateKanbanSchema = yup
    .object({
        tgl_produksi: yup
            .string()
            .nullable()
            .test("is-valid-date", "Invalid date format", function (value) {
                if (!value) return true;
                const date = new Date(value);
                return !isNaN(date.getTime());
            })
            .test(
                "not-past",
                "Production date cannot be in the past",
                function (value) {
                    if (!value) return true;
                    const date = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date >= today;
                }
            ),

        nama_requester: yup
            .string()
            .nullable()
            .min(2, "Requester name must be at least 2 characters")
            .max(100, "Requester name cannot exceed 100 characters")
            .matches(
                /^[a-zA-Z\s.-]*$/,
                "Requester name can only contain letters, spaces, dots, and hyphens"
            ),

        parts_number: yup
            .string()
            .nullable()
            .min(3, "Parts number must be at least 3 characters")
            .max(50, "Parts number cannot exceed 50 characters")
            .matches(
                /^[A-Z0-9-_]*$/i,
                "Parts number can only contain letters, numbers, hyphens, and underscores"
            ),

        lokasi: yup
            .string()
            .nullable()
            .min(2, "Location must be at least 2 characters")
            .max(100, "Location cannot exceed 100 characters"),

        box: yup.string().nullable().max(50, "Box cannot exceed 50 characters"),

        klasifikasi: yup
            .string()
            .nullable()
            .max(50, "Classification cannot exceed 50 characters"),

        keterangan: yup
            .string()
            .nullable()
            .max(500, "Description cannot exceed 500 characters"),
    })
    .noUnknown(false); // Changed to false to be more permissive

// Approve Kanban Schema
const approveKanbanSchema = yup.object({
    id_kanban: yup
        .mixed()
        .required("Kanban ID is required")
        .test(
            "is-positive-number",
            "Kanban ID must be a positive number",
            function (value) {
                const num = Number(value);
                return !isNaN(num) && num > 0 && Number.isInteger(num);
            }
        ),
});

// Reject Kanban Schema
const rejectKanbanSchema = yup.object({
    id_kanban: yup
        .mixed()
        .required("Kanban ID is required")
        .test(
            "is-positive-number",
            "Kanban ID must be a positive number",
            function (value) {
                const num = Number(value);
                return !isNaN(num) && num > 0 && Number.isInteger(num);
            }
        ),

    alasan: yup
        .string()
        .required("Rejection reason is required")
        .min(1, "Rejection reason must be at least 1 characters")
        .max(500, "Rejection reason cannot exceed 500 characters"),
});

// Query Parameters Schema
const queryParamsSchema = yup.object({
    page: yup
        .mixed()
        .transform((value) => {
            if (value === "" || value === undefined) return 1;
            return Number(value);
        })
        .test(
            "is-positive-number",
            "Page must be a positive number",
            function (value) {
                return !isNaN(value) && value > 0 && Number.isInteger(value);
            }
        )
        .default(1),

    limit: yup
        .mixed()
        .transform((value) => {
            if (value === "" || value === undefined) return 10;
            return Number(value);
        })
        .test(
            "is-positive-number",
            "Limit must be a positive number",
            function (value) {
                return (
                    !isNaN(value) &&
                    value > 0 &&
                    Number.isInteger(value) &&
                    value <= 100
                );
            }
        )
        .default(10),

    search: yup
        .string()
        .max(100, "Search term cannot exceed 100 characters")
        .matches(
            /^[a-zA-Z0-9\s.-]*$/,
            "Search term contains invalid characters"
        )
        .default(""),

    sortBy: yup
        .string()
        .oneOf(
            [
                "id_kanban",
                "tgl_produksi",
                "created_at",
                "nama_requester",
                "status",
                "",
            ],
            "Invalid sort field"
        )
        .default("id_kanban"),

    sortOrder: yup
        .string()
        .oneOf(["asc", "desc", ""], "Sort order must be asc or desc")
        .default("desc"),

    status: yup
        .string()
        .oneOf(
            [
                "PENDING_APPROVAL",
                "APPROVED_BY_DEPARTMENT",
                "PENDING_PC",
                "APPROVED_BY_PC",
                "REJECTED_BY_DEPARTMENT",
                "REJECTED_BY_PC",
                "",
            ],
            "Invalid status filter"
        )
        .default(""),

    role: yup
        .string()
        .oneOf(
            ["LEADER", "SUPERVISOR", "MANAGER", "STAFF", ""],
            "Invalid role filter"
        )
        .default(""),

    dateFrom: yup
        .string()
        .nullable()
        .test("is-valid-date", "Invalid date format", function (value) {
            if (!value) return true;
            const date = new Date(value);
            return !isNaN(date.getTime());
        }),

    dateTo: yup
        .string()
        .nullable()
        .test("is-valid-date", "Invalid date format", function (value) {
            if (!value) return true;
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
        .test(
            "after-from-date",
            "Date to must be after date from",
            function (value) {
                if (!value || !this.parent.dateFrom) return true;
                const dateTo = new Date(value);
                const dateFrom = new Date(this.parent.dateFrom);
                return dateTo >= dateFrom;
            }
        ),
});

// Bulk Operations Schema
const bulkOperationSchema = yup.object({
    kanban_ids: yup
        .array()
        .of(
            yup
                .mixed()
                .test(
                    "is-positive-number",
                    "Invalid kanban ID",
                    function (value) {
                        const num = Number(value);
                        return !isNaN(num) && num > 0 && Number.isInteger(num);
                    }
                )
        )
        .required("Kanban IDs are required")
        .min(1, "At least one Kanban ID is required")
        .max(50, "Cannot process more than 50 items at once"),

    action: yup
        .string()
        .required("Action is required")
        .oneOf(["approve", "reject", "update_status"], "Invalid bulk action"),

    reason: yup.string().when("action", {
        is: "reject",
        then: (schema) =>
            schema
                .required("Reason is required for rejection")
                .min(1, "Reason must be at least 1 characters")
                .max(500, "Reason cannot exceed 500 characters"),
        otherwise: (schema) => schema.nullable(),
    }),

    new_status: yup.string().when("action", {
        is: "update_status",
        then: (schema) =>
            schema
                .required("New status is required")
                .oneOf(
                    [
                        "PENDING_APPROVAL",
                        "APPROVED_BY_DEPARTMENT",
                        "PENDING_PC",
                        "APPROVED_BY_PC",
                        "REJECTED_BY_DEPARTMENT",
                        "REJECTED_BY_PC",
                    ],
                    "Invalid status"
                ),
        otherwise: (schema) => schema.nullable(),
    }),
});

// Path Parameters Schema
const pathParamsSchema = yup.object({
    id_kanban: yup
        .mixed()
        .required("Kanban ID is required")
        .test(
            "is-positive-number",
            "Kanban ID must be a positive number",
            function (value) {
                const num = Number(value);
                return !isNaN(num) && num > 0 && Number.isInteger(num);
            }
        ),
});

// Validation middleware factory
const createValidationMiddleware = (schema, source = "body") => {
    return async (req, res, next) => {
        try {
            let dataToValidate;

            switch (source) {
                case "body":
                    dataToValidate = req.body || {};
                    break;
                case "query":
                    dataToValidate = req.query || {};
                    break;
                case "params":
                    dataToValidate = req.params || {};
                    break;
                default:
                    dataToValidate = req.body || {};
            }

            // Log for debugging
            console.log(`Validating ${source}:`, dataToValidate);

            const validatedData = await schema.validate(dataToValidate, {
                abortEarly: false,
                stripUnknown: true,
                context: req, // Pass request context for conditional validation
            });

            // Store validated data back to request
            if (source === "body") {
                req.validatedBody = validatedData;
            } else if (source === "query") {
                req.validatedQuery = validatedData;
            } else if (source === "params") {
                req.validatedParams = validatedData;
            }

            next();
        } catch (error) {
            console.error("Validation error:", error);

            const validationErrors = error.inner?.map((err) => ({
                field: err.path,
                message: err.message,
                value: err.value,
            })) || [{ message: error.message }];

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                code: "VALIDATION_ERROR",
                details: validationErrors,
                timestamp: new Date().toISOString(),
                received_data: dataToValidate, // Add this for debugging
            });
        }
    };
};

// More permissive security validation middleware
const securityValidation = (req, res, next) => {
    // Check for suspicious patterns (made less strict)
    const suspiciousPatterns = [
        /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
        /javascript:\s*[^;]+/gi,
        /on(load|error|click|mouseover)\s*=/gi,
        /eval\s*\([^)]*\)/gi,
        /expression\s*\([^)]*\)/gi,
        /vbscript:\s*[^;]+/gi,
        /data:text\/html[^;]*;/gi,
    ];

    const checkForSuspiciousContent = (obj, path = "") => {
        for (const key in obj) {
            const currentPath = path ? `${path}.${key}` : key;
            const value = obj[key];

            if (typeof value === "string") {
                for (const pattern of suspiciousPatterns) {
                    if (pattern.test(value)) {
                        throw new Error(
                            `Suspicious content detected in ${currentPath}`
                        );
                    }
                }

                // More lenient SQL injection check
                if (value.length > 100) {
                    // Only check long strings
                    const sqlPatterns = [
                        /(\bunion\s+select\b|\bselect\s+.*\bfrom\b|\binsert\s+into\b|\bupdate\s+.*\bset\b|\bdelete\s+from\b|\bdrop\s+table\b)/gi,
                    ];

                    for (const pattern of sqlPatterns) {
                        if (pattern.test(value)) {
                            throw new Error(
                                `Potential SQL injection detected in ${currentPath}`
                            );
                        }
                    }
                }
            } else if (
                typeof value === "object" &&
                value !== null &&
                !Array.isArray(value)
            ) {
                checkForSuspiciousContent(value, currentPath);
            }
        }
    };

    try {
        if (req.body && Object.keys(req.body).length > 0) {
            checkForSuspiciousContent(req.body, "body");
        }
        if (req.query && Object.keys(req.query).length > 0) {
            checkForSuspiciousContent(req.query, "query");
        }
        if (req.params && Object.keys(req.params).length > 0) {
            checkForSuspiciousContent(req.params, "params");
        }

        next();
    } catch (error) {
        console.error("Security validation error:", error);
        return res.status(400).json({
            success: false,
            message: "Security validation failed",
            code: "SECURITY_VIOLATION",
            details: error.message,
            timestamp: new Date().toISOString(),
        });
    }
};

// File upload validation (if needed for attachments)
const fileUploadValidation = {
    allowedTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "application/pdf",
        "text/plain",
    ],
    maxSize: 5 * 1024 * 1024, // 5MB

    validate: (req, res, next) => {
        if (!req.files || Object.keys(req.files).length === 0) {
            return next();
        }

        try {
            const files = Array.isArray(req.files.attachment)
                ? req.files.attachment
                : [req.files.attachment];

            for (const file of files) {
                // Check file type
                if (
                    !fileUploadValidation.allowedTypes.includes(file.mimetype)
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid file type",
                        code: "INVALID_FILE_TYPE",
                        details: {
                            allowed_types: fileUploadValidation.allowedTypes,
                            received_type: file.mimetype,
                        },
                        timestamp: new Date().toISOString(),
                    });
                }

                // Check file size
                if (file.size > fileUploadValidation.maxSize) {
                    return res.status(400).json({
                        success: false,
                        message: "File size too large",
                        code: "FILE_TOO_LARGE",
                        details: {
                            max_size: fileUploadValidation.maxSize,
                            file_size: file.size,
                        },
                        timestamp: new Date().toISOString(),
                    });
                }

                // Check filename for suspicious content
                const suspiciousExtensions = [
                    ".exe",
                    ".bat",
                    ".cmd",
                    ".scr",
                    ".vbs",
                    ".js",
                    ".jar",
                ];
                const fileExtension = file.name
                    .toLowerCase()
                    .substring(file.name.lastIndexOf("."));

                if (suspiciousExtensions.includes(fileExtension)) {
                    return res.status(400).json({
                        success: false,
                        message: "Suspicious file extension",
                        code: "SUSPICIOUS_FILE",
                        details: {
                            filename: file.name,
                            extension: fileExtension,
                        },
                        timestamp: new Date().toISOString(),
                    });
                }
            }

            next();
        } catch (error) {
            console.error("File validation error:", error);
            return res.status(400).json({
                success: false,
                message: "File validation failed",
                code: "FILE_VALIDATION_ERROR",
                details: error.message,
                timestamp: new Date().toISOString(),
            });
        }
    },
};

module.exports = {
    // Schemas
    createKanbanSchema,
    updateKanbanSchema,
    approveKanbanSchema,
    rejectKanbanSchema,
    queryParamsSchema,
    bulkOperationSchema,
    pathParamsSchema,

    // Middleware factory
    createValidationMiddleware,

    // Security middleware
    securityValidation,
    fileUploadValidation,

    // Pre-configured validation middleware
    validateCreateKanban: createValidationMiddleware(
        createKanbanSchema,
        "body"
    ),
    validateUpdateKanban: createValidationMiddleware(
        updateKanbanSchema,
        "body"
    ),
    validateApproveKanban: createValidationMiddleware(
        approveKanbanSchema,
        "body"
    ),
    validateRejectKanban: createValidationMiddleware(
        rejectKanbanSchema,
        "body"
    ),
    validateQueryParams: createValidationMiddleware(queryParamsSchema, "query"),
    validatePathParams: createValidationMiddleware(pathParamsSchema, "params"),
    validateBulkOperation: createValidationMiddleware(
        bulkOperationSchema,
        "body"
    ),
};

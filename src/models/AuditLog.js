const prisma = require("../../prisma/client");

class AuditLog {
    /**
     * Find all audit logs with basic filtering and pagination
     */
    static async findAll(options = {}) {
        const {
            page = 1,
            limit = 20,
            sortBy = "created_at",
            sortOrder = "desc",
            where = {},
        } = options;

        const skip = (page - 1) * limit;

        // Build orderBy clause
        const orderBy = {};
        orderBy[sortBy] = sortOrder;

        const [data, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                skip,
                take: parseInt(limit),
                include: {
                    user: {
                        select: {
                            id_users: true,
                            name: true,
                            email: true,
                            role: true,
                            department: {
                                select: {
                                    id_department: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy,
            }),
            prisma.auditLog.count({ where }),
        ]);

        return {
            data,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1,
        };
    }

    /**
     * Find audit log by ID
     */
    static async findById(id) {
        return await prisma.auditLog.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                user: {
                    select: {
                        id_users: true,
                        name: true,
                        email: true,
                        role: true,
                        department: {
                            select: {
                                id_department: true,
                                name: true,
                            },
                        },
                    },
                },
            },
        });
    }

    /**
     * Find audit logs by user ID
     */
    static async findByUserId(userId, options = {}) {
        const {
            page = 1,
            limit = 20,
            action = null,
            startDate = null,
            endDate = null,
        } = options;

        const where = {
            user_id: parseInt(userId),
        };

        if (action) {
            where.action = {
                contains: action,
                mode: "insensitive",
            };
        }

        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) where.created_at.gte = new Date(startDate);
            if (endDate) where.created_at.lte = new Date(endDate);
        }

        return await this.findAll({
            page,
            limit,
            where,
            sortBy: "created_at",
            sortOrder: "desc",
        });
    }

    /**
     * Find audit logs by table name
     */
    static async findByTable(tableName, options = {}) {
        const {
            page = 1,
            limit = 20,
            recordId = null,
            startDate = null,
            endDate = null,
        } = options;

        const where = {
            table_name: tableName,
        };

        if (recordId) {
            where.record_id = parseInt(recordId);
        }

        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) where.created_at.gte = new Date(startDate);
            if (endDate) where.created_at.lte = new Date(endDate);
        }

        return await this.findAll({
            page,
            limit,
            where,
            sortBy: "created_at",
            sortOrder: "desc",
        });
    }

    /**
     * Get audit trail for specific record
     */
    static async getRecordAuditTrail(tableName, recordId) {
        return await prisma.auditLog.findMany({
            where: {
                table_name: tableName,
                record_id: parseInt(recordId),
            },
            include: {
                user: {
                    select: {
                        id_users: true,
                        name: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                created_at: "asc",
            },
        });
    }

    /**
     * Create new audit log entry
     */
    static async create(logData) {
        return await prisma.auditLog.create({
            data: {
                user_id: logData.user_id || null,
                action: logData.action,
                table_name: logData.table_name || null,
                record_id: logData.record_id || null,
                old_values: logData.old_values || null,
                new_values: logData.new_values || null,
                ip_address: logData.ip_address || null,
                user_agent: logData.user_agent || null,
            },
        });
    }

    /**
     * Get count of audit logs with optional filters
     */
    static async count(where = {}) {
        return await prisma.auditLog.count({ where });
    }

    /**
     * Get recent audit logs
     */
    static async getRecent(limit = 10) {
        return await prisma.auditLog.findMany({
            take: parseInt(limit),
            include: {
                user: {
                    select: {
                        id_users: true,
                        name: true,
                        role: true,
                        department: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }

    /**
     * Get grouped statistics by action
     */
    static async getActionStatistics(where = {}) {
        return await prisma.auditLog.groupBy({
            by: ["action"],
            where,
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
        });
    }

    /**
     * Get grouped statistics by table
     */
    static async getTableStatistics(where = {}) {
        return await prisma.auditLog.groupBy({
            by: ["table_name"],
            where: {
                ...where,
                table_name: {
                    not: null,
                },
            },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
        });
    }

    /**
     * Get user activity statistics
     */
    static async getUserActivityStatistics(where = {}, limit = 10) {
        return await prisma.auditLog.groupBy({
            by: ["user_id"],
            where: {
                ...where,
                user_id: {
                    not: null,
                },
            },
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: limit,
        });
    }

    /**
     * Get distinct actions (for filter dropdowns)
     */
    static async getDistinctActions() {
        return await prisma.auditLog.findMany({
            select: {
                action: true,
            },
            distinct: ["action"],
            orderBy: {
                action: "asc",
            },
        });
    }

    /**
     * Get distinct table names (for filter dropdowns)
     */
    static async getDistinctTables() {
        return await prisma.auditLog.findMany({
            select: {
                table_name: true,
            },
            distinct: ["table_name"],
            where: {
                table_name: {
                    not: null,
                },
            },
            orderBy: {
                table_name: "asc",
            },
        });
    }

    /**
     * Search audit logs with text search
     */
    static async search(searchTerm, options = {}) {
        const { page = 1, limit = 20, additionalFilters = {} } = options;

        const where = {
            OR: [
                {
                    action: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    table_name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
            ...additionalFilters,
        };

        return await this.findAll({
            page,
            limit,
            where,
            sortBy: "created_at",
            sortOrder: "desc",
        });
    }

    /**
     * Get audit logs for export (without pagination)
     */
    static async findForExport(where = {}) {
        return await prisma.auditLog.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                        department: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }

    /**
     * Delete old audit logs (for cleanup)
     * Note: This should be used carefully and only for maintenance
     */
    static async deleteOlderThan(date) {
        return await prisma.auditLog.deleteMany({
            where: {
                created_at: {
                    lt: date,
                },
            },
        });
    }

    /**
     * Get logs count by date range for analytics
     */
    static async getLogsCountByDateRange(startDate, endDate) {
        return await prisma.auditLog.findMany({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                created_at: true,
                action: true,
            },
        });
    }

    /**
     * Check if audit log exists
     */
    static async exists(id) {
        const auditLog = await this.findById(id);
        return !!auditLog;
    }

    /**
     * Get audit logs with complex filtering
     */
    static async findWithFilters(filters = {}) {
        const {
            userId,
            action,
            tableName,
            startDate,
            endDate,
            ipAddress,
            search,
            page = 1,
            limit = 20,
        } = filters;

        const where = {};

        // Build where clause based on filters
        if (userId) where.user_id = parseInt(userId);
        if (action) {
            where.action = {
                contains: action,
                mode: "insensitive",
            };
        }
        if (tableName) {
            where.table_name = {
                contains: tableName,
                mode: "insensitive",
            };
        }
        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) where.created_at.gte = new Date(startDate);
            if (endDate) where.created_at.lte = new Date(endDate);
        }
        if (ipAddress) {
            where.ip_address = {
                contains: ipAddress,
                mode: "insensitive",
            };
        }
        if (search) {
            where.OR = [
                {
                    action: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    table_name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }

        return await this.findAll({
            page,
            limit,
            where,
            sortBy: "created_at",
            sortOrder: "desc",
        });
    }
}

module.exports = AuditLog;

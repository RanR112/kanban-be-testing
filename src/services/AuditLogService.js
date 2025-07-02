const AuditLog = require("../models/AuditLog");
const { format } = require("date-fns");

class AuditLogService {
    /**
     * Get all audit logs with advanced filtering and pagination
     */
    static async findAll(options = {}) {
        const {
            page = 1,
            limit = 20,
            search = "",
            sortBy = "created_at",
            sortOrder = "desc",
            userId = null,
            action = null,
            tableName = null,
            startDate = null,
            endDate = null,
            ipAddress = null,
        } = options;

        // Use the model's findWithFilters method for complex filtering
        const result = await AuditLog.findWithFilters({
            userId,
            action,
            tableName,
            startDate,
            endDate,
            ipAddress,
            search: search.trim(),
            page,
            limit,
        });

        // Format the data for better presentation
        const formattedData = result.data.map((log) =>
            this.formatAuditLog(log)
        );

        return {
            data: formattedData,
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
        };
    }

    /**
     * Get audit log by ID with detailed information
     */
    static async findById(id) {
        const log = await AuditLog.findById(id);

        if (!log) {
            return null;
        }

        return this.formatDetailedAuditLog(log);
    }

    /**
     * Get audit logs for a specific user
     */
    static async findByUserId(userId, options = {}) {
        const result = await AuditLog.findByUserId(userId, options);

        return {
            ...result,
            data: result.data.map((log) => this.formatAuditLog(log)),
        };
    }

    /**
     * Get audit logs for a specific table
     */
    static async findByTable(tableName, options = {}) {
        const result = await AuditLog.findByTable(tableName, options);

        return {
            ...result,
            data: result.data.map((log) => this.formatAuditLog(log)),
        };
    }

    /**
     * Get audit trail for a specific record
     */
    static async getRecordAuditTrail(tableName, recordId) {
        const logs = await AuditLog.getRecordAuditTrail(tableName, recordId);

        return logs.map((log, index) => ({
            id: log.id,
            sequence: index + 1,
            action: log.action,
            user: log.user
                ? {
                      id: log.user.id_users,
                      name: log.user.name,
                      role: log.user.role,
                  }
                : {
                      id: log.user_id,
                      name: "System/Deleted User",
                      role: "N/A",
                  },
            changes: {
                old_values: log.old_values,
                new_values: log.new_values,
            },
            metadata: {
                ip_address: log.ip_address,
                created_at: log.created_at,
                formatted_date: format(log.created_at, "dd/MM/yyyy HH:mm:ss"),
            },
            context: this.getActionContext(log.action, tableName),
        }));
    }

    /**
     * Get audit log statistics
     */
    static async getStatistics(options = {}) {
        const { startDate = null, endDate = null } = options;

        const where = {};
        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) where.created_at.gte = new Date(startDate);
            if (endDate) where.created_at.lte = new Date(endDate);
        }

        // Get statistics using model methods
        const [actionCounts, tableCounts, userCounts, totalLogs] =
            await Promise.all([
                AuditLog.getActionStatistics(where),
                AuditLog.getTableStatistics(where),
                AuditLog.getUserActivityStatistics(where, 10),
                AuditLog.count(where),
            ]);

        // Get user names for top active users
        const userIds = userCounts.map((u) => u.user_id);
        const users = await this.getUserDetailsForStats(userIds);

        const userMap = users.reduce((map, user) => {
            map[user.id_users] = user;
            return map;
        }, {});

        const topActiveUsers = userCounts.map((userCount) => ({
            user_id: userCount.user_id,
            count: userCount._count.id,
            user: userMap[userCount.user_id] || {
                name: "Deleted User",
                role: "N/A",
                department: { name: "N/A" },
            },
        }));

        // Get daily activity for last 30 days
        const dailyActivity = await this.getDailyActivity();

        return {
            total: totalLogs,
            byAction: actionCounts.map((item) => ({
                action: item.action,
                count: item._count.id,
            })),
            byTable: tableCounts.map((item) => ({
                table_name: item.table_name,
                count: item._count.id,
            })),
            topActiveUsers,
            dailyActivity,
            summary: {
                totalActions: actionCounts.length,
                totalTables: tableCounts.length,
                totalActiveUsers: userCounts.length,
                averageLogsPerDay: Math.round(
                    dailyActivity.reduce((sum, day) => sum + day.count, 0) / 30
                ),
            },
        };
    }

    /**
     * Get recent activity (last N logs)
     */
    static async getRecentActivity(limit = 10) {
        const logs = await AuditLog.getRecent(limit);

        return logs.map((log) => ({
            id: log.id,
            action: log.action,
            table_name: log.table_name,
            user: log.user
                ? {
                      name: log.user.name,
                      role: log.user.role,
                  }
                : { name: "System/Deleted User", role: "N/A" },
            created_at: log.created_at,
            formatted_date: format(log.created_at, "dd/MM/yyyy HH:mm"),
            context: this.getActionContext(log.action, log.table_name),
        }));
    }

    /**
     * Export audit logs to CSV format
     */
    static async exportToCsv(options = {}) {
        const { startDate, endDate, userId, action } = options;

        const where = {};
        if (userId) where.user_id = parseInt(userId);
        if (action) where.action = action;
        if (startDate || endDate) {
            where.created_at = {};
            if (startDate) where.created_at.gte = new Date(startDate);
            if (endDate) where.created_at.lte = new Date(endDate);
        }

        const logs = await AuditLog.findForExport(where);

        // Convert to CSV format
        const csvHeaders = [
            "ID",
            "Action",
            "Table",
            "Record ID",
            "User Name",
            "User Email",
            "User Role",
            "Department",
            "IP Address",
            "Date",
            "Old Values",
            "New Values",
        ];

        const csvData = logs.map((log) => [
            log.id,
            log.action,
            log.table_name || "",
            log.record_id || "",
            log.user?.name || "Deleted User",
            log.user?.email || "N/A",
            log.user?.role || "N/A",
            log.user?.department?.name || "N/A",
            log.ip_address || "",
            format(log.created_at, "dd/MM/yyyy HH:mm:ss"),
            log.old_values ? JSON.stringify(log.old_values) : "",
            log.new_values ? JSON.stringify(log.new_values) : "",
        ]);

        return {
            headers: csvHeaders,
            data: csvData,
            filename: `audit_logs_${format(
                new Date(),
                "yyyy_MM_dd_HH_mm"
            )}.csv`,
            totalRecords: logs.length,
        };
    }

    /**
     * Get available actions for filtering
     */
    static async getAvailableActions() {
        const actions = await AuditLog.getDistinctActions();

        return actions.map((item) => ({
            value: item.action,
            label: item.action
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase()),
            context: this.getActionContext(item.action, null),
        }));
    }

    /**
     * Get available table names for filtering
     */
    static async getAvailableTables() {
        const tables = await AuditLog.getDistinctTables();

        return tables.map((item) => ({
            value: item.table_name,
            label: item.table_name
                .replace(/_/g, " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase()),
        }));
    }

    /**
     * Create audit log entry (wrapper for model method)
     */
    static async createAuditLog(logData) {
        return await AuditLog.create(logData);
    }

    // ======================
    // PRIVATE HELPER METHODS
    // ======================

    /**
     * Format audit log for display
     */
    static formatAuditLog(log) {
        return {
            id: log.id,
            action: log.action,
            table_name: log.table_name,
            record_id: log.record_id,
            user: log.user
                ? {
                      id: log.user.id_users,
                      name: log.user.name,
                      email: log.user.email,
                      role: log.user.role,
                      department: log.user.department?.name || "Unknown",
                  }
                : {
                      id: log.user_id,
                      name: "Deleted User",
                      email: "N/A",
                      role: "N/A",
                      department: "N/A",
                  },
            changes: {
                old_values: log.old_values,
                new_values: log.new_values,
            },
            metadata: {
                ip_address: log.ip_address,
                user_agent: log.user_agent,
                created_at: log.created_at,
                formatted_date: format(log.created_at, "dd/MM/yyyy HH:mm:ss"),
            },
        };
    }

    /**
     * Format detailed audit log for single record view
     */
    static formatDetailedAuditLog(log) {
        return {
            id: log.id,
            action: log.action,
            table_name: log.table_name,
            record_id: log.record_id,
            user: log.user
                ? {
                      id: log.user.id_users,
                      name: log.user.name,
                      email: log.user.email,
                      role: log.user.role,
                      department: log.user.department?.name || "Unknown",
                      department_id: log.user.department?.id_department,
                  }
                : {
                      id: log.user_id,
                      name: "Deleted User",
                      email: "N/A",
                      role: "N/A",
                      department: "N/A",
                      department_id: null,
                  },
            changes: {
                old_values: log.old_values,
                new_values: log.new_values,
                has_changes: !!(log.old_values || log.new_values),
            },
            metadata: {
                ip_address: log.ip_address,
                user_agent: log.user_agent,
                created_at: log.created_at,
                formatted_date: format(log.created_at, "dd/MM/yyyy HH:mm:ss"),
                formatted_time: format(log.created_at, "HH:mm:ss"),
                formatted_date_only: format(log.created_at, "dd/MM/yyyy"),
            },
            context: this.getActionContext(log.action, log.table_name),
        };
    }

    /**
     * Get user details for statistics
     */
    static async getUserDetailsForStats(userIds) {
        const prisma = require("../../prisma/client");

        return await prisma.user.findMany({
            where: {
                id_users: {
                    in: userIds,
                },
            },
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
        });
    }

    /**
     * Get daily activity for the last 30 days
     */
    static async getDailyActivity() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const logs = await AuditLog.getLogsCountByDateRange(
            thirtyDaysAgo,
            new Date()
        );

        // Group by date
        const dailyCount = logs.reduce((acc, log) => {
            const date = format(log.created_at, "yyyy-MM-dd");
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(dailyCount).map(([date, count]) => ({
            date,
            count,
        }));
    }

    /**
     * Get action context for better display
     */
    static getActionContext(action, tableName) {
        const contexts = {
            LOGIN: {
                color: "green",
                icon: "login",
                description: "User logged in",
            },
            LOGOUT: {
                color: "gray",
                icon: "logout",
                description: "User logged out",
            },
            PASSWORD_CHANGED: {
                color: "yellow",
                icon: "key",
                description: "Password was changed",
            },
            PASSWORD_RESET: {
                color: "orange",
                icon: "refresh",
                description: "Password was reset",
            },
            EMAIL_VERIFIED: {
                color: "blue",
                icon: "mail",
                description: "Email was verified",
            },
            USER_CREATED: {
                color: "green",
                icon: "user-plus",
                description: "New user was created",
            },
            USER_UPDATED: {
                color: "blue",
                icon: "user-edit",
                description: "User information was updated",
            },
            USER_DELETED: {
                color: "red",
                icon: "user-minus",
                description: "User was deleted",
            },
            PROFILE_UPDATED: {
                color: "blue",
                icon: "edit",
                description: "Profile was updated",
            },
            SESSIONS_REVOKED: {
                color: "orange",
                icon: "shield",
                description: "User sessions were revoked",
            },
            BULK_USER_UPDATE: {
                color: "purple",
                icon: "users",
                description: "Multiple users were updated",
            },
            EMAIL_VERIFIED_BY_ADMIN: {
                color: "blue",
                icon: "shield-check",
                description: "Email verified by admin",
            },
            MONTHLY_PDF_REPORT_GENERATED: {
                color: "purple",
                icon: "file-pdf",
                description: "Monthly PDF report was generated",
            },
            MONTHLY_JSON_REPORT_ACCESSED: {
                color: "blue",
                icon: "file-json",
                description: "Monthly JSON report was accessed",
            },
            MONTHLY_EXCEL_REPORT_GENERATED: {
                color: "green",
                icon: "file-excel",
                description: "Monthly Excel report was generated",
            },
            CUSTOM_RANGE_REPORT_GENERATED: {
                color: "purple",
                icon: "calendar",
                description: "Custom date range report was generated",
            },
            DEPARTMENT_REPORT_GENERATED: {
                color: "blue",
                icon: "building",
                description: "Department report was generated",
            },
            APPROVAL_REPORT_GENERATED: {
                color: "green",
                icon: "check-circle",
                description: "Approval efficiency report was generated",
            },
            REQUESTER_REPORT_GENERATED: {
                color: "orange",
                icon: "users",
                description: "Requester activity report was generated",
            },
            CUSTOM_REPORT_EXPORTED: {
                color: "purple",
                icon: "download",
                description: "Custom report was exported",
            },
            REPORT_DASHBOARD_ACCESSED: {
                color: "blue",
                icon: "dashboard",
                description: "Report dashboard was accessed",
            },
        };

        return (
            contexts[action] || {
                color: "gray",
                icon: "activity",
                description: `${action} action performed${
                    tableName ? ` on ${tableName}` : ""
                }`,
            }
        );
    }
}

module.exports = AuditLogService;

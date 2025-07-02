const prisma = require("../../prisma/client");
const {
    validatePassword,
    hashPassword,
    comparePassword,
} = require("../utils/password");

class User {
    /**
     * Get all users with department and pagination
     */
    static async findAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            search = "",
            sortBy = "created_at",
            sortOrder = "desc",
            departmentId = null,
            role = null,
            emailVerified = null,
        } = options;

        const skip = (page - 1) * limit;

        // Build where clause
        const where = {};

        if (search) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }

        if (departmentId) {
            where.id_department = parseInt(departmentId);
        }

        if (role) {
            where.role = role;
        }

        if (emailVerified !== null) {
            where.email_verified = emailVerified;
        }

        // Build orderBy clause
        const orderBy = {};
        orderBy[sortBy] = sortOrder;

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: parseInt(limit),
                select: {
                    id_users: true,
                    name: true,
                    email: true,
                    role: true,
                    id_department: true,
                    email_verified: true,
                    no_hp: true,
                    last_login: true,
                    created_at: true,
                    updated_at: true,
                    department: {
                        select: {
                            id_department: true,
                            name: true,
                        },
                    },
                    registration: {
                        select: {
                            id_registration: true,
                            employee_id: true,
                            position: true,
                            division: true,
                            hire_date: true,
                            work_location: true,
                        },
                    },
                    _count: {
                        select: {
                            tokens: {
                                where: {
                                    type: "ACCESS_TOKEN",
                                    is_revoked: false,
                                    expires_at: {
                                        gte: new Date(),
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy,
            }),
            prisma.user.count({ where }),
        ]);

        return {
            data: data.map((user) => ({
                ...user,
                activeSessions: user._count.tokens,
            })),
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
            hasNextPage: page < Math.ceil(total / limit),
            hasPreviousPage: page > 1,
        };
    }

    /**
     * Find user by ID for current user info (minimal data)
     */
    static async findMe(id) {
        return await prisma.user.findUnique({
            where: {
                id_users: parseInt(id),
            },
            select: {
                id_users: true,
                name: true,
                role: true,
                email: true,
                no_hp: true,
                email_verified: true,
                last_login: true,
                created_at: true,
                department: {
                    select: {
                        id_department: true,
                        name: true,
                    },
                },
                registration: {
                    select: {
                        employee_id: true,
                        position: true,
                        division: true,
                        work_location: true,
                    },
                },
            },
        });
    }

    /**
     * Find user by ID with full department info
     */
    static async findById(id) {
        return await prisma.user.findUnique({
            where: {
                id_users: parseInt(id),
            },
            include: {
                department: true,
                registration: true,
            },
        });
    }

    /**
     * Find user by ID with detailed info including security data
     */
    static async findByIdDetailed(id) {
        return await prisma.user.findUnique({
            where: {
                id_users: parseInt(id),
            },
            select: {
                // ✅ Gunakan select dengan nested
                id_users: true,
                name: true,
                email: true,
                role: true,
                id_department: true,
                email_verified: true,
                last_login: true,
                created_at: true,
                updated_at: true,
                department: {
                    select: {
                        id_department: true,
                        name: true,
                    },
                },
                registration: {
                    select: {
                        id_registration: true,
                        employee_id: true,
                        position: true,
                        division: true,
                        hire_date: true,
                        work_location: true,
                    },
                },
                _count: {
                    select: {
                        tokens: {
                            where: {
                                type: "ACCESS_TOKEN",
                                is_revoked: false,
                                expires_at: {
                                    gte: new Date(),
                                },
                            },
                        },
                        otpCodes: {
                            where: {
                                is_used: false,
                                expires_at: {
                                    gte: new Date(),
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    /**
     * Find user by email
     */
    static async findByEmail(email) {
        return await prisma.user.findUnique({
            where: {
                email: email.toLowerCase().trim(),
            },
            include: {
                department: true,
                registration: true,
            },
        });
    }

    /**
     * Check if email exists (excluding specific user ID)
     */
    static async isEmailTaken(email, excludeUserId = null) {
        const where = {
            email: email.toLowerCase().trim(),
        };

        if (excludeUserId) {
            where.id_users = { not: parseInt(excludeUserId) };
        }

        const user = await prisma.user.findFirst({ where });
        return !!user;
    }

    /**
     * Create new user with enhanced security
     */
    static async create(userData) {
        const { password, ...otherData } = userData;

        // Hash password if not already hashed
        let hashedPassword = password;
        if (password && !password.startsWith("$2")) {
            // Validate password strength
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                throw new Error(
                    `Password validation failed: ${passwordValidation.errors.join(
                        ", "
                    )}`
                );
            }
            hashedPassword = await hashPassword(password);
        }

        // Normalize email
        if (otherData.email) {
            otherData.email = otherData.email.toLowerCase().trim();
        }

        const user = await prisma.user.create({
            data: {
                ...otherData,
                password: hashedPassword,
            },
            include: {
                department: true,
                registration: true,
            },
        });

        // Remove password from response
        delete user.password;

        return user;
    }

    /**
     * Update user by ID with validation
     */
    static async updateById(id, updateData) {
        // Hash password if provided
        if (updateData.password) {
            const passwordValidation = validatePassword(updateData.password);
            if (!passwordValidation.isValid) {
                throw new Error(
                    `Password validation failed: ${passwordValidation.errors.join(
                        ", "
                    )}`
                );
            }
            updateData.password = await hashPassword(updateData.password);
        }

        // Normalize email if provided
        if (updateData.email) {
            updateData.email = updateData.email.toLowerCase().trim();
        }

        const user = await prisma.user.update({
            where: {
                id_users: parseInt(id),
            },
            data: {
                ...updateData,
                updated_at: new Date(),
            },
            include: {
                department: true,
                registration: true,
            },
        });

        // Remove password from response
        delete user.password;

        return user;
    }

    /**
     * Update user profile (limited fields for self-update)
     */
    static async updateProfile(id, updateData) {
        // Only allow specific fields for profile updates
        const allowedFields = ["name", "no_hp"];
        const filteredData = {};

        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        });

        if (Object.keys(filteredData).length === 0) {
            throw new Error("No valid fields provided for update");
        }

        return await this.updateById(id, filteredData);
    }

    /**
     * Change password with current password verification
     */
    static async changePassword(id, currentPassword, newPassword) {
        // Get user with current password
        const user = await prisma.user.findUnique({
            where: { id_users: parseInt(id) },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Verify current password
        const isCurrentPasswordValid = await comparePassword(
            currentPassword,
            user.password
        );
        if (!isCurrentPasswordValid) {
            throw new Error("Current password is incorrect");
        }

        // Validate new password
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            throw new Error(
                `New password validation failed: ${passwordValidation.errors.join(
                    ", "
                )}`
            );
        }

        // Check if new password is different from current
        const isSamePassword = await comparePassword(
            newPassword,
            user.password
        );
        if (isSamePassword) {
            throw new Error(
                "New password must be different from current password"
            );
        }

        // Update password
        const hashedPassword = await hashPassword(newPassword);

        await prisma.user.update({
            where: { id_users: parseInt(id) },
            data: {
                password: hashedPassword,
                updated_at: new Date(),
            },
        });

        return true;
    }

    /**
     * Update email verification status
     */
    static async verifyEmail(email) {
        const user = await prisma.user.update({
            where: {
                email: email.toLowerCase().trim(),
            },
            data: {
                email_verified: true,
                updated_at: new Date(),
            },
            include: {
                department: true,
                registration: true,
            },
        });

        delete user.password;
        return user;
    }

    /**
     * Update last login timestamp
     */
    static async updateLastLogin(id) {
        return await prisma.user.update({
            where: {
                id_users: parseInt(id),
            },
            data: {
                last_login: new Date(),
            },
            select: {
                id_users: true,
                last_login: true,
            },
        });
    }

    /**
     * Delete user by ID (soft delete by deactivating)
     */
    static async deactivateById(id) {
        // Instead of hard delete, we can deactivate
        // This requires adding an 'active' field to your schema
        return await prisma.user.update({
            where: {
                id_users: parseInt(id),
            },
            data: {
                // active: false, // Add this field to your schema if needed
                updated_at: new Date(),
            },
        });
    }

    /**
     * Hard delete user by ID
     */
    static async deleteById(id) {
        return await prisma.user.delete({
            where: {
                id_users: parseInt(id),
            },
        });
    }

    /**
     * Verify password
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await comparePassword(plainPassword, hashedPassword);
        } catch (error) {
            throw new Error(`Error verifying password: ${error.message}`);
        }
    }

    /**
     * Delete user with all related records (GDPR compliance)
     */
    static async deleteUserWithRelations(id) {
        return await prisma.$transaction(async (tx) => {
            const userId = parseInt(id);

            // Delete related records first (in order of dependencies)
            await tx.token.deleteMany({
                where: { user_id: userId },
            });

            await tx.otpCode.deleteMany({
                where: { user_id: userId },
            });

            await tx.persetujuan.deleteMany({
                where: { id_users: userId },
            });

            await tx.requestKanban.deleteMany({
                where: { id_users: userId },
            });

            // Anonymize audit logs instead of deleting (for compliance)
            await tx.auditLog.updateMany({
                where: { user_id: userId },
                data: { user_id: null },
            });

            // Finally delete the user
            return await tx.user.delete({
                where: { id_users: userId },
            });
        });
    }

    /**
     * Get user statistics
     */
    static async getUserStats(userId) {
        const user = await prisma.user.findUnique({
            where: { id_users: parseInt(userId) },
            select: {
                // ✅ Gunakan select dengan nested
                id_users: true,
                last_login: true,
                email_verified: true,
                created_at: true,
                _count: {
                    select: {
                        tokens: true,
                        otpCodes: true,
                        requestKanban: true,
                        persetujuan: true,
                    },
                },
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Get active sessions count
        const activeSessions = await prisma.token.count({
            where: {
                user_id: parseInt(userId),
                type: "ACCESS_TOKEN",
                is_revoked: false,
                expires_at: {
                    gte: new Date(),
                },
            },
        });

        // Get recent login activity (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentLogins = await prisma.auditLog.count({
            where: {
                user_id: parseInt(userId),
                action: "LOGIN",
                created_at: {
                    gte: thirtyDaysAgo,
                },
            },
        });

        return {
            totalTokens: user._count.tokens,
            totalOtpCodes: user._count.otpCodes,
            totalRequests: user._count.requestKanban,
            totalApprovals: user._count.persetujuan,
            activeSessions: activeSessions,
            recentLogins: recentLogins,
            lastLogin: user.last_login,
            emailVerified: user.email_verified,
            accountAge: Math.floor(
                (Date.now() - user.created_at.getTime()) / (1000 * 60 * 60 * 24)
            ), // days
        };
    }

    /**
     * Get users by department
     */
    static async findByDepartment(departmentId, options = {}) {
        const { page = 1, limit = 10, includeStats = false } = options;

        const skip = (page - 1) * limit;

        const selectClause = {
            id_users: true,
            name: true,
            email: true,
            role: true,
            email_verified: true,
            last_login: true,
            created_at: true,
            department: {
                select: {
                    id_department: true,
                    name: true,
                },
            },
            registration: {
                select: {
                    employee_id: true,
                    position: true,
                    division: true,
                },
            },
        };

        if (includeStats) {
            selectClause._count = {
                select: {
                    tokens: {
                        where: {
                            type: "ACCESS_TOKEN",
                            is_revoked: false,
                            expires_at: {
                                gte: new Date(),
                            },
                        },
                    },
                },
            };
        }

        const users = await prisma.user.findMany({
            where: {
                id_department: parseInt(departmentId),
            },
            skip,
            take: parseInt(limit),
            select: selectClause, // ✅ Gunakan select saja
            orderBy: {
                created_at: "desc",
            },
        });

        const total = await prisma.user.count({
            where: {
                id_department: parseInt(departmentId),
            },
        });

        return {
            data: users,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Get users by role
     */
    static async findByRole(role, departmentId = null) {
        const where = { role };

        if (departmentId) {
            where.id_department = parseInt(departmentId);
        }

        return await prisma.user.findMany({
            where,
            select: {
                // ✅ Gunakan select dengan nested
                id_users: true,
                name: true,
                email: true,
                role: true,
                id_department: true,
                email_verified: true,
                department: {
                    select: {
                        id_department: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
    }

    /**
     * Search users with advanced filters
     */
    static async searchUsers(searchTerm, filters = {}) {
        const {
            departmentId,
            role,
            emailVerified,
            hasActiveSessions,
            createdAfter,
            createdBefore,
        } = filters;

        const where = {
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        };

        if (departmentId) {
            where.id_department = parseInt(departmentId);
        }

        if (role) {
            where.role = role;
        }

        if (emailVerified !== undefined) {
            where.email_verified = emailVerified;
        }

        if (createdAfter) {
            where.created_at = {
                ...where.created_at,
                gte: new Date(createdAfter),
            };
        }

        if (createdBefore) {
            where.created_at = {
                ...where.created_at,
                lte: new Date(createdBefore),
            };
        }

        let users = await prisma.user.findMany({
            where,
            select: {
                // ✅ Gunakan select dengan nested
                id_users: true,
                name: true,
                email: true,
                role: true,
                id_department: true,
                email_verified: true,
                last_login: true,
                created_at: true,
                department: {
                    select: {
                        id_department: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        tokens: {
                            where: {
                                type: "ACCESS_TOKEN",
                                is_revoked: false,
                                expires_at: {
                                    gte: new Date(),
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });

        // Filter by active sessions if specified
        if (hasActiveSessions !== undefined) {
            users = users.filter((user) => {
                const hasActive = user._count.tokens > 0;
                return hasActiveSessions ? hasActive : !hasActive;
            });
        }

        return users.map((user) => ({
            ...user,
            activeSessions: user._count.tokens,
        }));
    }

    /**
     * Bulk update users
     */
    static async bulkUpdate(userIds, updateData) {
        // Only allow safe bulk update fields
        const allowedFields = ["role", "email_verified"];
        const filteredData = {};

        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) {
                filteredData[field] = updateData[field];
            }
        });

        if (Object.keys(filteredData).length === 0) {
            throw new Error("No valid fields provided for bulk update");
        }

        return await prisma.user.updateMany({
            where: {
                id_users: {
                    in: userIds.map((id) => parseInt(id)),
                },
            },
            data: {
                ...filteredData,
                updated_at: new Date(),
            },
        });
    }

    /**
     * Get user security info (for admin dashboard)
     */
    static async getSecurityInfo(userId) {
        const user = await prisma.user.findUnique({
            where: { id_users: parseInt(userId) },
            select: {
                // ✅ Gunakan select dengan nested
                id_users: true,
                name: true,
                email: true,
                role: true,
                email_verified: true,
                last_login: true,
                created_at: true,
                tokens: {
                    select: {
                        id: true,
                        type: true,
                        created_at: true,
                        expires_at: true,
                        is_revoked: true,
                        ip_address: true,
                        user_agent: true,
                    },
                    orderBy: {
                        created_at: "desc",
                    },
                    take: 10, // Last 10 tokens
                },
                otpCodes: {
                    select: {
                        id: true,
                        type: true,
                        created_at: true,
                        expires_at: true,
                        is_used: true,
                        attempts: true,
                    },
                    orderBy: {
                        created_at: "desc",
                    },
                    take: 5, // Last 5 OTPs
                },
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Get recent audit logs
        const recentAuditLogs = await prisma.auditLog.findMany({
            where: {
                user_id: parseInt(userId),
            },
            select: {
                action: true,
                created_at: true,
                ip_address: true,
            },
            orderBy: {
                created_at: "desc",
            },
            take: 20,
        });

        return {
            user: {
                id_users: user.id_users,
                name: user.name,
                email: user.email,
                role: user.role,
                email_verified: user.email_verified,
                last_login: user.last_login,
                created_at: user.created_at,
            },
            tokens: user.tokens,
            otpCodes: user.otpCodes,
            recentActivity: recentAuditLogs,
        };
    }

    /**
     * Check if user can be deleted (has no dependencies)
     */
    static async canBeDeleted(userId) {
        const dependencies = await prisma.user.findUnique({
            where: { id_users: parseInt(userId) },
            select: {
                // ✅ Gunakan select dengan nested
                id_users: true,
                _count: {
                    select: {
                        requestKanban: true,
                        persetujuan: true,
                    },
                },
            },
        });

        if (!dependencies) {
            throw new Error("User not found");
        }

        const hasDependencies =
            dependencies._count.requestKanban > 0 ||
            dependencies._count.persetujuan > 0;

        return {
            canDelete: !hasDependencies,
            dependencies: {
                requests: dependencies._count.requestKanban,
                approvals: dependencies._count.persetujuan,
            },
        };
    }
}

module.exports = User;

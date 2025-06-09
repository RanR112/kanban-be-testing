// models/User.js - Updated to remove duplicate methods
const prisma = require("../../prisma/client");
const bcrypt = require("bcryptjs");

class User {
    /**
     * Get all users with department
     */
    static async findAll(page = 1, limit = 10, search = "") {
        const skip = (page - 1) * limit;

        const where = search
            ? {
                  OR: [
                      {
                          name: {
                              contains: search,
                          },
                      },
                      {
                          email: {
                              contains: search,
                          },
                      },
                  ],
              }
            : {};

        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: parseInt(limit),
                include: {
                    department: true,
                },
            }),
            prisma.user.count({ where }),
        ]);

        return {
            data,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(total / limit),
        };
    }

    /**
     * Find user by ID with department
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
                department: {
                    select: {
                        id_department: true,
                        name: true,
                    },
                },
            },
        });
    }

    /**
     * Find user by ID with department
     */
    static async findById(id) {
        return await prisma.user.findUnique({
            where: {
                id_users: parseInt(id),
            },
            include: {
                department: true,
            },
        });
    }

    /**
     * Find user by email
     */
    static async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
        });
    }

    /**
     * Check if email exists (excluding specific user ID)
     */
    static async isEmailTaken(email, excludeUserId = null) {
        const where = { email };
        if (excludeUserId) {
            where.id_users = { not: parseInt(excludeUserId) };
        }

        const user = await prisma.user.findFirst({ where });
        return !!user;
    }

    /**
     * Create new user with hashed password
     */
    static async create(userData) {
        const { password, ...otherData } = userData;

        const hashedPassword = await bcrypt.hash(password, 10);

        return await prisma.user.create({
            data: {
                ...otherData,
                password: hashedPassword,
            },
            include: {
                department: true,
            },
        });
    }

    /**
     * Update user by ID
     */
    static async updateById(id, updateData) {
        // Hash password if provided
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        return await prisma.user.update({
            where: {
                id_users: parseInt(id),
            },
            data: updateData,
            include: {
                department: true,
            },
        });
    }

    /**
     * Delete user by ID
     */
    static async deleteById(id) {
        return await prisma.user.delete({
            where: {
                id_users: parseInt(id),
            },
        });
    }

    /**
     * Verify password - Added for authentication
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            throw new Error(`Error verifying password: ${error.message}`);
        }
    }

    /**
     * Validate user data for creation
     */
    static validateCreateData(data) {
        const { id_department, name, role, email, no_hp, password } = data;
        const errors = [];

        if (!id_department) errors.push("Department ID is required");
        if (!name) errors.push("Name is required");
        if (!role) errors.push("Role is required");
        if (!email) errors.push("Email is required");
        if (!no_hp) errors.push("Phone number is required");
        if (!password) errors.push("Password is required");

        // Email format validation
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Invalid email format");
        }

        // Password strength validation
        if (password && password.length < 8) {
            errors.push("Password must be at least 8 characters");
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Perform parallel validations for user update
     */
    static async validateUpdateData(userId, updateData) {
        const { email, id_department } = updateData;
        const queries = [];
        const queryMap = {};

        // Always check if user exists
        queries.push(this.findById(userId));
        queryMap.user = 0;

        // Check email if provided
        if (email) {
            queries.push(this.findByEmail(email));
            queryMap.emailCheck = queries.length - 1;
        }

        // Check department if provided
        if (id_department) {
            queries.push(
                prisma.department.findUnique({
                    where: { id_department: parseInt(id_department) },
                })
            );
            queryMap.departmentCheck = queries.length - 1;
        }

        const results = await Promise.all(queries);

        const user = results[queryMap.user];
        const existingEmailUser =
            queryMap.emailCheck !== undefined
                ? results[queryMap.emailCheck]
                : null;
        const department =
            queryMap.departmentCheck !== undefined
                ? results[queryMap.departmentCheck]
                : null;

        const validation = {
            user,
            errors: [],
        };

        if (!user) {
            validation.errors.push("User not found");
        }

        if (email && email !== user?.email && existingEmailUser) {
            validation.errors.push("Email already in use");
        }

        if (
            id_department &&
            parseInt(id_department) !== user?.id_department &&
            !department
        ) {
            validation.errors.push("Department not found");
        }

        validation.isValid = validation.errors.length === 0;
        return validation;
    }

    /**
     * Delete user with all related records
     */
    static async deleteUserWithRelations(id) {
        return await prisma.$transaction(async (tx) => {
            const userId = parseInt(id);

            // Delete related records first
            await tx.persetujuan.deleteMany({
                where: { id_users: userId },
            });

            await tx.requestKanban.deleteMany({
                where: { id_users: userId },
            });

            // Finally delete the user
            return await tx.user.delete({
                where: { id_users: userId },
            });
        });
    }
}

module.exports = User;

// models/Registration.js - Model untuk mengelola registrasi karyawan
const prisma = require("../../prisma/client");
const bcrypt = require("bcryptjs");
const { validatePassword, hashPassword } = require("../utils/password");

class Registration {
    /**
     * Get all registrations with pagination and filters
     */
    static async findAll(options = {}) {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = null,
            departmentId = null,
            sortBy = "created_at",
            sortOrder = "desc",
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
                {
                    employee_id: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    position: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (departmentId) {
            where.id_department = parseInt(departmentId);
        }

        // Build orderBy clause
        const orderBy = {};
        orderBy[sortBy] = sortOrder;

        const [data, total] = await Promise.all([
            prisma.registration.findMany({
                where,
                skip,
                take: parseInt(limit),
                select: {
                    department: {
                        select: {
                            id_department: true,
                            name: true,
                        },
                    },
                    verifier: {
                        select: {
                            id_users: true,
                            name: true,
                            email: true,
                        },
                    },
                    id_registration: true,
                    employee_id: true,
                    name: true,
                    email: true,
                    email_verified: true,
                    no_hp: true,
                    role: true,
                    position: true,
                    division: true,
                    hire_date: true,
                    work_location: true,
                    status: true,
                    rejection_reason: true,
                    verified_at: true,
                    created_at: true,
                    updated_at: true,
                    department: true,
                    verifier: true,
                },
                orderBy
            }),
            prisma.registration.count({ where }),
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
     * Find registration by ID
     */
    static async findById(id) {
        return await prisma.registration.findUnique({
            where: {
                id_registration: parseInt(id),
            },
            include: {
                department: true,
                verifier: {
                    select: {
                        id_users: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    /**
     * Find registration by email
     */
    static async findByEmail(email) {
        return await prisma.registration.findUnique({
            where: {
                email: email.toLowerCase().trim(),
            },
            include: {
                department: true,
            },
        });
    }

    /**
     * Find registration by employee ID
     */
    static async findByEmployeeId(employeeId) {
        return await prisma.registration.findUnique({
            where: {
                employee_id: employeeId.toUpperCase().trim(),
            },
            include: {
                department: true,
            },
        });
    }

    /**
     * Create new registration
     */
    static async create(registrationData) {
        const { password, ...otherData } = registrationData;

        // Validate password strength
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            throw new Error(
                `Password validation failed: ${passwordValidation.errors.join(
                    ", "
                )}`
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Normalize data
        const normalizedData = {
            ...otherData,
            password: hashedPassword,
            email: otherData.email.toLowerCase().trim(),
            employee_id: otherData.employee_id.toUpperCase().trim(),
            name: otherData.name.trim(),
            position: otherData.position.trim(),
            division: otherData.division?.trim() || null,
            work_location: otherData.work_location?.trim() || null,
            email_verified: false,
            status: "PENDING",
        };

        return await prisma.registration.create({
            data: normalizedData,
            include: {
                department: true,
            },
        });
    }

    /**
     * Update registration
     */
    static async updateById(id, updateData) {
        return await prisma.registration.update({
            where: {
                id_registration: parseInt(id),
            },
            data: {
                ...updateData,
                updated_at: new Date(),
            },
            include: {
                department: true,
                verifier: {
                    select: {
                        id_users: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    /**
     * Verify email for registration
     */
    static async verifyEmail(email) {
        return await prisma.registration.update({
            where: {
                email: email.toLowerCase().trim(),
            },
            data: {
                email_verified: true,
                updated_at: new Date(),
            },
            include: {
                department: true,
            },
        });
    }

    /**
     * Approve registration and create user
     */
    static async approve(registrationId, verifiedBy, additionalData = {}) {
        return await prisma.$transaction(async (tx) => {
            // Get registration data
            const registration = await tx.registration.findUnique({
                where: { id_registration: parseInt(registrationId) },
                include: { department: true },
            });

            if (!registration) {
                throw new Error("Registration not found");
            }

            if (registration.status !== "PENDING") {
                throw new Error("Registration is not in pending status");
            }

            if (!registration.email_verified) {
                throw new Error("Email must be verified before approval");
            }

            // Create user from registration data
            const userData = {
                id_department: registration.id_department,
                id_registration: registration.id_registration,
                name: registration.name,
                role: registration.role,
                email: registration.email,
                no_hp: registration.no_hp,
                password: registration.password, // Already hashed
                email_verified: true, // Since registration email was verified
                ...additionalData,
            };

            const newUser = await tx.user.create({
                data: userData,
                include: {
                    department: true,
                    registration: true,
                },
            });

            // Update registration status
            const updatedRegistration = await tx.registration.update({
                where: { id_registration: parseInt(registrationId) },
                data: {
                    status: "APPROVED",
                    verified_by: parseInt(verifiedBy),
                    verified_at: new Date(),
                    updated_at: new Date(),
                },
                include: {
                    department: true,
                    verifier: {
                        select: {
                            id_users: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            return {
                registration: updatedRegistration,
                user: newUser,
            };
        });
    }

    /**
     * Reject registration
     */
    static async reject(registrationId, verifiedBy, rejectionReason) {
        return await prisma.registration.update({
            where: {
                id_registration: parseInt(registrationId),
            },
            data: {
                status: "REJECTED",
                verified_by: parseInt(verifiedBy),
                verified_at: new Date(),
                rejection_reason: rejectionReason,
                updated_at: new Date(),
            },
            include: {
                department: true,
                verifier: {
                    select: {
                        id_users: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    /**
     * Delete registration
     */
    static async deleteById(id) {
        return await prisma.registration.delete({
            where: {
                id_registration: parseInt(id),
            },
        });
    }

    /**
     * Check if email is already taken (in registration or user table)
     */
    static async isEmailTaken(email, excludeRegistrationId = null) {
        const normalizedEmail = email.toLowerCase().trim();

        // Check in registration table
        const registrationWhere = { email: normalizedEmail };
        if (excludeRegistrationId) {
            registrationWhere.id_registration = {
                not: parseInt(excludeRegistrationId),
            };
        }

        const [existingRegistration, existingUser] = await Promise.all([
            prisma.registration.findFirst({ where: registrationWhere }),
            prisma.user.findUnique({ where: { email: normalizedEmail } }),
        ]);

        return !!(existingRegistration || existingUser);
    }

    /**
     * Check if employee ID is already taken
     */
    static async isEmployeeIdTaken(employeeId, excludeRegistrationId = null) {
        const normalizedEmployeeId = employeeId.toUpperCase().trim();

        const where = { employee_id: normalizedEmployeeId };
        if (excludeRegistrationId) {
            where.id_registration = { not: parseInt(excludeRegistrationId) };
        }

        const existingRegistration = await prisma.registration.findFirst({
            where,
        });
        return !!existingRegistration;
    }

    /**
     * Validate registration data
     */
    static validateCreateData(data) {
        const {
            id_department,
            employee_id,
            name,
            email,
            no_hp,
            password,
            position,
            division,
            hire_date,
            work_location,
        } = data;

        const errors = [];

        // Required field validation
        if (!id_department) errors.push("Department is required");
        if (!employee_id || employee_id.trim().length === 0)
            errors.push("Employee ID is required");
        if (!name || name.trim().length === 0)
            errors.push("Full name is required");
        if (!email || email.trim().length === 0)
            errors.push("Email is required");
        if (!no_hp || no_hp.trim().length === 0)
            errors.push("Phone number is required");
        if (!password) errors.push("Password is required");
        if (!position || position.trim().length === 0)
            errors.push("Position is required");

        // Format validation
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Invalid email format");
        }

        if (employee_id && !/^[A-Z0-9-_]+$/i.test(employee_id)) {
            errors.push(
                "Employee ID can only contain letters, numbers, hyphens, and underscores"
            );
        }

        if (name && (name.trim().length < 2 || name.trim().length > 100)) {
            errors.push("Name must be between 2 and 100 characters");
        }

        if (
            position &&
            (position.trim().length < 2 || position.trim().length > 100)
        ) {
            errors.push("Position must be between 2 and 100 characters");
        }

        if (no_hp && !/^[\d+\-\s()]+$/.test(no_hp)) {
            errors.push("Invalid phone number format");
        }

        if (hire_date && isNaN(Date.parse(hire_date))) {
            errors.push("Invalid hire date format");
        }

        // Password validation
        if (password) {
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                errors.push(...passwordValidation.errors);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }

    /**
     * Get registration statistics
     */
    static async getStatistics() {
        const [total, pending, approved, rejected, emailVerified] =
            await Promise.all([
                prisma.registration.count(),
                prisma.registration.count({ where: { status: "PENDING" } }),
                prisma.registration.count({ where: { status: "APPROVED" } }),
                prisma.registration.count({ where: { status: "REJECTED" } }),
                prisma.registration.count({ where: { email_verified: true } }),
            ]);

        // Get registrations by department
        const byDepartment = await prisma.registration.groupBy({
            by: ["id_department"],
            _count: {
                id_registration: true,
            },
            include: {
                department: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        // Get recent registrations (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRegistrations = await prisma.registration.count({
            where: {
                created_at: {
                    gte: thirtyDaysAgo,
                },
            },
        });

        return {
            total,
            pending,
            approved,
            rejected,
            emailVerified,
            recentRegistrations,
            byDepartment,
        };
    }

    /**
     * Get pending registrations count for admin dashboard
     */
    static async getPendingCount() {
        return await prisma.registration.count({
            where: {
                status: "PENDING",
                email_verified: true,
            },
        });
    }

    /**
     * Search registrations with advanced filters
     */
    static async search(searchTerm, filters = {}) {
        const {
            status,
            departmentId,
            emailVerified,
            createdAfter,
            createdBefore,
            verifiedAfter,
            verifiedBefore,
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
                {
                    employee_id: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    position: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        };

        if (status) where.status = status;
        if (departmentId) where.id_department = parseInt(departmentId);
        if (emailVerified !== undefined) where.email_verified = emailVerified;

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

        if (verifiedAfter) {
            where.verified_at = {
                ...where.verified_at,
                gte: new Date(verifiedAfter),
            };
        }

        if (verifiedBefore) {
            where.verified_at = {
                ...where.verified_at,
                lte: new Date(verifiedBefore),
            };
        }

        return await prisma.registration.findMany({
            where,
            include: {
                department: true,
                verifier: {
                    select: {
                        id_users: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        });
    }
}

module.exports = Registration;

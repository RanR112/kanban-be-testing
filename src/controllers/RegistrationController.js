// controllers/RegistrationController.js - Controller untuk registrasi karyawan
const Registration = require("../models/Registration");
const OTPService = require("../services/OTPService");
const EmailService = require("../services/emailService");
const AuthService = require("../services/authService");
const prisma = require("../../prisma/client");

/**
 * Submit registration request
 */
exports.register = async (req, res) => {
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
        role = "USER",
    } = req.body;

    try {
        // Validate input data
        const validation = Registration.validateCreateData(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.errors,
            });
        }

        // Check if department exists
        const department = await prisma.department.findUnique({
            where: { id_department: parseInt(id_department) },
        });

        if (!department) {
            return res.status(400).json({
                success: false,
                message: "Department not found",
            });
        }

        // Check if email is already taken
        const isEmailTaken = await Registration.isEmailTaken(email);
        if (isEmailTaken) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered or pending registration",
            });
        }

        // Check if employee ID is already taken
        const isEmployeeIdTaken = await Registration.isEmployeeIdTaken(
            employee_id
        );
        if (isEmployeeIdTaken) {
            return res.status(409).json({
                success: false,
                message:
                    "Employee ID is already registered or pending registration",
            });
        }

        // Create registration
        const registrationData = {
            id_department: parseInt(id_department),
            employee_id,
            name,
            email,
            no_hp,
            password,
            role,
            position,
            division,
            hire_date: hire_date ? new Date(hire_date) : null,
            work_location,
        };

        const newRegistration = await Registration.create(registrationData);

        // Send email verification
        try {
            await OTPService.sendEmailVerificationOTP(email, req);

            return res.status(201).json({
                success: true,
                message:
                    "Registration submitted successfully. Please check your email for verification code.",
                data: {
                    id_registration: newRegistration.id_registration,
                    email: newRegistration.email,
                    name: newRegistration.name,
                    position: newRegistration.position,
                    department: newRegistration.department.name,
                    status: newRegistration.status,
                    email_verified: newRegistration.email_verified,
                    created_at: newRegistration.created_at,
                },
                nextStep: "email_verification",
            });
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);

            // Still return success since registration was created
            return res.status(201).json({
                success: true,
                message:
                    "Registration submitted successfully. However, verification email could not be sent. Please contact admin.",
                data: {
                    id_registration: newRegistration.id_registration,
                    email: newRegistration.email,
                    name: newRegistration.name,
                    position: newRegistration.position,
                    department: newRegistration.department.name,
                    status: newRegistration.status,
                    email_verified: newRegistration.email_verified,
                },
                warning: "Email verification could not be sent automatically",
            });
        }
    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Email or Employee ID already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Verify email for registration
 */
exports.verifyRegistrationEmail = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required",
            });
        }

        const registerData = await prisma.registration.findFirst({
            where: {email: email.toLowerCase().trim()},
            select: {
                name: true,
                department: true,
            }
        })

        // Verify OTP
        const result = await OTPService.verifyEmailOTP(email, otp, registerData.name, registerData.department.name);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message,
                code: result.code,
                remainingAttempts: result.remainingAttempts,
            });
        }

        // Update registration email verification status
        const registration = await Registration.verifyEmail(email);

        return res.json({
            success: true,
            message:
                "Email verified successfully. Your registration is now pending admin approval.",
            data: {
                id_registration: registration.id_registration,
                email: registration.email,
                email_verified: registration.email_verified,
                status: registration.status,
            },
            nextStep: "admin_approval",
        });
    } catch (error) {
        console.error("Email verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to verify email. Please try again.",
        });
    }
};

/**
 * Resend email verification for registration
 */
exports.resendRegistrationVerification = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // Check if registration exists and is not verified
        const registration = await Registration.findByEmail(email);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found",
            });
        }

        if (registration.email_verified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified",
            });
        }

        if (registration.status !== "PENDING") {
            return res.status(400).json({
                success: false,
                message: "Registration is not in pending status",
            });
        }

        // Send new verification OTP
        await OTPService.sendEmailVerificationOTP(email, registration.name, req);

        return res.json({
            success: true,
            message: "Verification code has been sent to your email.",
        });
    } catch (error) {
        console.error("Resend verification error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to resend verification code.",
        });
    }
};

/**
 * Get registration status by email
 */
exports.getRegistrationStatus = async (req, res) => {
    const { email } = req.params;

    try {
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const registration = await Registration.findByEmail(email);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found",
            });
        }

        return res.json({
            success: true,
            data: {
                id_registration: registration.id_registration,
                email: registration.email,
                name: registration.name,
                position: registration.position,
                department: registration.department.name,
                status: registration.status,
                email_verified: registration.email_verified,
                rejection_reason: registration.rejection_reason,
                verified_at: registration.verified_at,
                created_at: registration.created_at,
            },
        });
    } catch (error) {
        console.error("Get registration status error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get registration status",
        });
    }
};

/**
 * Get all registrations (Admin only)
 */
exports.getAllRegistrations = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = "",
            status = null,
            departmentId = null,
            sortBy = "created_at",
            sortOrder = "desc",
        } = req.query;

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            search,
            status,
            departmentId,
            sortBy,
            sortOrder,
        };

        const result = await Registration.findAll(options);

        return res.json({
            success: true,
            data: result.data,
            pagination: {
                page: result.page,
                limit: result.limit,
                total: result.total,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPreviousPage: result.hasPreviousPage,
            },
        });
    } catch (error) {
        console.error("Get all registrations error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve registrations",
        });
    }
};

/**
 * Get registration by ID (Admin only)
 */
exports.getRegistrationById = async (req, res) => {
    const { id } = req.params;

    try {
        const registration = await Registration.findById(id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found",
            });
        }

        // Remove password from response
        const { password, ...registrationData } = registration;

        return res.json({
            success: true,
            data: registrationData,
        });
    } catch (error) {
        console.error("Get registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve registration",
        });
    }
};

/**
 * Approve registration (Admin only)
 */
exports.approveRegistration = async (req, res) => {
    const { id } = req.params;
    const { additionalUserData = {} } = req.body;

    try {
        const verifiedBy = req.user.id_users;

        const result = await Registration.approve(
            id,
            verifiedBy,
            additionalUserData
        );

        // Log the approval action
        await AuthService.createAuditLog({
            user_id: verifiedBy,
            action: "REGISTRATION_APPROVED",
            table_name: "registration",
            record_id: parseInt(id),
            new_values: { status: "APPROVED", verified_by: verifiedBy },
            ip_address: AuthService.getClientIP(req),
            user_agent: req.get("User-Agent"),
        });

        // Send welcome email to new user
        try {
            await EmailService.sendWelcomeEmail(
                result.user.email,
                result.user.name,
                result.user.department.name
            );
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
        }

        return res.json({
            success: true,
            message:
                "Registration approved successfully. User account has been created.",
            data: {
                registration: result.registration,
                user: {
                    id_users: result.user.id_users,
                    name: result.user.name,
                    email: result.user.email,
                    role: result.user.role,
                    department: result.user.department.name,
                },
            },
        });
    } catch (error) {
        console.error("Approve registration error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to approve registration",
        });
    }
};

/**
 * Reject registration (Admin only)
 */
exports.rejectRegistration = async (req, res) => {
    const { id } = req.params;
    const { rejection_reason } = req.body;

    try {
        if (!rejection_reason || rejection_reason.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Rejection reason is required",
            });
        }

        const verifiedBy = req.user.id_users;

        const registration = await Registration.reject(
            id,
            verifiedBy,
            rejection_reason.trim()
        );

        // Log the rejection action
        await AuthService.createAuditLog({
            user_id: verifiedBy,
            action: "REGISTRATION_REJECTED",
            table_name: "registration",
            record_id: parseInt(id),
            new_values: {
                status: "REJECTED",
                verified_by: verifiedBy,
                rejection_reason: rejection_reason.trim(),
            },
            ip_address: AuthService.getClientIP(req),
            user_agent: req.get("User-Agent"),
        });

        // Send rejection notification email
        try {
            await EmailService.sendRegistrationRejectionEmail(
                registration.email,
                registration.name,
                rejection_reason
            );
        } catch (emailError) {
            console.error("Failed to send rejection email:", emailError);
        }

        return res.json({
            success: true,
            message: "Registration rejected successfully.",
            data: {
                id_registration: registration.id_registration,
                status: registration.status,
                rejection_reason: registration.rejection_reason,
                verified_at: registration.verified_at,
            },
        });
    } catch (error) {
        console.error("Reject registration error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to reject registration",
        });
    }
};

/**
 * Delete registration (Admin only)
 */
exports.deleteRegistration = async (req, res) => {
    const { id } = req.params;

    try {
        const registration = await Registration.findById(id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found",
            });
        }

        // Only allow deletion of REJECTED registrations or very old PENDING ones
        if (registration.status === "APPROVED") {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete approved registration. User account already exists.",
            });
        }

        await Registration.deleteById(id);

        // Log the deletion action
        await AuthService.createAuditLog({
            user_id: req.user.id_users,
            action: "REGISTRATION_DELETED",
            table_name: "registration",
            record_id: parseInt(id),
            old_values: {
                email: registration.email,
                name: registration.name,
                status: registration.status,
            },
            ip_address: AuthService.getClientIP(req),
            user_agent: req.get("User-Agent"),
        });

        return res.json({
            success: true,
            message: "Registration deleted successfully",
        });
    } catch (error) {
        console.error("Delete registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete registration",
        });
    }
};

/**
 * Get registration statistics (Admin only)
 */
exports.getRegistrationStatistics = async (req, res) => {
    try {
        const stats = await Registration.getStatistics();

        return res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("Get registration statistics error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve statistics",
        });
    }
};

/**
 * Search registrations (Admin only)
 */
exports.searchRegistrations = async (req, res) => {
    const { q: searchTerm } = req.query;
    const filters = {
        status: req.query.status,
        departmentId: req.query.departmentId,
        emailVerified:
            req.query.emailVerified === "true"
                ? true
                : req.query.emailVerified === "false"
                ? false
                : undefined,
        createdAfter: req.query.createdAfter,
        createdBefore: req.query.createdBefore,
        verifiedAfter: req.query.verifiedAfter,
        verifiedBefore: req.query.verifiedBefore,
    };

    try {
        if (!searchTerm || searchTerm.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Search term is required",
            });
        }

        const results = await Registration.search(searchTerm.trim(), filters);

        return res.json({
            success: true,
            data: results,
            count: results.length,
        });
    } catch (error) {
        console.error("Search registrations error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to search registrations",
        });
    }
};

/**
 * Bulk approve registrations (Admin only)
 */
exports.bulkApproveRegistrations = async (req, res) => {
    const { registration_ids, additionalUserData = {} } = req.body;

    try {
        if (
            !registration_ids ||
            !Array.isArray(registration_ids) ||
            registration_ids.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Registration IDs array is required",
            });
        }

        const verifiedBy = req.user.id_users;
        const results = [];
        const errors = [];

        for (const id of registration_ids) {
            try {
                const result = await Registration.approve(
                    id,
                    verifiedBy,
                    additionalUserData
                );
                results.push({
                    id_registration: id,
                    success: true,
                    user: {
                        id_users: result.user.id_users,
                        name: result.user.name,
                        email: result.user.email,
                    },
                });

                // Send welcome email
                try {
                    await EmailService.sendWelcomeEmail(
                        result.user.email,
                        result.user.name,
                        result.user.department.name
                    );
                } catch (emailError) {
                    console.error(
                        `Failed to send welcome email to ${result.user.email}:`,
                        emailError
                    );
                }
            } catch (error) {
                errors.push({
                    id_registration: id,
                    success: false,
                    error: error.message,
                });
            }
        }

        // Log bulk approval action
        await AuthService.createAuditLog({
            user_id: verifiedBy,
            action: "BULK_REGISTRATION_APPROVAL",
            table_name: "registration",
            new_values: {
                approved_count: results.length,
                failed_count: errors.length,
                registration_ids: registration_ids,
            },
            ip_address: AuthService.getClientIP(req),
            user_agent: req.get("User-Agent"),
        });

        return res.json({
            success: true,
            message: `Bulk approval completed. ${results.length} approved, ${errors.length} failed.`,
            data: {
                successful: results,
                failed: errors,
                summary: {
                    total: registration_ids.length,
                    approved: results.length,
                    failed: errors.length,
                },
            },
        });
    } catch (error) {
        console.error("Bulk approve registrations error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to bulk approve registrations",
        });
    }
};

/**
 * Get pending registrations count for dashboard
 */
exports.getPendingCount = async (req, res) => {
    try {
        const count = await Registration.getPendingCount();

        return res.json({
            success: true,
            data: {
                pending_count: count,
            },
        });
    } catch (error) {
        console.error("Get pending count error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get pending count",
        });
    }
};

/**
 * Update registration data (Admin only)
 */
exports.updateRegistration = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const registration = await Registration.findById(id);
        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found",
            });
        }

        // Don't allow updating approved registrations
        if (registration.status === "APPROVED") {
            return res.status(400).json({
                success: false,
                message: "Cannot update approved registration",
            });
        }

        // Remove sensitive fields that shouldn't be updated
        const allowedFields = [
            "name",
            "position",
            "division",
            "hire_date",
            "work_location",
            "no_hp",
        ];
        const filteredUpdateData = {};

        allowedFields.forEach((field) => {
            if (updateData[field] !== undefined) {
                filteredUpdateData[field] = updateData[field];
            }
        });

        if (Object.keys(filteredUpdateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No valid fields provided for update",
            });
        }

        const updatedRegistration = await Registration.updateById(
            id,
            filteredUpdateData
        );

        // Log the update action
        await AuthService.createAuditLog({
            user_id: req.user.id_users,
            action: "REGISTRATION_UPDATED",
            table_name: "registration",
            record_id: parseInt(id),
            old_values: registration,
            new_values: filteredUpdateData,
            ip_address: AuthService.getClientIP(req),
            user_agent: req.get("User-Agent"),
        });

        return res.json({
            success: true,
            message: "Registration updated successfully",
            data: updatedRegistration,
        });
    } catch (error) {
        console.error("Update registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update registration",
        });
    }
};

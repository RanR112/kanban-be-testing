const User = require("../models/User");
const Department = require("../models/Department");
const AuthService = require("../services/authService");
const { ResponseUtil, asyncHandler } = require("../middlewares/ErrorHandler");
const { validatePassword } = require("../utils/password");

/**
 * Get all users with advanced filtering and pagination
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        search = "",
        sortBy = "created_at",
        sortOrder = "desc",
        departmentId,
        role,
        emailVerified,
        hasActiveSessions,
        createdAfter,
        createdBefore,
    } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        search: search.trim(),
        sortBy,
        sortOrder,
        departmentId: departmentId ? parseInt(departmentId) : null,
        role,
        emailVerified:
            emailVerified !== undefined ? emailVerified === "true" : null,
    };

    const result = await User.findAll(options);

    // Apply additional filters if specified
    if (hasActiveSessions !== undefined || createdAfter || createdBefore) {
        const additionalFilters = {};
        if (hasActiveSessions !== undefined) {
            additionalFilters.hasActiveSessions = hasActiveSessions === "true";
        }
        if (createdAfter) additionalFilters.createdAfter = createdAfter;
        if (createdBefore) additionalFilters.createdBefore = createdBefore;

        const filteredUsers = await User.searchUsers(search, additionalFilters);

        // Apply pagination to filtered results
        const startIndex = (options.page - 1) * options.limit;
        const endIndex = startIndex + options.limit;
        const paginatedData = filteredUsers.slice(startIndex, endIndex);

        return ResponseUtil.successWithPagination(
            res,
            paginatedData,
            {
                total: filteredUsers.length,
                page: options.page,
                limit: options.limit,
                totalPages: Math.ceil(filteredUsers.length / options.limit),
                hasNextPage: endIndex < filteredUsers.length,
                hasPreviousPage: options.page > 1,
            },
            "Users retrieved successfully with filters"
        );
    }

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
        },
        "Users retrieved successfully"
    );
});

/**
 * Get current user profile (minimal data)
 */
exports.getMeById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Ensure user can only access their own data or admin can access any
    if (req.user.role !== "ADMIN" && req.user.id_users !== parseInt(id)) {
        return ResponseUtil.forbidden(
            res,
            "You can only access your own profile"
        );
    }

    const user = await User.findMe(id);

    if (!user) {
        return ResponseUtil.notFound(res, "User");
    }

    return ResponseUtil.success(
        res,
        user,
        "User profile retrieved successfully"
    );
});

/**
 * Get user by ID with detailed information
 */
exports.getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { includeStats = false, includeSecurity = false } = req.query;

    let user;

    if (includeSecurity === "true" && req.user.role === "ADMIN") {
        // Only admin can view security information
        user = await User.getSecurityInfo(id);
    } else if (includeStats === "true") {
        user = await User.findByIdDetailed(id);
        if (user) {
            const stats = await User.getUserStats(id);
            user.statistics = stats;
        }
    } else {
        user = await User.findById(id);
    }

    if (!user) {
        return ResponseUtil.notFound(res, "User");
    }

    return ResponseUtil.success(
        res,
        user,
        "User details retrieved successfully"
    );
});

/**
 * Create new user with enhanced validation
 */
exports.createUser = asyncHandler(async (req, res) => {
    const {
        id_department,
        name,
        role,
        email,
        no_hp,
        password,
        id_registration,
    } = req.body;

    // Basic validation
    if (!id_department || !name || !role || !email || !password) {
        return ResponseUtil.validationError(res, [
            {
                field: "required",
                message:
                    "Missing required fields: id_department, name, role, email, password",
            },
        ]);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return ResponseUtil.validationError(res, [
            { field: "email", message: "Invalid email format" },
        ]);
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        return ResponseUtil.validationError(
            res,
            passwordValidation.errors.map((error) => ({
                field: "password",
                message: error,
            }))
        );
    }

    // Check if email exists and department exists in parallel
    const [emailExists, departmentExists] = await Promise.all([
        User.isEmailTaken(email.toLowerCase().trim()),
        Department.exists(id_department),
    ]);

    if (emailExists) {
        return ResponseUtil.conflict(res, "Email already in use");
    }

    if (!departmentExists) {
        return ResponseUtil.notFound(res, "Department");
    }

    // Create user
    const newUser = await User.create({
        id_department: parseInt(id_department),
        id_registration: id_registration ? parseInt(id_registration) : null,
        name: name.trim(),
        role,
        email: email.toLowerCase().trim(),
        no_hp: no_hp ? no_hp.trim() : null,
        password,
    });

    // Log user creation
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "USER_CREATED",
        table_name: "users",
        record_id: newUser.id_users,
        new_values: {
            id_users: newUser.id_users,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            id_department: newUser.id_department,
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.created(res, newUser, "User created successfully");
});

/**
 * Update user data with enhanced validation
 */
exports.updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Get current user data for audit log
    const currentUser = await User.findById(id);
    if (!currentUser) {
        return ResponseUtil.notFound(res, "User");
    }

    // Filter out undefined values
    const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(
            ([_, value]) => value !== undefined && value !== ""
        )
    );

    if (Object.keys(filteredData).length === 0) {
        return ResponseUtil.validationError(res, [
            { field: "data", message: "No fields to update" },
        ]);
    }

    // Validate email if provided
    if (filteredData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(filteredData.email)) {
            return ResponseUtil.validationError(res, [
                { field: "email", message: "Invalid email format" },
            ]);
        }

        // Check if email is already taken by another user
        const emailTaken = await User.isEmailTaken(filteredData.email, id);
        if (emailTaken) {
            return ResponseUtil.conflict(
                res,
                "Email already in use by another user"
            );
        }

        filteredData.email = filteredData.email.toLowerCase().trim();
    }

    // Validate password if provided
    if (filteredData.password) {
        const passwordValidation = validatePassword(filteredData.password);
        if (!passwordValidation.isValid) {
            return ResponseUtil.validationError(
                res,
                passwordValidation.errors.map((error) => ({
                    field: "password",
                    message: error,
                }))
            );
        }
    }

    // Validate department if provided
    if (filteredData.id_department) {
        const departmentExists = await Department.exists(
            filteredData.id_department
        );
        if (!departmentExists) {
            return ResponseUtil.notFound(res, "Department");
        }
        filteredData.id_department = parseInt(filteredData.id_department);
    }

    // Trim string fields
    if (filteredData.name) filteredData.name = filteredData.name.trim();
    if (filteredData.no_hp) filteredData.no_hp = filteredData.no_hp.trim();

    // Update user
    const updatedUser = await User.updateById(id, filteredData);

    // Log user update
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "USER_UPDATED",
        table_name: "users",
        record_id: parseInt(id),
        old_values: {
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            id_department: currentUser.id_department,
            no_hp: currentUser.no_hp,
        },
        new_values: filteredData,
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.updated(res, updatedUser, "User updated successfully");
});

/**
 * Update user profile (self-update with limited fields)
 */
exports.updateProfile = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Ensure user can only update their own profile
    if (req.user.role !== "ADMIN" && req.user.id_users !== parseInt(id)) {
        return ResponseUtil.forbidden(
            res,
            "You can only update your own profile"
        );
    }

    const { name, no_hp } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (no_hp) updateData.no_hp = no_hp.trim();

    if (Object.keys(updateData).length === 0) {
        return ResponseUtil.validationError(res, [
            { field: "data", message: "No valid fields provided for update" },
        ]);
    }

    const updatedUser = await User.updateProfile(id, updateData);

    // Log profile update
    await AuthService.createAuditLog({
        user_id: parseInt(id),
        action: "PROFILE_UPDATED",
        table_name: "users",
        record_id: parseInt(id),
        new_values: updateData,
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.updated(
        res,
        updatedUser,
        "Profile updated successfully"
    );
});

/**
 * Change user password
 */
exports.changePassword = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    // Ensure user can only change their own password
    if (req.user.role !== "ADMIN" && req.user.id_users !== parseInt(id)) {
        return ResponseUtil.forbidden(
            res,
            "You can only change your own password"
        );
    }

    if (!currentPassword || !newPassword) {
        return ResponseUtil.validationError(res, [
            {
                field: "passwords",
                message: "Current password and new password are required",
            },
        ]);
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
        return ResponseUtil.validationError(
            res,
            passwordValidation.errors.map((error) => ({
                field: "newPassword",
                message: error,
            }))
        );
    }

    await User.changePassword(id, currentPassword, newPassword);

    // Log password change
    await AuthService.createAuditLog({
        user_id: parseInt(id),
        action: "PASSWORD_CHANGED",
        table_name: "users",
        record_id: parseInt(id),
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.success(res, null, "Password changed successfully");
});

/**
 * Delete user with dependency check
 */
exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { force = false } = req.query;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
        return ResponseUtil.notFound(res, "User");
    }

    // Prevent deletion of admin users by non-admin
    if (user.role === "ADMIN" && req.user.role !== "ADMIN") {
        return ResponseUtil.forbidden(res, "Cannot delete admin users");
    }

    // Check dependencies
    const dependencyCheck = await User.canBeDeleted(id);

    if (!dependencyCheck.canDelete && force !== "true") {
        return ResponseUtil.conflict(
            res,
            "User has dependencies and cannot be deleted",
            {
                dependencies: dependencyCheck.dependencies,
                suggestion: "Use force=true to delete with all related records",
            }
        );
    }

    // Store user data for audit log before deletion
    const userDataForAudit = {
        id_users: user.id_users,
        name: user.name,
        email: user.email,
        role: user.role,
        id_department: user.id_department,
    };

    // Delete user with or without relations
    if (force === "true") {
        await User.deleteUserWithRelations(id);
    } else {
        await User.deleteById(id);
    }

    // Log user deletion
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "USER_DELETED",
        table_name: "users",
        record_id: parseInt(id),
        old_values: userDataForAudit,
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.deleted(res, "User deleted successfully");
});

/**
 * Get users by department
 */
exports.getUsersByDepartment = asyncHandler(async (req, res) => {
    const { departmentId } = req.params;
    const { page = 1, limit = 10, includeStats = false } = req.query;

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        includeStats: includeStats === "true",
    };

    const result = await User.findByDepartment(departmentId, options);

    return ResponseUtil.successWithPagination(
        res,
        result.data,
        {
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        },
        "Department users retrieved successfully"
    );
});

/**
 * Get users by role
 */
exports.getUsersByRole = asyncHandler(async (req, res) => {
    const { role } = req.params;
    const { departmentId } = req.query;

    const users = await User.findByRole(role, departmentId);

    return ResponseUtil.success(
        res,
        users,
        "Users by role retrieved successfully"
    );
});

/**
 * Get user statistics
 */
exports.getUserStats = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        return ResponseUtil.notFound(res, "User");
    }

    const stats = await User.getUserStats(id);

    return ResponseUtil.success(
        res,
        stats,
        "User statistics retrieved successfully"
    );
});

/**
 * Get user active sessions
 */
exports.getUserSessions = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Ensure user can only view their own sessions or admin can view any
    if (req.user.role !== "ADMIN" && req.user.id_users !== parseInt(id)) {
        return ResponseUtil.forbidden(
            res,
            "You can only view your own sessions"
        );
    }

    const sessions = await AuthService.getUserSessions(id);

    return ResponseUtil.success(
        res,
        sessions,
        "User sessions retrieved successfully"
    );
});

/**
 * Revoke user tokens/sessions
 */
exports.revokeUserSessions = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { tokenType = null } = req.body;

    // Ensure user can only revoke their own sessions or admin can revoke any
    if (req.user.role !== "ADMIN" && req.user.id_users !== parseInt(id)) {
        return ResponseUtil.forbidden(
            res,
            "You can only revoke your own sessions"
        );
    }

    const success = await AuthService.revokeTokens(id, tokenType);

    if (!success) {
        return ResponseUtil.error(
            res,
            "No active sessions found to revoke",
            404
        );
    }

    // Log session revocation
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "SESSIONS_REVOKED",
        table_name: "tokens",
        record_id: parseInt(id),
        new_values: { tokenType: tokenType || "all" },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.success(
        res,
        null,
        "User sessions revoked successfully"
    );
});

/**
 * Bulk update users
 */
exports.bulkUpdateUsers = asyncHandler(async (req, res) => {
    const { userIds, updateData } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return ResponseUtil.validationError(res, [
            { field: "userIds", message: "User IDs array is required" },
        ]);
    }

    if (!updateData || Object.keys(updateData).length === 0) {
        return ResponseUtil.validationError(res, [
            { field: "updateData", message: "Update data is required" },
        ]);
    }

    const result = await User.bulkUpdate(userIds, updateData);

    // Log bulk update
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "BULK_USER_UPDATE",
        table_name: "users",
        new_values: {
            affectedUsers: userIds,
            updateData: updateData,
            count: result.count,
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.success(
        res,
        { updatedCount: result.count },
        `${result.count} users updated successfully`
    );
});

/**
 * Search users with advanced filters
 */
exports.searchUsers = asyncHandler(async (req, res) => {
    const {
        q: searchTerm = "",
        departmentId,
        role,
        emailVerified,
        hasActiveSessions,
        createdAfter,
        createdBefore,
    } = req.query;

    if (!searchTerm.trim()) {
        return ResponseUtil.validationError(res, [
            { field: "q", message: "Search term is required" },
        ]);
    }

    const filters = {};
    if (departmentId) filters.departmentId = parseInt(departmentId);
    if (role) filters.role = role;
    if (emailVerified !== undefined)
        filters.emailVerified = emailVerified === "true";
    if (hasActiveSessions !== undefined)
        filters.hasActiveSessions = hasActiveSessions === "true";
    if (createdAfter) filters.createdAfter = createdAfter;
    if (createdBefore) filters.createdBefore = createdBefore;

    const users = await User.searchUsers(searchTerm.trim(), filters);

    return ResponseUtil.success(res, users, "Search completed successfully");
});

/**
 * Verify user email (admin action)
 */
exports.verifyUserEmail = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
        return ResponseUtil.notFound(res, "User");
    }

    if (user.email_verified) {
        return ResponseUtil.conflict(res, "Email is already verified");
    }

    const updatedUser = await User.verifyEmail(user.email);

    // Log email verification
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "EMAIL_VERIFIED_BY_ADMIN",
        table_name: "users",
        record_id: parseInt(id),
        new_values: { email_verified: true },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.success(
        res,
        updatedUser,
        "User email verified successfully"
    );
});

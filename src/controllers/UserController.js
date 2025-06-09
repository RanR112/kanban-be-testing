const User = require("../models/User");
const Department = require("../models/Department");

/**
 * Get all users data
 */
exports.getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        const result = await User.findAll(parseInt(page), parseInt(limit), search);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};


/**
 * Get user by id
 */
exports.getMeById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findMe(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message,
        });
    }
};

/**
 * Get user by id
 */
exports.getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user",
            error: error.message,
        });
    }
};

/**
 * Create new user
 */
exports.createUser = async (req, res) => {
    const userData = req.body;

    try {
        // Validate input data
        const validation = User.validateCreateData(userData);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.errors,
            });
        }

        // Check if email exists and department exists in parallel
        const [emailExists, departmentExists] = await Promise.all([
            User.isEmailTaken(userData.email),
            Department.exists(userData.id_department)
        ]);

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already in use",
            });
        }

        if (!departmentExists) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
            });
        }

        // Create user
        const newUser = await User.create({
            id_department: parseInt(userData.id_department),
            name: userData.name,
            role: userData.role,
            email: userData.email,
            no_hp: userData.no_hp,
            password: userData.password,
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create user",
            error: error.message,
        });
    }
};

/**
 * Update user data
 */
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        // Filter out undefined values
        const filteredData = Object.fromEntries(
            Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(filteredData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No fields to update",
            });
        }

        // Validate update data
        const validation = await User.validateUpdateData(id, filteredData);
        if (!validation.isValid) {
            const statusCode = validation.errors.includes("User not found") ? 404 : 400;
            return res.status(statusCode).json({
                success: false,
                message: validation.errors[0],
                errors: validation.errors,
            });
        }

        // Parse id_department if provided
        if (filteredData.id_department) {
            filteredData.id_department = parseInt(filteredData.id_department);
        }

        // Update user
        const updatedUser = await User.updateById(id, filteredData);

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (error.code === "P2002") {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update user",
            error: error.message,
        });
    }
};

/**
 * Delete user data
 */
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if user exists first
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete related records first, then delete user
        await User.deleteUserWithRelations(id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        if (error.code === "P2025") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete user",
            error: error.message,
        });
    }
};
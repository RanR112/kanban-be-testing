const AuthService = require("../services/authService");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    try {
        // Authenticate user
        const authResult = await AuthService.authenticateUser(email, password);
        
        if (!authResult.success) {
            return res.status(authResult.message === "User not found" ? 404 : 401).json({
                success: false,
                message: authResult.message
            });
        }

        // Generate token
        const token = AuthService.generateToken(authResult.user);

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id_users: authResult.user.id_users,
                name: authResult.user.name,
                email: authResult.user.email,
                role: authResult.user.role,
                id_department: authResult.user.id_department
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

exports.logout = (req, res) => {
    try {
        // Extract token from header
        const token = AuthService.extractTokenFromHeader(req.headers.authorization);
        
        // Decode token to get user ID
        const decoded = AuthService.decodeToken(token);
        const userId = decoded?.id_users;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Invalid token"
            });
        }

        // Invalidate session
        const sessionInvalidated = AuthService.invalidateSession(userId);
        
        if (!sessionInvalidated) {
            return res.status(400).json({
                success: false,
                message: "Session not found"
            });
        }

        return res.json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get current user info (optional endpoint)
exports.getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.id_users;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        // This would use the User model to get fresh user data
        const User = require("../models/User");
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
            success: true,
            user: {
                id_users: user.id_users,
                name: user.name,
                email: user.email,
                role: user.role,
                id_department: user.id_department,
                department: user.department
            }
        });
    } catch (error) {
        console.error("Get current user error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Export session secrets for backward compatibility with middleware
exports.sessionSecrets = AuthService.getSessionSecrets();
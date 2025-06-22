const express = require("express");
const authRouter = express.Router();
const {
    login,
    logout,
    signup,
    forgotPassword,
    verifyOTP,
    resetPassword,
    resendOTP,
} = require("../controllers/AuthController");

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/signup", signup);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/resend-otp", resendOTP);

module.exports = authRouter;

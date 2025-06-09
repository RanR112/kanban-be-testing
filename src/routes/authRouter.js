const express = require("express");
const authRouter = express.Router();
const { login, logout } = require("../controllers/AuthController");

authRouter.post("/login", login);
authRouter.post("/logout", logout);

module.exports = authRouter;

// routes/userRouter.js
const express = require("express");
const {
    authenticateToken,
    authorizeAdmin,
} = require("../middlewares/AuthMiddleware");
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getMeById,
} = require("../controllers/UserController");

const userRouter = express.Router();

userRouter.use(authenticateToken);

userRouter.get("/", authorizeAdmin, getAllUsers);
userRouter.get("/:id", authorizeAdmin, getUserById);
userRouter.post("/", authorizeAdmin, createUser);
userRouter.put("/:id", authorizeAdmin, updateUser);
userRouter.delete("/:id", authorizeAdmin, deleteUser);
userRouter.get("/me/:id", getMeById);
userRouter.put("/me/:id", updateUser);

module.exports = userRouter;
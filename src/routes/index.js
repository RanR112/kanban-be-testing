const express = require('express');
const authRouter = require('./authRouter');
const kanbanRouter = require('./kanbanRouter');
const userRouter = require('./userRouter');
const reportRouter = require('./reportRouter');
const router = express.Router();

router.use('/auth', authRouter)
router.use('/kanban', kanbanRouter)
router.use('/user', userRouter)
router.use('/report', reportRouter)

module.exports = router;
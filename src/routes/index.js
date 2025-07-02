const express = require('express');
const authRouter = require('./authRouter');
const kanbanRouter = require('./kanbanRouter');
const userRouter = require('./userRouter');
const reportRouter = require('./reportRouter');
const registrationRouter = require('./registrationRouter');
const auditLogRouter = require('./auditLogRouter');
const router = express.Router();

router.use('/auth', authRouter);
router.use('/kanban', kanbanRouter);
router.use('/user', userRouter);
router.use('/report', reportRouter);
router.use('/registration', registrationRouter);
router.use('/audit-log', auditLogRouter);

module.exports = router;
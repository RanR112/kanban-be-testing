const express = require("express");
const reportRouter = express.Router();
const { checkDepartmentAccess, authenticateToken } = require("../middlewares/AuthMiddleware");
const {
    generateMonthlyReport,
    getMonthlyReportJson,
    generateMonthlyExcelReport,
} = require("../controllers/ReportController");

reportRouter.use(authenticateToken);
reportRouter.use(checkDepartmentAccess);

reportRouter.get('/monthly-pdf', generateMonthlyReport);
reportRouter.get('/monthly-json', getMonthlyReportJson);
reportRouter.get('/monthly-excel', generateMonthlyExcelReport);

module.exports = reportRouter;

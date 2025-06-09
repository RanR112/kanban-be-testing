const {
    getMonthlyReportData,
    getReportStatistics,
} = require("../utils/reportHelper");
const { createPdfReport } = require("../utils/pdfGenerator");
const { createExcelReport } = require("../utils/excelGenerator");
const {
    format,
    startOfMonth,
    endOfMonth,
} = require("date-fns");
const { id } = require("date-fns/locale");
const prisma = require("../../prisma/client");

/**
 * Generate monthly PDF report
 */
exports.generateMonthlyReport = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                message: "Month and year parameters are required",
            });
        }

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).json({
                message: "Month must be between 1 and 12",
            });
        }

        if (yearNum < 2020 || yearNum > new Date().getFullYear() + 1) {
            return res.status(400).json({
                message: "Invalid year provided",
            });
        }

        const targetDate = new Date(yearNum, monthNum - 1, 1);
        const startDate = startOfMonth(targetDate);
        const endDate = endOfMonth(targetDate);

        const [reportData, statistics] = await Promise.all([
            getMonthlyReportData(startDate, endDate),
            getReportStatistics(startDate, endDate),
        ]);

        if (reportData.length === 0) {
            return res.status(404).json({
                message: "No data found for the specified month",
            });
        }

        const monthName = format(targetDate, "MMMM yyyy", { locale: id });
        createPdfReport(res, reportData, monthName, statistics);
    } catch (error) {
        console.error("Error generating monthly report:", error);
        res.status(500).json({
            message: "Error generating report",
            error: error.message,
        });
    }
};

/**
 * Get monthly report data in JSON format
 */
exports.getMonthlyReportJson = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                message: "Month and year parameters are required",
            });
        }

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).json({
                message: "Month must be between 1 and 12",
            });
        }

        const targetDate = new Date(yearNum, monthNum - 1, 1);
        const startDate = startOfMonth(targetDate);
        const endDate = endOfMonth(targetDate);

        const [reportData, statistics] = await Promise.all([
            getMonthlyReportData(startDate, endDate),
            getReportStatistics(startDate, endDate),
        ]);

        const monthName = format(targetDate, "MMMM yyyy", { locale: id });

        res.json({
            success: true,
            data: {
                period: {
                    month: monthNum,
                    year: yearNum,
                    monthName: monthName,
                    startDate: format(startDate, "yyyy-MM-dd"),
                    endDate: format(endDate, "yyyy-MM-dd"),
                },
                statistics,
                requests: reportData,
            },
        });
    } catch (error) {
        console.error("Error getting monthly report data:", error);
        res.status(500).json({
            message: "Error retrieving report data",
            error: error.message,
        });
    }
};

/**
 * Generate monthly Excel report
 */
exports.generateMonthlyExcelReport = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                message: "Month and year parameters are required",
            });
        }

        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (monthNum < 1 || monthNum > 12) {
            return res.status(400).json({
                message: "Month must be between 1 and 12",
            });
        }

        if (yearNum < 2020 || yearNum > new Date().getFullYear() + 1) {
            return res.status(400).json({
                message: "Invalid year provided",
            });
        }

        const targetDate = new Date(yearNum, monthNum - 1, 1);
        const startDate = startOfMonth(targetDate);
        const endDate = endOfMonth(targetDate);

        const [reportData, statistics] = await Promise.all([
            getMonthlyReportData(startDate, endDate),
            getReportStatistics(startDate, endDate),
        ]);

        if (reportData.length === 0) {
            return res.status(404).json({
                message: "No data found for the specified month",
            });
        }

        const monthName = format(targetDate, "MMMM yyyy", { locale: id });
        await createExcelReport(res, reportData, monthName, statistics);
    } catch (error) {
        console.error("Error generating monthly Excel report:", error);
        res.status(500).json({
            message: "Error generating Excel report",
            error: error.message,
        });
    }
};
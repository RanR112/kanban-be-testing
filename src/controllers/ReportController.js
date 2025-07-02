const {
    getMonthlyReportData,
    getReportStatistics,
    getDepartmentReport,
    getCustomRangeReport,
    getApprovalReport,
    getRequesterReport,
} = require("../utils/reportHelper");
const { createPdfReport } = require("../utils/pdfGenerator");
const { createExcelReport } = require("../utils/excelGenerator");
const { ResponseUtil, asyncHandler } = require("../middlewares/ErrorHandler");
const AuthService = require("../services/authService");
const {
    format,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    startOfWeek,
    endOfWeek,
    parseISO,
    isValid,
} = require("date-fns");
const { id } = require("date-fns/locale");
const prisma = require("../../prisma/client");

/**
 * Generate monthly PDF report
 */
exports.generateMonthlyReport = asyncHandler(async (req, res) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return ResponseUtil.validationError(res, [
            { field: "month", message: "Month parameter is required" },
            { field: "year", message: "Year parameter is required" },
        ]);
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
        return ResponseUtil.validationError(res, [
            { field: "month", message: "Month must be between 1 and 12" },
        ]);
    }

    if (yearNum < 2020 || yearNum > new Date().getFullYear() + 1) {
        return ResponseUtil.validationError(res, [
            { field: "year", message: "Invalid year provided" },
        ]);
    }

    const targetDate = new Date(yearNum, monthNum - 1, 1);
    const startDate = startOfMonth(targetDate);
    const endDate = endOfMonth(targetDate);

    const [reportData, statistics] = await Promise.all([
        getMonthlyReportData(startDate, endDate),
        getReportStatistics(startDate, endDate),
    ]);

    if (reportData.length === 0) {
        return ResponseUtil.notFound(
            res,
            "No data found for the specified month"
        );
    }

    const monthName = format(targetDate, "MMMM yyyy", { locale: id });

    // Log report generation
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "MONTHLY_PDF_REPORT_GENERATED",
        table_name: "request_kanban",
        new_values: {
            month: monthNum,
            year: yearNum,
            recordCount: reportData.length,
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    createPdfReport(res, reportData, monthName, statistics);
});

/**
 * Get monthly report data in JSON format
 */
exports.getMonthlyReportJson = asyncHandler(async (req, res) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return ResponseUtil.validationError(res, [
            { field: "month", message: "Month parameter is required" },
            { field: "year", message: "Year parameter is required" },
        ]);
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
        return ResponseUtil.validationError(res, [
            { field: "month", message: "Month must be between 1 and 12" },
        ]);
    }

    const targetDate = new Date(yearNum, monthNum - 1, 1);
    const startDate = startOfMonth(targetDate);
    const endDate = endOfMonth(targetDate);

    const [reportData, statistics] = await Promise.all([
        getMonthlyReportData(startDate, endDate),
        getReportStatistics(startDate, endDate),
    ]);

    const monthName = format(targetDate, "MMMM yyyy", { locale: id });

    // Log report access
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "MONTHLY_JSON_REPORT_ACCESSED",
        table_name: "request_kanban",
        new_values: {
            month: monthNum,
            year: yearNum,
            recordCount: reportData.length,
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    const responseData = {
        period: {
            month: monthNum,
            year: yearNum,
            monthName: monthName,
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
        },
        statistics,
        requests: reportData,
        metadata: {
            generatedAt: new Date().toISOString(),
            generatedBy: req.user.name,
            totalRecords: reportData.length,
        },
    };

    return ResponseUtil.success(
        res,
        responseData,
        "Monthly report data retrieved successfully"
    );
});

/**
 * Generate monthly Excel report
 */
exports.generateMonthlyExcelReport = asyncHandler(async (req, res) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return ResponseUtil.validationError(res, [
            { field: "month", message: "Month parameter is required" },
            { field: "year", message: "Year parameter is required" },
        ]);
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
        return ResponseUtil.validationError(res, [
            { field: "month", message: "Month must be between 1 and 12" },
        ]);
    }

    if (yearNum < 2020 || yearNum > new Date().getFullYear() + 1) {
        return ResponseUtil.validationError(res, [
            { field: "year", message: "Invalid year provided" },
        ]);
    }

    const targetDate = new Date(yearNum, monthNum - 1, 1);
    const startDate = startOfMonth(targetDate);
    const endDate = endOfMonth(targetDate);

    const [reportData, statistics] = await Promise.all([
        getMonthlyReportData(startDate, endDate),
        getReportStatistics(startDate, endDate),
    ]);

    if (reportData.length === 0) {
        return ResponseUtil.notFound(
            res,
            "No data found for the specified month"
        );
    }

    const monthName = format(targetDate, "MMMM yyyy", { locale: id });

    // Log Excel report generation
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "MONTHLY_EXCEL_REPORT_GENERATED",
        table_name: "request_kanban",
        new_values: {
            month: monthNum,
            year: yearNum,
            recordCount: reportData.length,
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    await createExcelReport(res, reportData, monthName, statistics);
});

/**
 * Get custom date range report
 */
exports.getCustomRangeReport = asyncHandler(async (req, res) => {
    const { startDate, endDate, format: outputFormat = "json" } = req.query;

    if (!startDate || !endDate) {
        return ResponseUtil.validationError(res, [
            {
                field: "startDate",
                message: "Start date is required (YYYY-MM-DD format)",
            },
            {
                field: "endDate",
                message: "End date is required (YYYY-MM-DD format)",
            },
        ]);
    }

    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end)) {
        return ResponseUtil.validationError(res, [
            {
                field: "dates",
                message: "Invalid date format. Use YYYY-MM-DD format",
            },
        ]);
    }

    if (start > end) {
        return ResponseUtil.validationError(res, [
            { field: "dates", message: "Start date cannot be after end date" },
        ]);
    }

    // Check if date range is too large (more than 1 year)
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (daysDiff > 365) {
        return ResponseUtil.validationError(res, [
            { field: "dates", message: "Date range cannot exceed 365 days" },
        ]);
    }

    const [reportData, statistics] = await Promise.all([
        getCustomRangeReport(start, end),
        getReportStatistics(start, end),
    ]);

    // Log custom report generation
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "CUSTOM_RANGE_REPORT_GENERATED",
        table_name: "request_kanban",
        new_values: {
            startDate: startDate,
            endDate: endDate,
            dayCount: daysDiff,
            recordCount: reportData.length,
            format: outputFormat,
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    const responseData = {
        period: {
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(end, "yyyy-MM-dd"),
            dayCount: daysDiff,
            description: `${format(start, "dd/MM/yyyy")} - ${format(
                end,
                "dd/MM/yyyy"
            )}`,
        },
        statistics,
        requests: reportData,
        metadata: {
            generatedAt: new Date().toISOString(),
            generatedBy: req.user.name,
            totalRecords: reportData.length,
        },
    };

    return ResponseUtil.success(
        res,
        responseData,
        "Custom range report generated successfully"
    );
});

/**
 * Get department-specific report
 */
exports.getDepartmentReport = asyncHandler(async (req, res) => {
    const { departmentId } = req.params;
    const {
        period = "month", // week, month, year, custom
        startDate,
        endDate,
        month,
        year,
    } = req.query;

    if (!departmentId || isNaN(parseInt(departmentId))) {
        return ResponseUtil.validationError(res, [
            {
                field: "departmentId",
                message: "Valid department ID is required",
            },
        ]);
    }

    let start, end, periodDescription;

    // Determine date range based on period
    switch (period) {
        case "week":
            const now = new Date();
            start = startOfWeek(now, { weekStartsOn: 1 }); // Monday
            end = endOfWeek(now, { weekStartsOn: 1 });
            periodDescription = "This Week";
            break;

        case "month":
            if (month && year) {
                const targetDate = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    1
                );
                start = startOfMonth(targetDate);
                end = endOfMonth(targetDate);
                periodDescription = format(targetDate, "MMMM yyyy", {
                    locale: id,
                });
            } else {
                const currentDate = new Date();
                start = startOfMonth(currentDate);
                end = endOfMonth(currentDate);
                periodDescription = format(currentDate, "MMMM yyyy", {
                    locale: id,
                });
            }
            break;

        case "year":
            const targetYear = year ? parseInt(year) : new Date().getFullYear();
            start = startOfYear(new Date(targetYear, 0, 1));
            end = endOfYear(new Date(targetYear, 0, 1));
            periodDescription = targetYear.toString();
            break;

        case "custom":
            if (!startDate || !endDate) {
                return ResponseUtil.validationError(res, [
                    {
                        field: "dates",
                        message:
                            "Start date and end date are required for custom period",
                    },
                ]);
            }
            start = parseISO(startDate);
            end = parseISO(endDate);
            if (!isValid(start) || !isValid(end)) {
                return ResponseUtil.validationError(res, [
                    { field: "dates", message: "Invalid date format" },
                ]);
            }
            periodDescription = `${format(start, "dd/MM/yyyy")} - ${format(
                end,
                "dd/MM/yyyy"
            )}`;
            break;

        default:
            return ResponseUtil.validationError(res, [
                {
                    field: "period",
                    message:
                        "Invalid period. Use: week, month, year, or custom",
                },
            ]);
    }

    const [reportData, statistics, departmentInfo] = await Promise.all([
        getDepartmentReport(parseInt(departmentId), start, end),
        getReportStatistics(start, end, parseInt(departmentId)),
        prisma.department.findUnique({
            where: { id_department: parseInt(departmentId) },
            select: { id_department: true, name: true },
        }),
    ]);

    if (!departmentInfo) {
        return ResponseUtil.notFound(res, "Department");
    }

    // Log department report generation
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "DEPARTMENT_REPORT_GENERATED",
        table_name: "request_kanban",
        new_values: {
            departmentId: parseInt(departmentId),
            departmentName: departmentInfo.name,
            period: period,
            recordCount: reportData.length,
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    const responseData = {
        department: departmentInfo,
        period: {
            type: period,
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(end, "yyyy-MM-dd"),
            description: periodDescription,
        },
        statistics,
        requests: reportData,
        metadata: {
            generatedAt: new Date().toISOString(),
            generatedBy: req.user.name,
            totalRecords: reportData.length,
        },
    };

    return ResponseUtil.success(
        res,
        responseData,
        "Department report generated successfully"
    );
});

/**
 * Get approval efficiency report
 */
exports.getApprovalReport = asyncHandler(async (req, res) => {
    const {
        period = "month",
        startDate,
        endDate,
        month,
        year,
        departmentId,
    } = req.query;

    let start, end;

    // Similar date range logic as department report
    switch (period) {
        case "week":
            const now = new Date();
            start = startOfWeek(now, { weekStartsOn: 1 });
            end = endOfWeek(now, { weekStartsOn: 1 });
            break;
        case "month":
            if (month && year) {
                const targetDate = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    1
                );
                start = startOfMonth(targetDate);
                end = endOfMonth(targetDate);
            } else {
                const currentDate = new Date();
                start = startOfMonth(currentDate);
                end = endOfMonth(currentDate);
            }
            break;
        case "custom":
            if (!startDate || !endDate) {
                return ResponseUtil.validationError(res, [
                    {
                        field: "dates",
                        message:
                            "Start date and end date are required for custom period",
                    },
                ]);
            }
            start = parseISO(startDate);
            end = parseISO(endDate);
            break;
        default:
            const currentDate = new Date();
            start = startOfMonth(currentDate);
            end = endOfMonth(currentDate);
    }

    const approvalData = await getApprovalReport(
        start,
        end,
        departmentId ? parseInt(departmentId) : null
    );

    // Log approval report generation
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "APPROVAL_REPORT_GENERATED",
        table_name: "persetujuan",
        new_values: {
            period: period,
            departmentId: departmentId || null,
            startDate: format(start, "yyyy-MM-dd"),
            endDate: format(end, "yyyy-MM-dd"),
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.success(
        res,
        approvalData,
        "Approval report generated successfully"
    );
});

/**
 * Get requester activity report
 */
exports.getRequesterReport = asyncHandler(async (req, res) => {
    const {
        period = "month",
        startDate,
        endDate,
        month,
        year,
        departmentId,
        limit = 20,
    } = req.query;

    let start, end;

    switch (period) {
        case "week":
            const now = new Date();
            start = startOfWeek(now, { weekStartsOn: 1 });
            end = endOfWeek(now, { weekStartsOn: 1 });
            break;
        case "month":
            if (month && year) {
                const targetDate = new Date(
                    parseInt(year),
                    parseInt(month) - 1,
                    1
                );
                start = startOfMonth(targetDate);
                end = endOfMonth(targetDate);
            } else {
                const currentDate = new Date();
                start = startOfMonth(currentDate);
                end = endOfMonth(currentDate);
            }
            break;
        case "custom":
            if (!startDate || !endDate) {
                return ResponseUtil.validationError(res, [
                    {
                        field: "dates",
                        message:
                            "Start date and end date are required for custom period",
                    },
                ]);
            }
            start = parseISO(startDate);
            end = parseISO(endDate);
            break;
        default:
            const currentDate = new Date();
            start = startOfMonth(currentDate);
            end = endOfMonth(currentDate);
    }

    const requesterData = await getRequesterReport(
        start,
        end,
        departmentId ? parseInt(departmentId) : null,
        parseInt(limit)
    );

    // Log requester report generation
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "REQUESTER_REPORT_GENERATED",
        table_name: "request_kanban",
        new_values: {
            period: period,
            departmentId: departmentId || null,
            limit: parseInt(limit),
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.success(
        res,
        requesterData,
        "Requester report generated successfully"
    );
});

/**
 * Get report summary/dashboard
 */
exports.getReportDashboard = asyncHandler(async (req, res) => {
    const now = new Date();

    // Current month
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    // Previous month
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonthStart = startOfMonth(previousMonth);
    const previousMonthEnd = endOfMonth(previousMonth);

    // Current year
    const currentYearStart = startOfYear(now);
    const currentYearEnd = endOfYear(now);

    const [
        currentMonthStats,
        previousMonthStats,
        currentYearStats,
        recentRequests,
    ] = await Promise.all([
        getReportStatistics(currentMonthStart, currentMonthEnd),
        getReportStatistics(previousMonthStart, previousMonthEnd),
        getReportStatistics(currentYearStart, currentYearEnd),
        prisma.requestKanban.findMany({
            take: 5,
            include: {
                user: { select: { name: true } },
                department: { select: { name: true } },
            },
            orderBy: { created_at: "desc" },
        }),
    ]);

    // Calculate trends
    const calculateTrend = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
    };

    const dashboardData = {
        summary: {
            currentMonth: {
                total: currentMonthStats.total,
                approved: currentMonthStats.approved,
                rejected: currentMonthStats.rejected,
                approvalRate: currentMonthStats.approvalRate,
                avgProcessingDays: currentMonthStats.processingTime.average,
            },
            previousMonth: {
                total: previousMonthStats.total,
                approved: previousMonthStats.approved,
                rejected: previousMonthStats.rejected,
                approvalRate: previousMonthStats.approvalRate,
            },
            currentYear: {
                total: currentYearStats.total,
                approved: currentYearStats.approved,
                rejected: currentYearStats.rejected,
                approvalRate: currentYearStats.approvalRate,
            },
            trends: {
                totalRequests: calculateTrend(
                    currentMonthStats.total,
                    previousMonthStats.total
                ),
                approvalRate: calculateTrend(
                    currentMonthStats.approvalRate,
                    previousMonthStats.approvalRate
                ),
                approvedCount: calculateTrend(
                    currentMonthStats.approved,
                    previousMonthStats.approved
                ),
            },
        },
        charts: {
            monthlyByStatus: currentMonthStats.byStatus,
            monthlyByDepartment: currentMonthStats.byDepartment,
            yearlyByClassification: currentYearStats.byClassification,
            topRequesters: currentMonthStats.topRequesters.slice(0, 5),
        },
        recentActivity: recentRequests.map((req) => ({
            id: req.id_kanban,
            requester: req.nama_requester,
            department: req.department.name,
            status: req.status,
            createdAt: req.created_at,
            formattedDate: format(req.created_at, "dd/MM/yyyy HH:mm"),
        })),
        metadata: {
            generatedAt: new Date().toISOString(),
            generatedBy: req.user.name,
            periods: {
                currentMonth: format(currentMonthStart, "MMMM yyyy", {
                    locale: id,
                }),
                previousMonth: format(previousMonthStart, "MMMM yyyy", {
                    locale: id,
                }),
                currentYear: format(currentYearStart, "yyyy"),
            },
        },
    };

    // Log dashboard access
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "REPORT_DASHBOARD_ACCESSED",
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    return ResponseUtil.success(
        res,
        dashboardData,
        "Report dashboard data retrieved successfully"
    );
});

/**
 * Export any report to Excel with custom filters
 */
exports.exportCustomReport = asyncHandler(async (req, res) => {
    const {
        reportType = "custom", // monthly, department, approval, requester, custom
        format = "excel", // excel, pdf, csv
        startDate,
        endDate,
        departmentId,
        month,
        year,
        filters = {},
    } = req.body;

    let reportData, statistics, filename;

    // Determine date range and get data based on report type
    switch (reportType) {
        case "monthly":
            if (!month || !year) {
                return ResponseUtil.validationError(res, [
                    {
                        field: "period",
                        message:
                            "Month and year are required for monthly report",
                    },
                ]);
            }
            const targetDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const monthStart = startOfMonth(targetDate);
            const monthEnd = endOfMonth(targetDate);

            reportData = await getMonthlyReportData(monthStart, monthEnd);
            statistics = await getReportStatistics(monthStart, monthEnd);
            filename = `monthly_report_${year}_${month
                .toString()
                .padStart(2, "0")}`;
            break;

        case "department":
            if (!departmentId || !startDate || !endDate) {
                return ResponseUtil.validationError(res, [
                    {
                        field: "parameters",
                        message:
                            "Department ID, start date, and end date are required",
                    },
                ]);
            }
            const deptStart = parseISO(startDate);
            const deptEnd = parseISO(endDate);

            reportData = await getDepartmentReport(
                parseInt(departmentId),
                deptStart,
                deptEnd
            );
            statistics = await getReportStatistics(
                deptStart,
                deptEnd,
                parseInt(departmentId)
            );
            filename = `department_${departmentId}_report_${format(
                deptStart,
                "yyyy_MM_dd"
            )}_${format(deptEnd, "yyyy_MM_dd")}`;
            break;

        case "custom":
        default:
            if (!startDate || !endDate) {
                return ResponseUtil.validationError(res, [
                    {
                        field: "dates",
                        message:
                            "Start date and end date are required for custom report",
                    },
                ]);
            }
            const customStart = parseISO(startDate);
            const customEnd = parseISO(endDate);

            reportData = await getCustomRangeReport(customStart, customEnd);
            statistics = await getReportStatistics(customStart, customEnd);
            filename = `custom_report_${format(
                customStart,
                "yyyy_MM_dd"
            )}_${format(customEnd, "yyyy_MM_dd")}`;
            break;
    }

    if (reportData.length === 0) {
        return ResponseUtil.notFound(
            res,
            "No data found for the specified criteria"
        );
    }

    // Log export action
    await AuthService.createAuditLog({
        user_id: req.user.id_users,
        action: "CUSTOM_REPORT_EXPORTED",
        table_name: "request_kanban",
        new_values: {
            reportType,
            format,
            recordCount: reportData.length,
            filename: `${filename}.${format === "excel" ? "xlsx" : format}`,
        },
        ip_address: AuthService.getClientIP(req),
        user_agent: req.get("User-Agent"),
    });

    // Generate and send file based on format
    switch (format) {
        case "excel":
            const title = `${
                reportType.charAt(0).toUpperCase() + reportType.slice(1)
            } Report`;
            await createExcelReport(
                res,
                reportData,
                title,
                statistics,
                filename
            );
            break;

        case "pdf":
            const pdfTitle = `${
                reportType.charAt(0).toUpperCase() + reportType.slice(1)
            } Report`;
            createPdfReport(res, reportData, pdfTitle, statistics, filename);
            break;

        case "csv":
            // Simple CSV export
            res.setHeader("Content-Type", "text/csv");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename="${filename}.csv"`
            );

            const csvHeaders = [
                "ID Kanban",
                "Requester",
                "Department",
                "Production Date",
                "Parts Number",
                "Location",
                "Box",
                "Classification",
                "Description",
                "Status",
                "Created At",
            ];

            const csvData = reportData.map((item) => [
                item.id_kanban,
                item.nama_requester,
                item.department,
                item.tgl_produksi,
                item.parts_number,
                item.lokasi,
                item.box,
                item.klasifikasi,
                item.keterangan,
                item.status,
                format(
                    new Date(item.created_at || item.tgl_produksi),
                    "dd/MM/yyyy HH:mm"
                ),
            ]);

            const csvContent = [
                csvHeaders.join(","),
                ...csvData.map((row) =>
                    row
                        .map((cell) =>
                            typeof cell === "string" &&
                            (cell.includes(",") ||
                                cell.includes('"') ||
                                cell.includes("\n"))
                                ? `"${cell.replace(/"/g, '""')}"`
                                : cell
                        )
                        .join(",")
                ),
            ].join("\n");

            res.send(csvContent);
            break;

        default:
            return ResponseUtil.validationError(res, [
                {
                    field: "format",
                    message: "Invalid format. Use: excel, pdf, or csv",
                },
            ]);
    }
});

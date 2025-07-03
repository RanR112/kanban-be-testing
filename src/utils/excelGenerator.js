const ExcelJS = require("exceljs");
const { format } = require("date-fns");
const { id } = require("date-fns/locale");

// Define colors and styles
const styles = {
    header: {
        fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF2563EB" },
        },
        font: {
            color: { argb: "FFFFFFFF" },
            bold: true,
            size: 12,
        },
        alignment: { horizontal: "center", vertical: "middle" },
        border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        },
    },
    title: {
        font: { bold: true, size: 16, color: { argb: "FF2563EB" } },
        alignment: { horizontal: "center", vertical: "middle" },
    },
    subtitle: {
        font: { bold: true, size: 12 },
        alignment: { horizontal: "center", vertical: "middle" },
    },
    summaryHeader: {
        fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
        },
        font: { bold: true, size: 11 },
        border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        },
    },
    summaryValue: {
        fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF8FAFC" },
        },
        font: { size: 10 },
        border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        },
    },
    dataCell: {
        font: { size: 10 },
        border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        },
        alignment: { vertical: "middle" },
    },
    statusApproved: {
        font: { size: 10, color: { argb: "FF16A34A" }, bold: true },
        border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        },
        alignment: { horizontal: "center", vertical: "middle" },
    },
    statusRejected: {
        font: { size: 10, color: { argb: "FFDC2626" }, bold: true },
        border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        },
        alignment: { horizontal: "center", vertical: "middle" },
    },
    statusPending: {
        font: { size: 10, color: { argb: "FF64748B" }, bold: true },
        border: {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        },
        alignment: { horizontal: "center", vertical: "middle" },
    },
};

// Helper function to get status label
function getStatusLabel(status) {
    switch (status) {
        case "PENDING_APPROVAL":
            return "Menunggu Persetujuan";
        case "APPROVED_BY_DEPARTMENT":
            return "Disetujui Dept.";
        case "PENDING_PC":
            return "Menunggu PC";
        case "APPROVED_BY_PC":
            return "Disetujui PC";
        case "REJECTED_BY_DEPARTMENT":
            return "Ditolak Dept.";
        case "REJECTED_BY_PC":
            return "Ditolak PC";
        default:
            return status;
    }
}

// Helper function to get status style
function getStatusStyle(status) {
    if (status.includes("APPROVED")) {
        return styles.statusApproved;
    } else if (status.includes("REJECTED")) {
        return styles.statusRejected;
    } else {
        return styles.statusPending;
    }
}

// Function to add company header
function addCompanyHeader(worksheet) {
    // Company name
    worksheet.mergeCells("A1:I1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "PT. Segara Technology Indonesia";
    titleCell.style = styles.title;

    // Company address
    worksheet.mergeCells("A2:I2");
    const addressCell = worksheet.getCell("A2");
    addressCell.value =
        "Jl. Cianjur, Karangpawitan, Karawang Barat, Karawang 41310 West Java, Indonesia | Telp: 0812-5580-2706";
    addressCell.style = {
        font: { size: 10, color: { argb: "FF64748B" } },
        alignment: { horizontal: "center", vertical: "middle" },
    };

    // Set row heights
    worksheet.getRow(1).height = 25;
    worksheet.getRow(2).height = 20;

    return 3;
}

// Function to add report title and summary
function addReportTitle(worksheet, monthName, statistics, startRow) {
    let currentRow = startRow;

    // Report title
    worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
    const reportTitleCell = worksheet.getCell(`A${currentRow}`);
    reportTitleCell.value = "LAPORAN REQUEST KANBAN";
    reportTitleCell.style = styles.title;
    worksheet.getRow(currentRow).height = 25;
    currentRow++;

    // Period
    worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
    const periodCell = worksheet.getCell(`A${currentRow}`);
    periodCell.value = monthName;
    periodCell.style = styles.subtitle;
    worksheet.getRow(currentRow).height = 20;
    currentRow++;

    // Print date
    worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
    const printDateCell = worksheet.getCell(`A${currentRow}`);
    printDateCell.value = `Tanggal Cetak: ${format(
        new Date(),
        "dd/MM/yyyy HH:mm"
    )}`;
    printDateCell.style = {
        font: { size: 10, color: { argb: "FF64748B" } },
        alignment: { horizontal: "center", vertical: "middle" },
    };
    currentRow++;

    // Add summary if statistics available
    if (statistics) {
        currentRow++; // Empty row

        // Summary title
        worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
        const summaryTitleCell = worksheet.getCell(`A${currentRow}`);
        summaryTitleCell.value = "RINGKASAN";
        summaryTitleCell.style = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: "center", vertical: "middle" },
            fill: {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFE2E8F0" },
            },
        };
        worksheet.getRow(currentRow).height = 20;
        currentRow++;

        // Total requests
        worksheet.getCell(`A${currentRow}`).value = "Total Permintaan:";
        worksheet.getCell(`A${currentRow}`).style = styles.summaryHeader;
        worksheet.getCell(`B${currentRow}`).value = statistics.total;
        worksheet.getCell(`B${currentRow}`).style = styles.summaryValue;
        currentRow++;

        // Status breakdown
        const allStatuses = [
            "PENDING_PC",
            "APPROVED_BY_PC",
            "REJECTED_BY_PC",
            "PENDING_APPROVAL",
            "APPROVED_BY_DEPARTMENT",
            "REJECTED_BY_DEPARTMENT",
        ];

        const statusCountMap = {};
        allStatuses.forEach((key) => {
            statusCountMap[key] = 0;
        });
        statistics.byStatus.forEach((status) => {
            statusCountMap[status.status] = status.count;
        });

        allStatuses.forEach((status) => {
            const label = getStatusLabel(status);
            const count = statusCountMap[status];

            worksheet.getCell(`A${currentRow}`).value = `${label}:`;
            worksheet.getCell(`A${currentRow}`).style = styles.summaryHeader;
            worksheet.getCell(`B${currentRow}`).value = count;
            worksheet.getCell(`B${currentRow}`).style = styles.summaryValue;
            currentRow++;
        });

        currentRow++;
    }

    return currentRow;
}

// Function to create data table
function createDataTable(worksheet, reportData, startRow) {
    // Table headers
    const headers = [
        "ID Kanban",
        "Tanggal Produksi",
        "Requester",
        "Department",
        "Parts Number",
        "Lokasi",
        "Box",
        "Klasifikasi",
        "Status",
    ];

    // Add headers
    headers.forEach((header, index) => {
        const cell = worksheet.getCell(startRow, index + 1);
        cell.value = header;
        cell.style = styles.header;
    });

    worksheet.getRow(startRow).height = 20;
    let currentRow = startRow + 1;

    // Add data rows
    reportData.forEach((item, index) => {
        const row = worksheet.getRow(currentRow);

        // Set row data
        row.getCell(1).value = item.id_kanban;
        row.getCell(1).style = styles.dataCell;
        row.getCell(1).alignment = { horizontal: "center", vertical: "middle" };

        row.getCell(2).value = item.tgl_produksi;
        row.getCell(2).style = styles.dataCell;
        row.getCell(2).alignment = { horizontal: "center", vertical: "middle" };

        row.getCell(3).value = item.requester;
        row.getCell(3).style = styles.dataCell;

        row.getCell(4).value = item.department;
        row.getCell(4).style = styles.dataCell;

        row.getCell(5).value = item.parts_number;
        row.getCell(5).style = styles.dataCell;

        row.getCell(6).value = item.lokasi;
        row.getCell(6).style = styles.dataCell;

        row.getCell(7).value = item.box;
        row.getCell(7).style = styles.dataCell;
        row.getCell(7).alignment = { horizontal: "center", vertical: "middle" };

        row.getCell(8).value = item.klasifikasi;
        row.getCell(8).style = styles.dataCell;

        row.getCell(9).value = getStatusLabel(item.status);
        row.getCell(9).style = getStatusStyle(item.status);

        // Set row height
        row.height = 18;
        currentRow++;
    });

    return currentRow;
}

// Function to create statistics sheet
function createStatisticsSheet(workbook, statistics, monthName) {
    const statsSheet = workbook.addWorksheet("Statistik");

    // Add company header
    let currentRow = addCompanyHeader(statsSheet);
    currentRow++; // Empty row

    // Statistics title
    statsSheet.mergeCells(`A${currentRow}:F${currentRow}`);
    const titleCell = statsSheet.getCell(`A${currentRow}`);
    titleCell.value = "STATISTIK & ANALISIS";
    titleCell.style = styles.title;
    statsSheet.getRow(currentRow).height = 25;
    currentRow++;

    // Period
    statsSheet.mergeCells(`A${currentRow}:F${currentRow}`);
    const periodCell = statsSheet.getCell(`A${currentRow}`);
    periodCell.value = monthName;
    periodCell.style = styles.subtitle;
    currentRow += 2;

    // Department statistics
    if (statistics.byDepartment && statistics.byDepartment.length > 0) {
        statsSheet.mergeCells(`A${currentRow}:F${currentRow}`);
        const deptTitleCell = statsSheet.getCell(`A${currentRow}`);
        deptTitleCell.value = "Permintaan per Departemen";
        deptTitleCell.style = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: "left", vertical: "middle" },
        };
        currentRow++;

        // Department table headers
        statsSheet.getCell(`A${currentRow}`).value = "Departemen";
        statsSheet.getCell(`A${currentRow}`).style = styles.header;
        statsSheet.getCell(`B${currentRow}`).value = "Jumlah";
        statsSheet.getCell(`B${currentRow}`).style = styles.header;
        statsSheet.getCell(`C${currentRow}`).value = "Persentase";
        statsSheet.getCell(`C${currentRow}`).style = styles.header;
        currentRow++;

        statistics.byDepartment.forEach((dept) => {
            const percentage = ((dept.count / statistics.total) * 100).toFixed(
                1
            );

            statsSheet.getCell(`A${currentRow}`).value = dept.department;
            statsSheet.getCell(`A${currentRow}`).style = styles.dataCell;

            statsSheet.getCell(`B${currentRow}`).value = dept.count;
            statsSheet.getCell(`B${currentRow}`).style = styles.dataCell;
            statsSheet.getCell(`B${currentRow}`).alignment = {
                horizontal: "center",
                vertical: "middle",
            };

            statsSheet.getCell(`C${currentRow}`).value = `${percentage}%`;
            statsSheet.getCell(`C${currentRow}`).style = styles.dataCell;
            statsSheet.getCell(`C${currentRow}`).alignment = {
                horizontal: "center",
                vertical: "middle",
            };

            currentRow++;
        });

        currentRow += 2; // Empty rows
    }

    // Status distribution
    if (statistics.byStatus && statistics.byStatus.length > 0) {
        statsSheet.mergeCells(`A${currentRow}:F${currentRow}`);
        const statusTitleCell = statsSheet.getCell(`A${currentRow}`);
        statusTitleCell.value = "Distribusi Status";
        statusTitleCell.style = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: "left", vertical: "middle" },
        };
        currentRow++;

        // Status table headers
        statsSheet.getCell(`A${currentRow}`).value = "Status";
        statsSheet.getCell(`A${currentRow}`).style = styles.header;
        statsSheet.getCell(`B${currentRow}`).value = "Jumlah";
        statsSheet.getCell(`B${currentRow}`).style = styles.header;
        statsSheet.getCell(`C${currentRow}`).value = "Persentase";
        statsSheet.getCell(`C${currentRow}`).style = styles.header;
        currentRow++;

        statistics.byStatus.forEach((status) => {
            statsSheet.getCell(`A${currentRow}`).value = getStatusLabel(
                status.status
            );
            statsSheet.getCell(`A${currentRow}`).style = styles.dataCell;

            statsSheet.getCell(`B${currentRow}`).value = status.count;
            statsSheet.getCell(`B${currentRow}`).style = styles.dataCell;
            statsSheet.getCell(`B${currentRow}`).alignment = {
                horizontal: "center",
                vertical: "middle",
            };

            statsSheet.getCell(
                `C${currentRow}`
            ).value = `${status.percentage}%`;
            statsSheet.getCell(`C${currentRow}`).style = styles.dataCell;
            statsSheet.getCell(`C${currentRow}`).alignment = {
                horizontal: "center",
                vertical: "middle",
            };

            currentRow++;
        });
    }

    // Set column widths
    statsSheet.getColumn(1).width = 25;
    statsSheet.getColumn(2).width = 15;
    statsSheet.getColumn(3).width = 15;
}

// Main function to create Excel report
async function createExcelReport(
    res,
    reportData,
    monthName,
    statistics = null
) {
    const workbook = new ExcelJS.Workbook();

    // Set workbook properties
    workbook.creator = "System Kanban";
    workbook.lastModifiedBy = "System Kanban";
    workbook.created = new Date();
    workbook.modified = new Date();

    // Create main data sheet
    const mainSheet = workbook.addWorksheet("Laporan Kanban");

    // Add content to main sheet
    let currentRow = addCompanyHeader(mainSheet);
    currentRow = addReportTitle(mainSheet, monthName, statistics, currentRow);
    createDataTable(mainSheet, reportData, currentRow);

    // Set column widths for main sheet
    mainSheet.getColumn(1).width = 12; // ID Kanban
    mainSheet.getColumn(2).width = 15; // Tanggal Produksi
    mainSheet.getColumn(3).width = 20; // Requester
    mainSheet.getColumn(4).width = 18; // Department
    mainSheet.getColumn(5).width = 18; // Parts Number
    mainSheet.getColumn(6).width = 15; // Lokasi
    mainSheet.getColumn(7).width = 8; // Box
    mainSheet.getColumn(8).width = 15; // Klasifikasi
    mainSheet.getColumn(9).width = 18; // Status

    // Create statistics sheet if statistics available
    if (
        statistics &&
        (statistics.byDepartment.length > 0 || statistics.byStatus.length > 0)
    ) {
        createStatisticsSheet(workbook, statistics, monthName);
    }

    // Set response headers
    const fileName = `Laporan_Kanban_${monthName.replace(/\s+/g, "_")}.xlsx`;
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    // Write to response
    await workbook.xlsx.write(res);
    res.end();
}

module.exports = {
    createExcelReport,
};

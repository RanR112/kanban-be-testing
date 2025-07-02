const PDFDocument = require("pdfkit");
const { format } = require("date-fns");
const { id } = require("date-fns/locale");

// Color scheme
const colors = {
    primary: "#2563eb", // Blue
    secondary: "#64748b", // Slate
    success: "#16a34a", // Green
    warning: "#d97706", // Amber
    danger: "#dc2626", // Red
    light: "#f8fafc", // Very light gray
    medium: "#e2e8f0", // Light gray
    dark: "#1e293b", // Dark slate
    white: "#ffffff",
};

// Helper function to add company header
function addCompanyHeader(doc) {
    doc.image("../../public/images/logo.png", 35, 15, {
        width: 90,
        height: 90,
    });

    // Company info
    doc.fontSize(18)
        .fillColor(colors.primary)
        .font("Helvetica-Bold")
        .text("PT. Automotive Fasteners Aoyama Indonesia", 130, 35);

    doc.fontSize(10)
        .fillColor(colors.secondary)
        .font("Helvetica")
        .text("Kawasan Industri Mitra Karawang, Jl. Mitra Selatan IV Blok M3 & M4, Parungmulya, Ciampel, Karawang 41363 West Java, Indonesia", 130, 55)
        .text("Telp: (0267) 8633999", 130, 80);

    // Separator line
    doc.moveTo(50, 95)
        .lineTo(550, 95)
        .strokeColor(colors.medium)
        .lineWidth(2)
        .stroke();
}

// Helper function to add report title and summary
function addReportTitle(doc, monthName, statistics) {
    const titleY = 110;

    // Title background
    doc.rect(50, titleY, 500, 45).fillAndStroke(colors.primary, colors.primary);

    // Title text
    doc.fontSize(16)
        .fillColor(colors.white)
        .font("Helvetica-Bold")
        .text("LAPORAN REQUEST KANBAN", 50, titleY + 10, {
            align: "center",
            width: 500,
        });

    doc.fontSize(12).text(monthName, 50, titleY + 28, {
        align: "center",
        width: 500,
    });

    // Print info
    doc.fontSize(9)
        .fillColor(colors.secondary)
        .font("Helvetica")
        .text(
            `Tanggal Cetak: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
            400,
            titleY + 50
        );

    // Summary statistics
    if (statistics) {
        const summaryY = titleY + 75;

        // Summary background
        doc.rect(50, summaryY, 500, 65).fillAndStroke(
            colors.light,
            colors.medium
        );

        doc.fontSize(10)
            .fillColor(colors.dark)
            .font("Helvetica-Bold")
            .text("RINGKASAN:", 60, summaryY + 8);

        doc.font("Helvetica").text(
            `Total Permintaan: ${statistics.total}`,
            60,
            summaryY + 22
        );

        // Status breakdown
        const allStatuses = [
            "PENDING_PC",
            "APPROVED_BY_PC",
            "REJECTED_BY_PC",
            "PENDING_APPROVAL",
            "APPROVED_BY_DEPARTMENT",
            "REJECTED_BY_DEPARTMENT",
        ];

        // Mapping status ke jumlah, default 0
        const statusCountMap = {};
        allStatuses.forEach((key) => {
            statusCountMap[key] = 0;
        });
        statistics.byStatus.forEach((status) => {
            statusCountMap[status.status] = status.count;
        });

        // Posisi
        let line1X = 60;
        let line2X = 60;
        const lineSpacing = 200;

        // Tampilkan dua baris status (PC dan non-PC)
        allStatuses.forEach((status, index) => {
            const label = getStatusLabel(status);
            const count = statusCountMap[status];
            const color = getStatusColor(status);

            const isPC = status.includes("PC");
            const x = isPC ? line1X : line2X;
            const y = isPC ? summaryY + 36 : summaryY + 50;

            doc.fillColor(color).text(`${label}: ${count}`, x, y);

            if (isPC) line1X += lineSpacing;
            else line2X += lineSpacing;
        });
    }

    return titleY + 150;
}

// Helper function to get status color
function getStatusColor(status) {
    switch (status) {
        case "APPROVED_BY_PC":
            return colors.success;
        case "APPROVED_BY_DEPARTMENT":
            return colors.warning;
        case "PENDING_APPROVAL":
        case "PENDING_PC":
            return colors.secondary;
        case "REJECTED_BY_DEPARTMENT":
        case "REJECTED_BY_PC":
            return colors.danger;
        default:
            return colors.secondary;
    }
}

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

// Helper function to create table header
function createTableHeader(doc, startY) {
    const headerHeight = 30;

    // Header background
    doc.rect(50, startY, 500, headerHeight).fillAndStroke(
        colors.dark,
        colors.dark
    );

    // Column definitions with better spacing
    const columns = [
        { label: "ID", x: 55, width: 25 },
        { label: "Tanggal\nProduksi", x: 80, width: 60 },
        { label: "Requester", x: 140, width: 75 },
        { label: "Department", x: 215, width: 60 },
        { label: "Parts Number", x: 275, width: 70 },
        { label: "Lokasi", x: 345, width: 50 },
        { label: "Box", x: 395, width: 35 },
        { label: "Klasifikasi", x: 430, width: 50 },
        { label: "Status", x: 485, width: 60 },
    ];

    // Header text
    doc.fontSize(9).fillColor(colors.white).font("Helvetica-Bold");

    columns.forEach((col) => {
        doc.text(col.label, col.x, startY + 8, {
            width: col.width,
            align: "center",
        });
    });

    return startY + headerHeight;
}

// Helper function to add table row
function addTableRow(doc, item, rowY, isEven) {
    const rowHeight = 25;

    // Alternate row background
    const bgColor = isEven ? colors.white : colors.light;
    doc.rect(50, rowY, 500, rowHeight).fillAndStroke(bgColor, colors.medium);

    // Row data
    const statusColor = getStatusColor(item.status);
    const statusLabel = getStatusLabel(item.status);

    doc.fontSize(8).fillColor(colors.dark).font("Helvetica");

    // Column data with proper alignment
    doc.text(item.id_kanban.toString(), 55, rowY + 8, {
        width: 25,
        align: "center",
    })
        .text(item.tgl_produksi, 80, rowY + 8, { width: 60, align: "center" })
        .text(item.requester, 140, rowY + 5, {
            width: 75,
            ellipsis: true,
            height: 15,
            align: "center"
        })
        .text(item.department, 215, rowY + 5, {
            width: 60,
            ellipsis: true,
            height: 15,
            align: "center"
        })
        .text(item.parts_number, 275, rowY + 5, {
            width: 70,
            ellipsis: true,
            height: 15,
            align: "center"
        })
        .text(item.lokasi, 345, rowY + 5, {
            width: 50,
            ellipsis: true,
            height: 15,
            align: "center"
        })
        .text(item.box, 395, rowY + 8, { width: 35, align: "center" })
        .text(item.klasifikasi, 430, rowY + 5, {
            width: 50,
            ellipsis: true,
            height: 15,
            align: "center"
        });

    // Status with color
    doc.fillColor(statusColor)
        .font("Helvetica-Bold")
        .text(statusLabel, 480, rowY + 5, {
            width: 65,
            ellipsis: true,
            height: 15,
            align: "center"
        });

    return rowY + rowHeight;
}

// Main function to generate PDF content
function generatePdfContent(doc, reportData, monthName, statistics) {
    // Add company header
    addCompanyHeader(doc);

    // Add title and summary
    let currentY = addReportTitle(doc, monthName, statistics);

    // Create table header
    currentY = createTableHeader(doc, currentY);

    let rowCount = 0;
    let pageCount = 1;

    reportData.forEach((item, index) => {
        // Check if we need a new page (leaving space for footer)
        if (currentY > doc.page.height - 100) {
            doc.addPage();
            pageCount++;

            addCompanyHeader(doc);

            // Add simplified title for continuation pages
            doc.fontSize(14)
                .fillColor(colors.primary)
                .font("Helvetica-Bold")
                .text(
                    `LAPORAN REQUEST KANBAN - ${monthName} (Lanjutan)`,
                    50,
                    110,
                    { align: "center" }
                );

            currentY = createTableHeader(doc, 140);
            rowCount = 0;
        }

        currentY = addTableRow(doc, item, currentY, rowCount % 2 === 0);
        rowCount++;
    });

    // Add summary page if there's detailed statistics
    if (statistics && statistics.byDepartment.length > 0) {
        doc.addPage();
        addSummaryPage(doc, statistics, monthName);
    }
}

// Helper function to add summary/statistics page
function addSummaryPage(doc, statistics, monthName) {
    addCompanyHeader(doc);

    // Summary title
    doc.rect(50, 110, 500, 45).fillAndStroke(colors.primary, colors.primary);

    doc.fontSize(16)
        .fillColor(colors.white)
        .font("Helvetica-Bold")
        .text("STATISTIK & ANALISIS", 50, 120, {
            align: "center",
            width: 500,
        });

    doc.fontSize(12).text(monthName, 50, 135, {
        align: "center",
        width: 500,
    });

    let summaryY = 180;

    // Department statistics
    if (statistics.byDepartment.length > 0) {
        doc.fontSize(14)
            .fillColor(colors.dark)
            .font("Helvetica-Bold")
            .text("Permintaan per Departemen:", 60, summaryY);

        summaryY += 25;

        statistics.byDepartment.forEach((dept, index) => {
            const barWidth = (dept.count / statistics.total) * 300;

            // Department name
            doc.fontSize(10)
                .fillColor(colors.dark)
                .font("Helvetica")
                .text(`${dept.department}:`, 60, summaryY + 5);

            // Progress bar background
            doc.rect(200, summaryY, 300, 15).fillAndStroke(
                colors.light,
                colors.medium
            );

            // Progress bar fill
            doc.rect(200, summaryY, barWidth, 15).fillAndStroke(
                colors.primary,
                colors.primary
            );

            // Count text
            doc.fillColor(colors.white)
                .font("Helvetica-Bold")
                .text(`${dept.count}`, 205, summaryY + 3);

            summaryY += 25;
        });
    }

    // Status distribution
    summaryY += 20;
    doc.fontSize(14)
        .fillColor(colors.dark)
        .font("Helvetica-Bold")
        .text("Distribusi Status:", 60, summaryY);

    summaryY += 25;

    statistics.byStatus.forEach((status) => {
        const percentage = ((status.count / statistics.total) * 100).toFixed(1);
        const statusColor = getStatusColor(status.status);

        // Status indicator
        doc.rect(60, summaryY, 15, 15).fillAndStroke(statusColor, statusColor);

        // Status text
        doc.fontSize(10)
            .fillColor(colors.dark)
            .font("Helvetica")
            .text(
                `${getStatusLabel(status.status)}: ${
                    status.count
                } (${percentage}%)`,
                85,
                summaryY + 3
            );

        summaryY += 25;
    });
}

// Main function to create PDF report
function createPdfReport(res, reportData, monthName, statistics = null) {
    const doc = new PDFDocument({
        margin: 50,
        size: "A4",
        info: {
            Title: `Laporan Kanban - ${monthName}`,
            Author: "System Kanban",
            Subject: "Laporan Bulanan Request Kanban",
            Keywords: "kanban, laporan, bulanan",
        },
    });

    const fileName = `Laporan_Kanban_${monthName.replace(/\s+/g, "_")}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    doc.pipe(res);

    generatePdfContent(doc, reportData, monthName, statistics);

    doc.end();
}

module.exports = {
    createPdfReport,
};

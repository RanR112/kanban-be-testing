const prisma = require("../../prisma/client");
const { format } = require("date-fns");
const { id } = require("date-fns/locale");

// Helper function to get monthly report data with enhanced details
async function getMonthlyReportData(startDate, endDate) {
    const kanbanRequests = await prisma.requestKanban.findMany({
        where: {
            tgl_produksi: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    role: true,
                },
            },
            department: {
                select: {
                    name: true,
                },
            },
            persetujuan: {
                include: {
                    user: {
                        select: {
                            name: true,
                            role: true,
                        },
                    },
                },
                orderBy: {
                    approvedAt: "desc",
                },
            },
        },
        orderBy: {
            tgl_produksi: "asc",
        },
    });

    return kanbanRequests.map((request) => {
        // Find the latest approval (if any)
        const approvedApprovals = request.persetujuan.filter(
            (approval) => approval.approve === true && approval.approvedAt
        );

        const latestApproval =
            approvedApprovals.length > 0 ? approvedApprovals[0] : null;

        // Count total approvals and rejections
        const totalApprovals = request.persetujuan.filter(
            (p) => p.approve === true
        ).length;
        const totalRejections = request.persetujuan.filter(
            (p) =>
                p.approve === false &&
                p.note &&
                (p.note.includes("Rejected") || p.note.includes("reject"))
        ).length;

        return {
            id_kanban: request.id_kanban,
            requester: request.nama_requester,
            requester_role: request.user.role,
            department: request.department.name,
            tgl_produksi: format(request.tgl_produksi, "dd/MM/yyyy"),
            nama_requester: request.nama_requester,
            parts_number: request.parts_number,
            lokasi: request.lokasi,
            box: request.box,
            klasifikasi: request.klasifikasi,
            keterangan: request.keterangan,
            status: request.status,
            totalApprovals,
            totalRejections,
            lastApproval: latestApproval
                ? {
                      approver: latestApproval.user.name,
                      role: latestApproval.role,
                      approved: latestApproval.approve,
                      date: format(
                          latestApproval.approvedAt,
                          "dd/MM/yyyy HH:mm"
                      ),
                      note: latestApproval.note,
                  }
                : null,
            // Processing time calculation
            processingDays:
                latestApproval && latestApproval.approvedAt
                    ? Math.ceil(
                          (latestApproval.approvedAt.getTime() -
                              request.tgl_produksi.getTime()) /
                              (1000 * 60 * 60 * 24)
                      )
                    : null,
        };
    });
}

// Enhanced function to get comprehensive report statistics
async function getReportStatistics(startDate, endDate) {
    // Status distribution
    const statusCounts = await prisma.requestKanban.groupBy({
        by: ["status"],
        where: {
            tgl_produksi: {
                gte: startDate,
                lte: endDate,
            },
        },
        _count: {
            id_kanban: true,
        },
    });

    // Department distribution
    const departmentCounts = await prisma.requestKanban.groupBy({
        by: ["id_department"],
        where: {
            tgl_produksi: {
                gte: startDate,
                lte: endDate,
            },
        },
        _count: {
            id_kanban: true,
        },
    });

    // Get department names
    const departments = await prisma.department.findMany();
    const departmentMap = departments.reduce((map, dept) => {
        map[dept.id_department] = dept.name;
        return map;
    }, {});

    const departmentStatistics = departmentCounts.map((item) => ({
        departmentId: item.id_department,
        department:
            departmentMap[item.id_department] ||
            `Department ID ${item.id_department}`,
        count: item._count.id_kanban,
    }));

    // Total count
    const totalCount = await prisma.requestKanban.count({
        where: {
            tgl_produksi: {
                gte: startDate,
                lte: endDate,
            },
        },
    });

    // Processing time statistics
    const requestsWithApprovals = await prisma.requestKanban.findMany({
        where: {
            tgl_produksi: {
                gte: startDate,
                lte: endDate,
            },
            persetujuan: {
                some: {
                    approve: true,
                    approvedAt: {
                        not: null,
                    },
                },
            },
        },
        include: {
            persetujuan: {
                where: {
                    approve: true,
                    approvedAt: {
                        not: null,
                    },
                },
                orderBy: {
                    approvedAt: "desc",
                },
                take: 1,
            },
        },
    });

    const processingTimes = requestsWithApprovals.map((request) => {
        const latestApproval = request.persetujuan[0];
        return Math.ceil(
            (latestApproval.approvedAt.getTime() -
                request.tgl_produksi.getTime()) /
                (1000 * 60 * 60 * 24)
        );
    });

    const avgProcessingTime =
        processingTimes.length > 0
            ? Math.round(
                  processingTimes.reduce((sum, time) => sum + time, 0) /
                      processingTimes.length
              )
            : 0;

    const maxProcessingTime =
        processingTimes.length > 0 ? Math.max(...processingTimes) : 0;
    const minProcessingTime =
        processingTimes.length > 0 ? Math.min(...processingTimes) : 0;

    // Classification distribution
    const classificationCounts = await prisma.requestKanban.groupBy({
        by: ["klasifikasi"],
        where: {
            tgl_produksi: {
                gte: startDate,
                lte: endDate,
            },
        },
        _count: {
            id_kanban: true,
        },
    });

    // Requester statistics (top requesters)
    const requesterCounts = await prisma.requestKanban.groupBy({
        by: ["nama_requester"],
        where: {
            tgl_produksi: {
                gte: startDate,
                lte: endDate,
            },
        },
        _count: {
            id_kanban: true,
        },
        orderBy: {
            _count: {
                id_kanban: "desc",
            },
        },
        take: 10,
    });

    // Get additional info for top requesters (department info from user who created the request)
    const topRequesterNames = requesterCounts.map(
        (item) => item.nama_requester
    );
    const requestsWithUserInfo = await prisma.requestKanban.findMany({
        where: {
            nama_requester: {
                in: topRequesterNames,
            },
            tgl_produksi: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            user: {
                select: {
                    role: true,
                    department: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        distinct: ["nama_requester"],
    });

    // Create a map for requester info
    const requesterInfoMap = requestsWithUserInfo.reduce((map, request) => {
        if (!map[request.nama_requester]) {
            map[request.nama_requester] = {
                role: request.user.role,
                department: request.user.department.name,
            };
        }
        return map;
    }, {});

    const topRequesters = requesterCounts.map((item) => ({
        name: item.nama_requester,
        role: requesterInfoMap[item.nama_requester]?.role || "Unknown",
        department:
            requesterInfoMap[item.nama_requester]?.department || "Unknown",
        count: item._count.id_kanban,
    }));

    // Approval efficiency (percentage of approved vs total)
    const approvedCount = statusCounts
        .filter(
            (item) =>
                item.status === "APPROVED_BY_PC" ||
                item.status === "APPROVED_BY_DEPARTMENT"
        )
        .reduce((sum, item) => sum + item._count.id_kanban, 0);

    const rejectedCount = statusCounts
        .filter(
            (item) =>
                item.status === "REJECTED_BY_PC" ||
                item.status === "REJECTED_BY_DEPARTMENT"
        )
        .reduce((sum, item) => sum + item._count.id_kanban, 0);

    const approvalRate =
        totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;
    const rejectionRate =
        totalCount > 0 ? Math.round((rejectedCount / totalCount) * 100) : 0;

    return {
        total: totalCount,
        approved: approvedCount,
        rejected: rejectedCount,
        approvalRate,
        rejectionRate,
        byStatus: statusCounts.map((item) => ({
            status: item.status,
            count: item._count.id_kanban,
            percentage:
                totalCount > 0
                    ? Math.round((item._count.id_kanban / totalCount) * 100)
                    : 0,
        })),
        byDepartment: departmentStatistics.sort((a, b) => b.count - a.count),
        byClassification: classificationCounts.map((item) => ({
            classification: item.klasifikasi,
            count: item._count.id_kanban,
            percentage:
                totalCount > 0
                    ? Math.round((item._count.id_kanban / totalCount) * 100)
                    : 0,
        })),
        topRequesters,
        processingTime: {
            average: avgProcessingTime,
            minimum: minProcessingTime,
            maximum: maxProcessingTime,
            totalProcessed: processingTimes.length,
        },
        summary: {
            totalCount,
            approvedCount,
            rejectedCount,
            pendingCount: totalCount - approvedCount - rejectedCount,
            approvalRate,
            rejectionRate,
            avgProcessingDays: avgProcessingTime,
        },
    };
}

module.exports = {
    getMonthlyReportData,
    getReportStatistics,
};

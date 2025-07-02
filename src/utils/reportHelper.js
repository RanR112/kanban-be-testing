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
            created_at: request.created_at,
            updated_at: request.updated_at,
        };
    });
}

// Enhanced function to get comprehensive report statistics
async function getReportStatistics(startDate, endDate, departmentId = null) {
    const baseWhere = {
        tgl_produksi: {
            gte: startDate,
            lte: endDate,
        },
    };

    if (departmentId) {
        baseWhere.id_department = departmentId;
    }

    // Status distribution
    const statusCounts = await prisma.requestKanban.groupBy({
        by: ["status"],
        where: baseWhere,
        _count: {
            id_kanban: true,
        },
    });

    // Department distribution (only if not filtering by specific department)
    let departmentCounts = [];
    if (!departmentId) {
        departmentCounts = await prisma.requestKanban.groupBy({
            by: ["id_department"],
            where: baseWhere,
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

        departmentCounts = departmentCounts.map((item) => ({
            departmentId: item.id_department,
            department:
                departmentMap[item.id_department] ||
                `Department ID ${item.id_department}`,
            count: item._count.id_kanban,
        }));
    }

    // Total count
    const totalCount = await prisma.requestKanban.count({
        where: baseWhere,
    });

    // Processing time statistics
    const requestsWithApprovals = await prisma.requestKanban.findMany({
        where: {
            ...baseWhere,
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
        where: baseWhere,
        _count: {
            id_kanban: true,
        },
    });

    // Requester statistics (top requesters)
    const requesterCounts = await prisma.requestKanban.groupBy({
        by: ["nama_requester"],
        where: baseWhere,
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

    // Get additional info for top requesters
    const topRequesterNames = requesterCounts.map(
        (item) => item.nama_requester
    );
    const requestsWithUserInfo = await prisma.requestKanban.findMany({
        where: {
            nama_requester: {
                in: topRequesterNames,
            },
            ...baseWhere,
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
        byDepartment: departmentCounts.sort((a, b) => b.count - a.count),
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

// Get custom date range report data
async function getCustomRangeReport(startDate, endDate) {
    return await getMonthlyReportData(startDate, endDate);
}

// Get department-specific report
async function getDepartmentReport(departmentId, startDate, endDate) {
    const kanbanRequests = await prisma.requestKanban.findMany({
        where: {
            id_department: departmentId,
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
        const approvedApprovals = request.persetujuan.filter(
            (approval) => approval.approve === true && approval.approvedAt
        );
        const latestApproval =
            approvedApprovals.length > 0 ? approvedApprovals[0] : null;

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
            processingDays:
                latestApproval && latestApproval.approvedAt
                    ? Math.ceil(
                          (latestApproval.approvedAt.getTime() -
                              request.tgl_produksi.getTime()) /
                              (1000 * 60 * 60 * 24)
                      )
                    : null,
            created_at: request.created_at,
            updated_at: request.updated_at,
        };
    });
}

// Get approval efficiency report
async function getApprovalReport(startDate, endDate, departmentId = null) {
    const baseWhere = {
        created_at: {
            gte: startDate,
            lte: endDate,
        },
    };

    if (departmentId) {
        baseWhere.id_department = departmentId;
    }

    // Get approval statistics by role
    const approvalsByRole = await prisma.persetujuan.groupBy({
        by: ["role", "approve"],
        where: baseWhere,
        _count: {
            id_users: true,
        },
    });

    // Get approval statistics by user
    const approvalsByUser = await prisma.persetujuan.findMany({
        where: baseWhere,
        include: {
            user: {
                select: {
                    id_users: true,
                    name: true,
                    role: true,
                    department: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
    });

    // Group approvals by user
    const userApprovalMap = approvalsByUser.reduce((map, approval) => {
        const userId = approval.user.id_users;
        if (!map[userId]) {
            map[userId] = {
                user: approval.user,
                totalApprovals: 0,
                approved: 0,
                rejected: 0,
                averageResponseTime: 0,
                responseTimes: [],
            };
        }

        map[userId].totalApprovals += 1;
        if (approval.approve) {
            map[userId].approved += 1;
        } else {
            map[userId].rejected += 1;
        }

        // Calculate response time if approved
        if (approval.approvedAt && approval.created_at) {
            const responseTime = Math.ceil(
                (approval.approvedAt.getTime() -
                    approval.created_at.getTime()) /
                    (1000 * 60 * 60 * 24)
            );
            map[userId].responseTimes.push(responseTime);
        }

        return map;
    }, {});

    // Calculate average response times
    const userApprovalStats = Object.values(userApprovalMap).map(
        (userStats) => {
            const avgResponseTime =
                userStats.responseTimes.length > 0
                    ? Math.round(
                          userStats.responseTimes.reduce(
                              (sum, time) => sum + time,
                              0
                          ) / userStats.responseTimes.length
                      )
                    : 0;

            return {
                ...userStats,
                averageResponseTime: avgResponseTime,
                approvalRate:
                    userStats.totalApprovals > 0
                        ? Math.round(
                              (userStats.approved / userStats.totalApprovals) *
                                  100
                          )
                        : 0,
            };
        }
    );

    // Group by role for role statistics
    const roleStats = approvalsByRole.reduce((map, item) => {
        if (!map[item.role]) {
            map[item.role] = { approved: 0, rejected: 0, total: 0 };
        }

        if (item.approve) {
            map[item.role].approved += item._count.id_users;
        } else {
            map[item.role].rejected += item._count.id_users;
        }
        map[item.role].total += item._count.id_users;

        return map;
    }, {});

    const roleStatistics = Object.entries(roleStats).map(([role, stats]) => ({
        role,
        ...stats,
        approvalRate:
            stats.total > 0
                ? Math.round((stats.approved / stats.total) * 100)
                : 0,
    }));

    return {
        summary: {
            totalApprovals: approvalsByUser.length,
            totalApprovers: userApprovalStats.length,
            averageApprovalRate:
                userApprovalStats.length > 0
                    ? Math.round(
                          userApprovalStats.reduce(
                              (sum, user) => sum + user.approvalRate,
                              0
                          ) / userApprovalStats.length
                      )
                    : 0,
            averageResponseTime:
                userApprovalStats.length > 0
                    ? Math.round(
                          userApprovalStats.reduce(
                              (sum, user) => sum + user.averageResponseTime,
                              0
                          ) / userApprovalStats.length
                      )
                    : 0,
        },
        byRole: roleStatistics,
        byUser: userApprovalStats.sort(
            (a, b) => b.totalApprovals - a.totalApprovals
        ),
        period: {
            startDate: format(startDate, "dd/MM/yyyy"),
            endDate: format(endDate, "dd/MM/yyyy"),
        },
    };
}

// Get requester activity report
async function getRequesterReport(
    startDate,
    endDate,
    departmentId = null,
    limit = 20
) {
    const baseWhere = {
        tgl_produksi: {
            gte: startDate,
            lte: endDate,
        },
    };

    if (departmentId) {
        baseWhere.id_department = departmentId;
    }

    // Get requests grouped by requester
    const requesterStats = await prisma.requestKanban.groupBy({
        by: ["nama_requester", "id_users"],
        where: baseWhere,
        _count: {
            id_kanban: true,
        },
        orderBy: {
            _count: {
                id_kanban: "desc",
            },
        },
        take: limit,
    });

    // Get detailed information for each requester
    const requesterDetails = await Promise.all(
        requesterStats.map(async (requester) => {
            // Get status breakdown for this requester
            const statusBreakdown = await prisma.requestKanban.groupBy({
                by: ["status"],
                where: {
                    ...baseWhere,
                    nama_requester: requester.nama_requester,
                },
                _count: {
                    id_kanban: true,
                },
            });

            // Get user info
            const userInfo = await prisma.user.findUnique({
                where: {
                    id_users: requester.id_users,
                },
                select: {
                    name: true,
                    role: true,
                    department: {
                        select: {
                            name: true,
                        },
                    },
                },
            });

            // Calculate approval rate
            const approvedCount = statusBreakdown
                .filter(
                    (s) =>
                        s.status === "APPROVED_BY_PC" ||
                        s.status === "APPROVED_BY_DEPARTMENT"
                )
                .reduce((sum, s) => sum + s._count.id_kanban, 0);

            const rejectedCount = statusBreakdown
                .filter(
                    (s) =>
                        s.status === "REJECTED_BY_PC" ||
                        s.status === "REJECTED_BY_DEPARTMENT"
                )
                .reduce((sum, s) => sum + s._count.id_kanban, 0);

            const approvalRate =
                requester._count.id_kanban > 0
                    ? Math.round(
                          (approvedCount / requester._count.id_kanban) * 100
                      )
                    : 0;

            return {
                requester: requester.nama_requester,
                user: userInfo,
                totalRequests: requester._count.id_kanban,
                approved: approvedCount,
                rejected: rejectedCount,
                pending:
                    requester._count.id_kanban - approvedCount - rejectedCount,
                approvalRate,
                statusBreakdown: statusBreakdown.map((s) => ({
                    status: s.status,
                    count: s._count.id_kanban,
                })),
            };
        })
    );

    return {
        summary: {
            totalRequesters: requesterDetails.length,
            totalRequests: requesterDetails.reduce(
                (sum, r) => sum + r.totalRequests,
                0
            ),
            averageRequestsPerRequester:
                requesterDetails.length > 0
                    ? Math.round(
                          requesterDetails.reduce(
                              (sum, r) => sum + r.totalRequests,
                              0
                          ) / requesterDetails.length
                      )
                    : 0,
            averageApprovalRate:
                requesterDetails.length > 0
                    ? Math.round(
                          requesterDetails.reduce(
                              (sum, r) => sum + r.approvalRate,
                              0
                          ) / requesterDetails.length
                      )
                    : 0,
        },
        requesters: requesterDetails,
        period: {
            startDate: format(startDate, "dd/MM/yyyy"),
            endDate: format(endDate, "dd/MM/yyyy"),
        },
    };
}

module.exports = {
    getMonthlyReportData,
    getReportStatistics,
    getCustomRangeReport,
    getDepartmentReport,
    getApprovalReport,
    getRequesterReport,
};

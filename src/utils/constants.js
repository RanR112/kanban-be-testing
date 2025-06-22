// Department constants
const PC_DEPARTMENT_ID = 1;

// Approval roles
const APPROVAL_ROLES = {
    LSM: ["LEADER", "SUPERVISOR", "MANAGER"],
    PC_APPROVERS: ["SUPERVISOR", "MANAGER"],
};

// Status constants
const STATUS = {
    PENDING_APPROVAL: "PENDING_APPROVAL",
    PENDING_PC: "PENDING_PC",
    APPROVED_BY_DEPARTMENT: "APPROVED_BY_DEPARTMENT",
    APPROVED_BY_PC: "APPROVED_BY_PC",
    REJECTED_BY_DEPARTMENT: "REJECTED_BY_DEPARTMENT",
    REJECTED_BY_PC: "REJECTED_BY_PC",
};

// Note constants
const NOTE = {
    PENDING: "Pending",
    APPROVED: "Approved",
    APPROVED_BY_MANAGER: "Approved by Manager",
    PENDING_CLOSURE: "Pending Closure",
    CLOSURE: "Closure",
    REJECTED: "Rejected",
    REJECTED_BY_DEPARTMENT: "Rejected by Department",
    REJECTED_BY_PC: "Rejected by PC",
};

// Rejected notes and statuses for filtering
const REJECTED_NOTES = [
    NOTE.REJECTED,
    NOTE.REJECTED_BY_DEPARTMENT,
    NOTE.REJECTED_BY_PC,
    "Auto-rejected: Rejected by Department",
    "Auto-rejected: Rejected by PC",
];

const REJECTED_STATUSES = [
    STATUS.REJECTED_BY_DEPARTMENT,
    STATUS.REJECTED_BY_PC,
];

module.exports = {
    PC_DEPARTMENT_ID,
    APPROVAL_ROLES,
    STATUS,
    NOTE,
    REJECTED_NOTES,
    REJECTED_STATUSES,
};
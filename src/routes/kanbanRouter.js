const express = require("express");
const kanbanRouter = express.Router();
const {
    createKanban,
    getPendingApprovals,
    approveKanban,
    getApprovedKanban,
    getMyRequests,
    getIncomingForPC,
    getApprovedByPCKanban,
    rejectKanban,
    updateKanban,
    getAllKanban,
    getKanbanById,
} = require("../controllers/KanbanController");
const { authenticateToken } = require("../middlewares/AuthMiddleware");

kanbanRouter.use(authenticateToken)

kanbanRouter.get("/all", getAllKanban);
kanbanRouter.get("/get/:id_kanban", getKanbanById);
kanbanRouter.post("/request", createKanban);
kanbanRouter.put("/:id_kanban", updateKanban);
kanbanRouter.get("/pending", getPendingApprovals);
kanbanRouter.post("/approve", approveKanban);
kanbanRouter.get("/approved", getApprovedKanban);
kanbanRouter.get("/mine", getMyRequests);
kanbanRouter.get("/incoming-pc", getIncomingForPC);
kanbanRouter.get("/done", getApprovedByPCKanban);
kanbanRouter.post("/reject", rejectKanban);

module.exports = kanbanRouter;

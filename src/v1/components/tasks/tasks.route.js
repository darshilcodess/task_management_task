const express = require("express");
const router = express.Router();

const { createTask, getAllTasks, getSingleTask, updateTask, getTaskStats, deleteTask } = require("./tasks.controller");
const { protect } = require("../../../middleware/auth-handler");
const { validateBody } = require("../../../middleware/validate");
const { createTaskSchema, updateTaskSchema } = require("./tasks.validation");

router.get("/stats", protect, getTaskStats);
router.post("/", protect, validateBody(createTaskSchema), createTask);
router.get("/", protect, getAllTasks);
router.get("/:id", protect, getSingleTask);
router.patch("/:id", protect, validateBody(updateTaskSchema), updateTask);
router.delete("/:id", protect, deleteTask);

module.exports = router;

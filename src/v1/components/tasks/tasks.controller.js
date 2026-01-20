const Task = require("./tasks.model");

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignee } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required"
      });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "pending",
      priority: priority || "medium",
      dueDate,
      assignee: assignee || null,
      createdBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task
    });

  } catch (error) {
    console.error("Create task error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid assignee ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    const filter = {};

    if (req.user.role !== "admin") {
      filter.$or = [
        { createdBy: req.user.id },
        { assignee: req.user.id }
      ];
    }

    if (status) {
      filter.status = status;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = filter.$or
        ? [
          ...filter.$or,
          {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } }
            ]
          }
        ]
        : [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } }
        ];
    }

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .populate("assignee", "name email");

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });

  } catch (error) {
    console.error("Get all tasks error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getSingleTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate("createdBy", "name email role")
      .populate("assignee", "name email role");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const isOwner = task.createdBy._id.toString() === req.user.id;
    const isAssignee =
      task.assignee &&
      task.assignee._id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAssignee && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this task"
      });
    }

    return res.status(200).json({
      success: true,
      task
    });

  } catch (error) {
    console.error("Get single task error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const isOwner = task.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    const isAssignee =
      task.assignee &&
      task.assignee.toString() === req.user.id;

    if (!isOwner && !isAssignee && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this task"
      });
    }

    // Assignee can only update status
    if (isAssignee && !isOwner && !isAdmin) {
      const allowedFields = ["status"];

      const invalidFields = Object.keys(updates).filter(
        field => !allowedFields.includes(field)
      );

      if (invalidFields.length > 0) {
        return res.status(403).json({
          success: false,
          message: "Assignee can only update task status"
        });
      }
    }

    Object.assign(task, updates);
    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task
    });

  } catch (error) {
    console.error("Update task error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    const matchStage = {};

    if (req.user.role !== "admin") {
      matchStage.$or = [
        { createdBy: req.user.id },
        { assignee: req.user.id }
      ];
    }

    const stats = await Task.aggregate([
      { $match: matchStage },

      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in_progress"] }, 1, 0] }
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] }
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] }
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      lowPriority: 0,
      mediumPriority: 0,
      highPriority: 0
    };

    return res.status(200).json({
      success: true,
      stats: result
    });

  } catch (error) {
    console.error("Task stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    const isOwner = task.createdBy.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this task"
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully"
    });

  } catch (error) {
    console.error("Delete task error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


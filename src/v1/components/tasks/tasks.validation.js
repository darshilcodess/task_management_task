const Joi = require("joi");

exports.createTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .max(500)
    .optional(),

  status: Joi.string()
    .valid("pending", "in_progress", "completed")
    .optional(),

  priority: Joi.string()
    .valid("low", "medium", "high")
    .optional(),

  dueDate: Joi.date()
    .iso()
    .optional(),

  assignee: Joi.string()
    .hex()
    .length(24)
    .optional() 
});

exports.updateTaskSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .optional(),

  description: Joi.string()
    .trim()
    .max(500)
    .optional(),

  status: Joi.string()
    .valid("pending", "in_progress", "completed")
    .optional(),

  priority: Joi.string()
    .valid("low", "medium", "high")
    .optional(),

  dueDate: Joi.date()
    .iso()
    .optional(),

  assignee: Joi.string()
    .hex()
    .length(24)
    .optional()
})
.min(1);

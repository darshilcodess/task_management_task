const Joi = require("joi");

exports.registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required(),

    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .pattern(/[A-Z]/, "uppercase letter")
        .pattern(/[a-z]/, "lowercase letter")
        .pattern(/[0-9]/, "number")
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters",
            "string.pattern.name": "Password must include {#name}"
        }),

  role: Joi.string()
        .valid("user", "admin")
        .optional()
        .default("user"),
});

exports.loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),

    password: Joi.string()
        .min(8)
        .required()
});


const express = require('express');
const router = express.Router();

const { register, login, getProfile, logout, refreshToken } = require("./auth.controller");

const { protect } = require("../../../middleware/auth-handler");
const { validateBody } = require("../../../middleware/validate");
const { registerSchema, loginSchema } = require("./auth.validation");
const { authLimiter } = require("../../../middleware/rate-limiter");

router.post("/register", authLimiter, validateBody(registerSchema), register);
router.post("/login",authLimiter, validateBody(loginSchema), login);
router.get("/me", protect, getProfile);
router.post("/logout", protect, logout);
router.post('/refresh', refreshToken);

module.exports = router;
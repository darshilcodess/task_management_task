const express = require('express');
const router = express.Router();

const userRoutes = require('../../v1/components/users/users.routes');
const authRoutes = require('../../v1/components/auth/auth.route');
const taskRoutes = require("../../v1/components/tasks/tasks.route");

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;

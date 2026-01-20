const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole, deleteUser } = require('./users.controller');
const { protect } = require('../../../middleware/auth-handler');
const { adminOnly } = require("../../../middleware/role-handler");

router.get("/", protect, adminOnly, getAllUsers);
router.patch("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;

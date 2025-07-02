const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserBan,
  resetUserPassword,
  getDashboardStats,
  promoteToAdmin,
  cancelOrderWithRefund
} = require('../controllers/adminController');

// Middleware to protect all admin routes
router.use(protect);
router.use(adminOnly);

// Routes
router.get('/stats', getDashboardStats);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/cancel', cancelOrderWithRefund);
router.get('/users', getAllUsers);
router.put('/users/:id/ban', toggleUserBan);
router.put('/users/:id/reset-password', resetUserPassword);
router.put('/users/:id/promote', promoteToAdmin);

module.exports = router;

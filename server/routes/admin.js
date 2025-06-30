const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// Middleware to protect all admin routes
router.use(protect);
router.use(adminOnly);

// @desc    Get database statistics
// @route   GET /api/admin/stats
// @access  Admin only
const getStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments();
    const scheduleCount = await Schedule.countDocuments();
    const orderCount = await Order.countDocuments();
    
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);
    const recentOrders = await Order.find().populate('userId', 'username email').sort({ createdAt: -1 }).limit(5);
    const recentSchedules = await Schedule.find().populate('userId', 'username email').sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          users: userCount,
          schedules: scheduleCount,
          orders: orderCount
        },
        recent: {
          users: recentUsers,
          orders: recentOrders,
          schedules: recentSchedules
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin only
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments();

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Admin only
const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = status ? { status } : {};
    
    const orders = await Order.find(query)
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all schedules
// @route   GET /api/admin/schedules
// @access  Admin only
const getSchedules = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = status ? { status } : {};
    
    const schedules = await Schedule.find(query)
      .populate('userId', 'username email')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Schedule.countDocuments(query);

    res.json({
      success: true,
      data: {
        schedules,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Admin only
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('userId', 'username email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
};

// Routes
router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/orders', getOrders);
router.get('/schedules', getSchedules);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;

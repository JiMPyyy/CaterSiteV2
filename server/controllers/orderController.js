const Order = require('../models/Order');
const { sendOrderNotification } = require('../services/emailService');

// @desc    Get all orders for the authenticated user
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    
    // Build query
    const query = { userId: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.deliveryDate = {};
      if (startDate) {
        query.deliveryDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.deliveryDate.$lte = new Date(endDate);
      }
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username email');

    // Get total count for pagination
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'username email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, deliveryDate, deliveryTime, deliveryAddress, specialInstructions } = req.body;

    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);

    const orderData = {
      userId: req.user._id,
      items,
      totalAmount,
      deliveryDate,
      deliveryTime,
      deliveryAddress,
      specialInstructions
    };

    const order = await Order.create(orderData);

    // Populate user data
    await order.populate('userId', 'username email');

    // Send email notification
    try {
      await sendOrderNotification(order, req.user);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res, next) => {
  try {
    let order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be updated (only pending orders can be fully updated)
    if (order.status !== 'pending' && req.body.items) {
      return res.status(400).json({
        success: false,
        message: 'Cannot modify items of a confirmed order'
      });
    }

    // If items are being updated, recalculate total
    if (req.body.items) {
      req.body.totalAmount = req.body.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    }

    order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('userId', 'username email');

    res.json({
      success: true,
      message: 'Order updated successfully',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  cancelOrder
};

const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/email');
const { refundPayment } = require('../services/stripeService');

// @desc    Get all orders for admin dashboard
// @route   GET /api/admin/orders
// @access  Admin only
const getAllOrders = async (req, res, next) => {
  try {
    const { status, date, page = 1, limit = 20 } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.deliveryDate = { $gte: startDate, $lt: endDate };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get orders with user information
    const orders = await Order.find(filter)
      .populate('userId', 'username email phone isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders,
          hasNext: page < totalPages,
          hasPrev: page > 1
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
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findById(id).populate('userId', 'email username');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    if (notes) {
      order.adminNotes = notes;
    }
    order.updatedAt = new Date();

    await order.save();

    // Send email notification to customer
    if (order.userId && order.userId.email) {
      const emailSubject = `Order ${order.orderNumber} - Status Update`;
      const emailBody = `
        <h2>Order Status Update</h2>
        <p>Hello ${order.userId.username},</p>
        <p>Your order <strong>#${order.orderNumber}</strong> status has been updated to: <strong>${status.toUpperCase()}</strong></p>
        ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
        <p>Thank you for choosing CaterVegas!</p>
      `;

      try {
        await sendEmail(order.userId.email, emailSubject, emailBody);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    res.json({
      success: true,
      data: { order },
      message: 'Order status updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users for admin management
// @route   GET /api/admin/users
// @access  Admin only
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    
    // Build filter object
    const filter = {};
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (status === 'active') filter.isActive = true;
    if (status === 'banned') filter.isActive = false;

    // Calculate pagination
    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ban/Unban user
// @route   PUT /api/admin/users/:id/ban
// @access  Admin only
const toggleUserBan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from banning themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot ban yourself'
      });
    }

    // Prevent banning other admins
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot ban admin users'
      });
    }

    const wasBanned = !user.isActive;
    user.isActive = !user.isActive;
    await user.save();

    // Send email notification
    if (user.email) {
      const action = user.isActive ? 'reactivated' : 'suspended';
      const emailSubject = `Account ${action.charAt(0).toUpperCase() + action.slice(1)}`;
      const emailBody = `
        <h2>Account ${action.charAt(0).toUpperCase() + action.slice(1)}</h2>
        <p>Hello ${user.username},</p>
        <p>Your CaterVegas account has been ${action}.</p>
        ${reason && !user.isActive ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        ${!user.isActive ? '<p>If you believe this is an error, please contact support.</p>' : '<p>You can now access your account normally.</p>'}
      `;
      
      try {
        await sendEmail(user.email, emailSubject, emailBody);
      } catch (emailError) {
        console.error('Failed to send ban/unban email:', emailError);
      }
    }

    res.json({
      success: true,
      data: { user },
      message: `User ${user.isActive ? 'unbanned' : 'banned'} successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/reset-password
// @access  Admin only
const resetUserPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newPassword, sendEmail: shouldSendEmail = true } = req.body;

    console.log(`🔑 Password reset request for user ID: ${id}`);
    console.log(`🔑 Request body:`, { newPassword: newPassword ? '[PROVIDED]' : '[EMPTY]', shouldSendEmail });

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate random password if none provided, or validate provided password
    let password;
    if (newPassword && newPassword.trim()) {
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters long'
        });
      }
      password = newPassword;
    } else {
      // Generate random password
      password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-4).toUpperCase();
    }

    console.log(`🔑 Resetting password for user: ${user.username} (${user.email})`);
    console.log(`🔑 Generated password: ${password}`);
    
    user.password = password;
    await user.save();

    // Send email with new password
    if (shouldSendEmail && user.email) {
      console.log(`📧 Preparing to send password reset email to: ${user.email}`);

      const emailSubject = 'Password Reset - CaterVegas';
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset</h2>
          <p>Hello ${user.username},</p>
          <p>Your password has been reset by an administrator.</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>New Password:</strong> <code style="background: #fff; padding: 2px 5px; border-radius: 3px; font-size: 16px;">${password}</code></p>
          </div>
          <p style="color: #d32f2f;"><strong>Important:</strong> Please log in and change your password immediately for security.</p>
          <p>If you did not request this reset, please contact support immediately.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `;

      try {
        console.log(`📧 Sending password reset email...`);
        const emailResult = await sendEmail(user.email, emailSubject, emailBody);
        console.log(`✅ Password reset email sent successfully:`, emailResult);
      } catch (emailError) {
        console.error('❌ Failed to send password reset email:', emailError);
      }
    } else {
      console.log(`⚠️  Email not sent - shouldSendEmail: ${shouldSendEmail}, user.email: ${user.email}`);
    }

    res.json({
      success: true,
      message: 'Password reset successfully',
      data: { 
        newPassword: password,
        emailSent: shouldSendEmail && user.email ? true : false
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin only
const getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Get various statistics
    const [
      totalUsers,
      activeUsers,
      totalOrders,
      todayOrders,
      pendingOrders,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ 
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          banned: totalUsers - activeUsers
        },
        orders: {
          total: totalOrders,
          today: todayOrders,
          pending: pendingOrders
        },
        revenue: {
          total: totalRevenue[0]?.total || 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Promote user to admin
// @route   PUT /api/admin/users/:id/promote
// @access  Admin only
const promoteToAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin'
      });
    }

    user.role = 'admin';
    await user.save();

    // Send email notification
    if (user.email) {
      const emailSubject = 'Admin Access Granted - CaterVegas';
      const emailBody = `
        <h2>Admin Access Granted</h2>
        <p>Hello ${user.username},</p>
        <p>You have been granted administrator access to CaterVegas.</p>
        <p>You can now access the admin dashboard to manage orders and users.</p>
        <p>Please use this access responsibly.</p>
      `;

      try {
        await sendEmail(user.email, emailSubject, emailBody);
      } catch (emailError) {
        console.error('Failed to send admin promotion email:', emailError);
      }
    }

    res.json({
      success: true,
      data: { user },
      message: 'User promoted to admin successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order and process refund
// @route   PUT /api/admin/orders/:id/cancel
// @access  Admin only
const cancelOrderWithRefund = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, refundAmount, notifyCustomer = true } = req.body;

    const order = await Order.findById(id).populate('userId', 'email username');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    if (order.status === 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel a delivered order'
      });
    }

    console.log(`🚫 Cancelling order ${order.orderNumber} for user ${order.userId.username}`);
    console.log(`💰 Payment Intent ID: ${order.paymentIntentId}`);

    let refundResult = null;
    let refundError = null;

    // Process refund if payment was made
    if (order.paymentIntentId && order.paymentStatus === 'succeeded') {
      try {
        console.log(`💳 Processing refund for payment intent: ${order.paymentIntentId}`);

        // Use custom refund amount or full amount
        const amountToRefund = refundAmount || order.totalAmount;

        refundResult = await refundPayment(order.paymentIntentId, amountToRefund);

        if (refundResult.success) {
          console.log(`✅ Refund successful: ${refundResult.refundId}`);
          order.refundId = refundResult.refundId;
          order.refundAmount = amountToRefund;
          order.refundStatus = refundResult.status;
        } else {
          console.error(`❌ Refund failed: ${refundResult.error}`);
          refundError = refundResult.error;
        }
      } catch (error) {
        console.error('❌ Refund processing error:', error);
        refundError = error.message;
      }
    } else {
      console.log('ℹ️  No payment to refund (payment not completed or no payment intent)');
    }

    // Update order status
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    order.cancelledBy = req.user._id;

    if (refundError) {
      order.adminNotes = `${order.adminNotes || ''}\nRefund failed: ${refundError}`;
    }

    await order.save();

    // Send email notification to customer
    if (notifyCustomer && order.userId && order.userId.email) {
      const emailSubject = `Order Cancelled - #${order.orderNumber}`;
      const emailBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Order Cancelled</h2>
          <p>Hello ${order.userId.username},</p>
          <p>Your order <strong>#${order.orderNumber}</strong> has been cancelled.</p>

          ${reason ? `<div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Reason:</strong> ${reason}</p>
          </div>` : ''}

          ${refundResult && refundResult.success ? `
            <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Refund Information:</strong></p>
              <p>• Amount: $${(refundAmount || order.totalAmount).toFixed(2)}</p>
              <p>• Refund ID: ${refundResult.refundId}</p>
              <p>• Status: ${refundResult.status}</p>
              <p>The refund will appear on your original payment method within 5-10 business days.</p>
            </div>
          ` : ''}

          ${refundError ? `
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <p><strong>Refund Issue:</strong></p>
              <p>There was an issue processing your refund automatically. Our team will process it manually and contact you within 24 hours.</p>
            </div>
          ` : ''}

          <p>If you have any questions, please contact our support team.</p>
          <p>Thank you for your understanding.</p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `;

      try {
        await sendEmail(order.userId.email, emailSubject, emailBody);
        console.log(`📧 Cancellation email sent to ${order.userId.email}`);
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
      }
    }

    res.json({
      success: true,
      data: {
        order,
        refund: refundResult
      },
      message: refundResult && refundResult.success
        ? 'Order cancelled and refund processed successfully'
        : refundError
          ? 'Order cancelled but refund failed - will be processed manually'
          : 'Order cancelled successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserBan,
  resetUserPassword,
  getDashboardStats,
  promoteToAdmin,
  cancelOrderWithRefund
};

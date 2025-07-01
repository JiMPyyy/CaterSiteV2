const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    console.log('Auth middleware - Headers:', req.headers.authorization);

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth middleware - Token extracted:', token ? 'Present' : 'Missing');
    }

    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    console.log('Auth middleware - Verifying token...');
    const decoded = verifyToken(token);
    console.log('Auth middleware - Token decoded:', decoded);

    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    console.log('Auth middleware - User found:', user ? user.username : 'Not found');

    if (!user) {
      console.log('Auth middleware - User not found for ID:', decoded.userId);
      return res.status(401).json({
        success: false,
        message: 'Token is valid but user not found'
      });
    }

    if (!user.isActive) {
      console.log('Auth middleware - User account deactivated:', user.username);
      return res.status(401).json({
        success: false,
        message: 'User account is deactivated'
      });
    }

    // Add user to request object
    req.user = user;
    console.log('Auth middleware - Authentication successful for:', user.username);
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Admin only access
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

module.exports = {
  protect,
  adminOnly
};

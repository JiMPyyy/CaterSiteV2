// Validation middleware for user registration
const validateRegistration = (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  const errors = [];

  // Username validation
  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  if (username && username.length > 30) {
    errors.push('Username cannot exceed 30 characters');
  }

  // Email validation
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  // Confirm password validation
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for user login
const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for schedule creation
const validateSchedule = (req, res, next) => {
  const { title, date, time } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  }
  if (title && title.length > 100) {
    errors.push('Title cannot exceed 100 characters');
  }

  if (!date) {
    errors.push('Date is required');
  } else {
    const scheduleDate = new Date(date);
    if (isNaN(scheduleDate.getTime())) {
      errors.push('Please enter a valid date');
    } else if (scheduleDate < new Date().setHours(0, 0, 0, 0)) {
      errors.push('Schedule date cannot be in the past');
    }
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!time || !timeRegex.test(time)) {
    errors.push('Please enter a valid time in HH:MM format');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

// Validation middleware for order creation
const validateOrder = (req, res, next) => {
  const { items, deliveryDate, deliveryTime, deliveryAddress } = req.body;
  const errors = [];

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('At least one item is required');
  }

  if (!deliveryDate) {
    errors.push('Delivery date is required');
  } else {
    const orderDate = new Date(deliveryDate);
    if (isNaN(orderDate.getTime())) {
      errors.push('Please enter a valid delivery date');
    } else if (orderDate < new Date().setHours(0, 0, 0, 0)) {
      errors.push('Delivery date cannot be in the past');
    }
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!deliveryTime || !timeRegex.test(deliveryTime)) {
    errors.push('Please enter a valid delivery time in HH:MM format');
  }

  if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || 
      !deliveryAddress.state || !deliveryAddress.zipCode) {
    errors.push('Complete delivery address is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateSchedule,
  validateOrder
};

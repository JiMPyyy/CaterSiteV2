const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;

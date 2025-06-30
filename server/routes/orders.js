const express = require('express');
const router = express.Router();

const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  cancelOrder
} = require('../controllers/orderController');

const { protect } = require('../middleware/auth');
const { validateOrder } = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getOrders)
  .post(validateOrder, createOrder);

router.route('/:id')
  .get(getOrder)
  .put(updateOrder);

router.put('/:id/cancel', cancelOrder);

module.exports = router;

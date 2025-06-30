const express = require('express');
const router = express.Router();

const {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require('../controllers/scheduleController');

const { protect } = require('../middleware/auth');
const { validateSchedule } = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Routes
router.route('/')
  .get(getSchedules)
  .post(validateSchedule, createSchedule);

router.route('/:id')
  .get(getSchedule)
  .put(updateSchedule)
  .delete(deleteSchedule);

module.exports = router;

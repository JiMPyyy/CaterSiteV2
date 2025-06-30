const Schedule = require('../models/Schedule');

// @desc    Get all schedules for the authenticated user
// @route   GET /api/schedules
// @access  Private
const getSchedules = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    
    // Build query
    const query = { userId: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Execute query with pagination
    const schedules = await Schedule.find(query)
      .sort({ date: 1, time: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username email');

    // Get total count for pagination
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

// @desc    Get single schedule
// @route   GET /api/schedules/:id
// @access  Private
const getSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'username email');

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    res.json({
      success: true,
      data: {
        schedule
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new schedule
// @route   POST /api/schedules
// @access  Private
const createSchedule = async (req, res, next) => {
  try {
    const scheduleData = {
      ...req.body,
      userId: req.user._id
    };

    const schedule = await Schedule.create(scheduleData);
    
    // Populate user data
    await schedule.populate('userId', 'username email');

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: {
        schedule
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update schedule
// @route   PUT /api/schedules/:id
// @access  Private
const updateSchedule = async (req, res, next) => {
  try {
    let schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('userId', 'username email');

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      data: {
        schedule
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete schedule
// @route   DELETE /api/schedules/:id
// @access  Private
const deleteSchedule = async (req, res, next) => {
  try {
    const schedule = await Schedule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      });
    }

    await Schedule.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
};

const GlobalNotice = require('../models/GlobalNotice');

// @desc    Get all global notices
// @route   GET /api/global-notices
const getGlobalNotices = async (req, res) => {
  try {
    const notices = await GlobalNotice.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a global notice (Admin Only)
// @route   POST /api/global-notices
const createGlobalNotice = async (req, res) => {
  try {
    const ADMIN_EMAIL = 'pathummadhusanka62@gmail.com';

    if (!req.user || req.user.email.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase()) {
      return res.status(403).json({ message: 'Access Denied: Only Admin can post notices!' });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message is required' });
    
    const notice = await GlobalNotice.create({
      message,
      user: req.user._id
    });

    const populatedNotice = await GlobalNotice.findById(notice._id).populate('user', 'name email');
    res.status(201).json(populatedNotice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 Delete Notice Function (Admin Only)
// @route   DELETE /api/global-notices/:id
const deleteGlobalNotice = async (req, res) => {
  try {
    const ADMIN_EMAIL = 'pathummadhusanka62@gmail.com';

    if (!req.user || req.user.email.trim().toLowerCase() !== ADMIN_EMAIL.trim().toLowerCase()) {
      return res.status(403).json({ message: 'Access Denied: Only Admin can delete notices!' });
    }

    const notice = await GlobalNotice.findById(req.params.id);

    if (notice) {
      await notice.deleteOne();
      res.json({ message: 'Notice removed' });
    } else {
      res.status(404).json({ message: 'Notice not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGlobalNotices, createGlobalNotice, deleteGlobalNotice };
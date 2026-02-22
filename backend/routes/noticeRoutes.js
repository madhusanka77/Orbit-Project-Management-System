const express = require('express');
const router = express.Router();
const GlobalNotice = require('../models/GlobalNotice');
const { protect } = require('../middleware/authMiddleware');

// Get all notices
router.get('/', protect, async (req, res) => {
  const notices = await GlobalNotice.find().populate('user', 'name').sort({ createdAt: -1 });
  res.json(notices);
});

// Create notice (Admin only logic can be added here if needed)
router.post('/', protect, async (req, res) => {
  const { message } = req.body;
  const notice = await GlobalNotice.create({ message, user: req.user._id });
  const fullNotice = await GlobalNotice.findById(notice._id).populate('user', 'name');
  res.status(201).json(fullNotice);
});

// Delete notice
router.delete('/:id', protect, async (req, res) => {
  const notice = await GlobalNotice.findById(req.params.id);
  if (notice) {
    await notice.deleteOne();
    res.json({ message: 'Notice removed' });
  } else {
    res.status(404).json({ message: 'Notice not found' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { 
  getGlobalNotices, 
  createGlobalNotice, 
  deleteGlobalNotice 
} = require('../controllers/globalNoticeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getGlobalNotices)
  .post(protect, createGlobalNotice);

router.route('/:id')
  .delete(protect, deleteGlobalNotice);

module.exports = router;
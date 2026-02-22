const express = require('express');
const { 
  registerUser, 
  authUser, 
  verifyEmail, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); 

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/verify/:token', verifyEmail);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('pic'), updateUserProfile); 

module.exports = router;
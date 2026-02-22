const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { 
  getProjects, createProject, deleteProject, getProjectById, 
  addMember, addTask, updateTask, deleteTask, 
  addNotice, deleteNotice 
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

router.route('/').get(protect, getProjects).post(protect, createProject);
router.route('/:id').get(protect, getProjectById).delete(protect, deleteProject);
router.post('/:id/members', protect, addMember);

router.post('/:id/tasks', protect, addTask);
router.route('/:id/tasks/:taskId').put(protect, updateTask).delete(protect, deleteTask);

router.post('/:id/notices', protect, upload.single('file'), addNotice);
router.delete('/:id/notices/:noticeId', protect, deleteNotice);

module.exports = router;
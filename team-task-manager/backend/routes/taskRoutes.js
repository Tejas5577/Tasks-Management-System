const express = require('express');
const router = express.Router();
const { createTask, updateTaskStatus, getProjectTasks } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, createTask);
router.get('/project/:projectId', protect, getProjectTasks);
router.put('/:id/status', protect, updateTaskStatus);

module.exports = router;
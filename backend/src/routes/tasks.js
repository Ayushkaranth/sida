const express = require('express');
const { authenticate } = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    const { page = '1', projectId } = req.query;
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    const query = {};
    if (projectId) query.projectId = projectId;

    const tasks = await Task.find(query).populate('projectId', 'title').skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Task.countDocuments(query);

    res.json({ tasks, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

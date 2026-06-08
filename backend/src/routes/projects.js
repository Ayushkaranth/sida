const express = require('express');
const { authenticate } = require('../middleware/auth');
const Project = require('../models/Project');
const connectDB = require('../lib/db');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  try {
    await connectDB();
    const { search, page = '1' } = req.query;
    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' };
    if (req.user.role !== 'admin') query.createdBy = req.user.id;

    const projects = await Project.find(query).populate('createdBy', 'name email').skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Project.countDocuments(query);

    res.json({ projects, totalPages: Math.ceil(total / limit), total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    await connectDB();
    const project = await Project.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    await connectDB();
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && project.createdBy.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

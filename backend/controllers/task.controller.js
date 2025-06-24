const Task = require('../models/task.model.js');

// @desc    Get tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json(tasks);
};

// @desc    Set task
// @route   POST /api/tasks
// @access  Private
const setTask = async (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ message: 'Please add a title' });
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    user: req.user.id,
    dueDate: req.body.dueDate
  });

  res.status(200).json(task);
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(400).json({ message: 'Task not found' });
  }

  // Check for user
  if (!req.user) {
    res.status(401).json({ message: 'User not found' });
  }

  // Make sure the logged in user matches the task user
  if (task.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  res.status(200).json(updatedTask);
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(400).json({ message: 'Task not found' });
  }

  // Check for user
  if (!req.user) {
    res.status(401).json({ message: 'User not found' });
  }

  // Make sure the logged in user matches the task user
  if (task.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
  }

  await task.deleteOne({ id: req.params.id });

  res.status(200).json({ id: req.params.id });
};

module.exports = {
  getTasks,
  setTask,
  updateTask,
  deleteTask
};
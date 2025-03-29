const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const projectRoutes = require('./project.routes');
const photoRoutes = require('./photo.routes');
const styleRoutes = require('./style.routes');
const editRoutes = require('./edit.routes');
const chatRoutes = require('./chat.routes');
const paymentRoutes = require('./payment.routes');

// Use route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/projects', projectRoutes);
router.use('/photos', photoRoutes);
router.use('/styles', styleRoutes);
router.use('/edits', editRoutes);
router.use('/chat', chatRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;

const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo.controller');
const authenticate = require('../middleware/authenticate');

// Upload photos to a project
router.post('/projects/:projectId/upload', authenticate, photoController.uploadPhotos);

// Get all photos for a project
router.get('/projects/:projectId', authenticate, photoController.getProjectPhotos);

// Delete a photo
router.delete('/:id', authenticate, photoController.deletePhoto);

module.exports = router;

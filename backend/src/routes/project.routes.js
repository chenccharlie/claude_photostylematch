const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const projectController = require('../controllers/project.controller');
const authenticate = require('../middleware/authenticate');
const validateRequest = require('../middleware/validateRequest');

// Create a new project
router.post(
  '/',
  authenticate,
  [
    body('name').notEmpty().withMessage('Project name is required'),
    body('description').optional()
  ],
  validateRequest,
  projectController.createProject
);

// Get all projects
router.get('/', authenticate, projectController.getProjects);

// Get a specific project
router.get('/:id', authenticate, projectController.getProject);

// Update a project
router.put(
  '/:id',
  authenticate,
  [
    body('name').optional(),
    body('description').optional(),
    body('status').optional().isIn(['draft', 'processing', 'completed', 'failed'])
      .withMessage('Status must be one of: draft, processing, completed, failed')
  ],
  validateRequest,
  projectController.updateProject
);

// Delete a project
router.delete('/:id', authenticate, projectController.deleteProject);

module.exports = router;

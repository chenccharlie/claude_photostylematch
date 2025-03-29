const { Project, Photo, Style, Edit, ChatMessage } = require('../models');
const logger = require('../utils/logger');

/**
 * Create a new project
 */
exports.createProject = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    
    // Create a new project
    const project = await Project.create({
      userId: req.user.id,
      name,
      description,
      status: 'draft'
    });

    return res.status(201).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects for the current user
 */
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Photo,
          as: 'photos',
          attributes: ['id', 'type', 'originalFilename']
        }
      ]
    });

    return res.status(200).json({
      status: 'success',
      data: projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific project by ID
 */
exports.getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOne({
      where: { id, userId: req.user.id },
      include: [
        {
          model: Photo,
          as: 'photos',
          attributes: ['id', 'type', 'originalFilename', 'storagePath', 'format', 'size', 'width', 'height']
        },
        {
          model: Style,
          as: 'styles',
          attributes: ['id', 'name', 'description', 'llmAnalysisText', 'confirmedByUser', 'parameterAdjustments']
        },
        {
          model: Edit,
          as: 'edits',
          attributes: ['id', 'photoId', 'styleId', 'status', 'originalPhotoUrl', 'editedPhotoUrl', 'parametersApplied', 'completedAt', 'errorMessage']
        },
        {
          model: ChatMessage,
          as: 'chatMessages',
          attributes: ['id', 'sender', 'message', 'createdAt'],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a project
 */
exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    const project = await Project.findOne({
      where: { id, userId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    // Update fields if provided
    if (name !== undefined) {
      project.name = name;
    }
    if (description !== undefined) {
      project.description = description;
    }
    if (status !== undefined && ['draft', 'processing', 'completed', 'failed'].includes(status)) {
      project.status = status;
    }

    await project.save();

    return res.status(200).json({
      status: 'success',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a project
 */
exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findOne({
      where: { id, userId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }

    // In a real implementation, we would also need to:
    // 1. Delete all associated photos from storage
    // 2. Delete all associated records (photos, styles, edits, chat messages)
    // This could be handled with database cascading deletes or explicitly here

    await project.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const { Photo, Project } = require('../models');
const logger = require('../utils/logger');

/**
 * Upload photos to a project
 * Note: This is a placeholder. In a real implementation, we would:
 * 1. Handle the file upload (using multer or similar)
 * 2. Process the image (validate, resize, etc.)
 * 3. Upload to storage (GCS or Adobe Lightroom)
 * 4. Save the photo metadata to the database
 */
exports.uploadPhotos = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { type } = req.query; // 'reference' or 'target'
    
    // Validate type
    if (!['reference', 'target'].includes(type)) {
      return res.status(400).json({
        status: 'error',
        message: 'Photo type must be either "reference" or "target"'
      });
    }
    
    // Check if project exists and belongs to user
    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    // In a real implementation, we would process the uploaded files here
    // For now, just log the request and return a placeholder response
    logger.info(`Photo upload request for project ${projectId} with type ${type}`);
    
    return res.status(200).json({
      status: 'success',
      message: 'This endpoint is a placeholder for photo upload functionality',
      data: {
        uploadUrl: 'https://placeholder-upload-url.com' // In a real implementation, this would be a signed URL
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all photos for a project
 */
exports.getProjectPhotos = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { type } = req.query; // Optional filter by type
    
    // Check if project exists and belongs to user
    const project = await Project.findOne({
      where: { id: projectId, userId: req.user.id }
    });

    if (!project) {
      return res.status(404).json({
        status: 'error',
        message: 'Project not found'
      });
    }
    
    // Query parameters for photos
    const queryParams = { projectId };
    if (type && ['reference', 'target'].includes(type)) {
      queryParams.type = type;
    }
    
    // Get photos
    const photos = await Photo.findAll({
      where: queryParams,
      order: [['createdAt', 'ASC']]
    });
    
    return res.status(200).json({
      status: 'success',
      data: photos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a photo
 */
exports.deletePhoto = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Find photo and check if it belongs to user's project
    const photo = await Photo.findOne({
      where: { id },
      include: [
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'userId'],
          where: { userId: req.user.id }
        }
      ]
    });

    if (!photo) {
      return res.status(404).json({
        status: 'error',
        message: 'Photo not found or not authorized'
      });
    }
    
    // In a real implementation, we would also delete the file from storage
    // For now, just delete the database record
    await photo.destroy();
    
    return res.status(200).json({
      status: 'success',
      message: 'Photo deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = (sequelize, DataTypes) => {
  const Edit = sequelize.define('Edit', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'id'
      }
    },
    photoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Photos',
        key: 'id'
      }
    },
    styleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Styles',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'pending'
    },
    originalPhotoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    editedPhotoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parametersApplied: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  });

  Edit.associate = (models) => {
    Edit.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project'
    });

    Edit.belongsTo(models.Photo, {
      foreignKey: 'photoId',
      as: 'photo'
    });

    Edit.belongsTo(models.Style, {
      foreignKey: 'styleId',
      as: 'style'
    });
  };

  return Edit;
};

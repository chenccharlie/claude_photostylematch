module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'processing', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'draft'
    }
  });

  Project.associate = (models) => {
    Project.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });

    Project.hasMany(models.Photo, {
      foreignKey: 'projectId',
      as: 'photos'
    });

    Project.hasMany(models.Style, {
      foreignKey: 'projectId',
      as: 'styles'
    });

    Project.hasMany(models.Edit, {
      foreignKey: 'projectId',
      as: 'edits'
    });

    Project.hasMany(models.ChatMessage, {
      foreignKey: 'projectId',
      as: 'chatMessages'
    });
  };

  return Project;
};

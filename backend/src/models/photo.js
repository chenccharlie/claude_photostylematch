module.exports = (sequelize, DataTypes) => {
  const Photo = sequelize.define('Photo', {
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
    type: {
      type: DataTypes.ENUM('reference', 'target'),
      allowNull: false
    },
    originalFilename: {
      type: DataTypes.STRING,
      allowNull: false
    },
    storagePath: {
      type: DataTypes.STRING,
      allowNull: false
    },
    format: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lightroomCatalogId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lightroomAssetId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Photo.associate = (models) => {
    Photo.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project'
    });

    Photo.hasMany(models.Edit, {
      foreignKey: 'photoId',
      as: 'edits'
    });
  };

  return Photo;
};

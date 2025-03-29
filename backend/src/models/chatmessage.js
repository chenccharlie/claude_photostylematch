module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define('ChatMessage', {
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
    sender: {
      type: DataTypes.ENUM('user', 'system'),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  });

  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project'
    });
  };

  return ChatMessage;
};

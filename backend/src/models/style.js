module.exports = (sequelize, DataTypes) => {
  const Style = sequelize.define('Style', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    llmAnalysisText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    confirmedByUser: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    parameterAdjustments: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {}
    }
  });

  Style.associate = (models) => {
    Style.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project'
    });

    Style.hasMany(models.Edit, {
      foreignKey: 'styleId',
      as: 'edits'
    });
  };

  return Style;
};

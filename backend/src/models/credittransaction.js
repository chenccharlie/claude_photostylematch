module.exports = (sequelize, DataTypes) => {
  const CreditTransaction = sequelize.define('CreditTransaction', {
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
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    transactionType: {
      type: DataTypes.ENUM('purchase', 'use', 'refund', 'bonus'),
      allowNull: false
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  CreditTransaction.associate = (models) => {
    CreditTransaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return CreditTransaction;
};

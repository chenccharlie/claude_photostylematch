const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true // Allow null for social login
    },
    authProvider: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'email'
    },
    authProviderId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    freeEditsUsed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    creditBalance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        // Only hash password if using email authentication
        if (user.password && user.authProvider === 'email') {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
      beforeUpdate: async (user) => {
        // Only hash password if it has been modified
        if (user.changed('password') && user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Project, {
      foreignKey: 'userId',
      as: 'projects'
    });

    User.hasMany(models.CreditTransaction, {
      foreignKey: 'userId',
      as: 'creditTransactions'
    });
  };

  // Instance method to check password
  User.prototype.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  };

  return User;
};

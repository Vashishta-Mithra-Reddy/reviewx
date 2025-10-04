import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  address: {
    type: DataTypes.STRING(400),
    allowNull: false,
    validate: {
      len: [0, 400],
    },
  },
  owner_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});

// Define association
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.hasOne(Store, { foreignKey: 'owner_id' });

export default Store;
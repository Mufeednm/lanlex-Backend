import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';


const User = sequelize.define('users', {
    userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  userName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  emailAddress: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  mobileNumber: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  socialLogin: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0
  },
  otp: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  push_token: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'InActive'),
    allowNull: false,
    defaultValue: 'Active'
  },
  userPicture: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  modified_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false // already handled manually
});

export default User;

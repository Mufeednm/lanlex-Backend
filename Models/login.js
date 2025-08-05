import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';


const Login = sequelize.define('login', {
  loginId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  userName: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  mobileNumber: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  emailAddress: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  otp: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('Admin', 'editor', 'content'),
    allowNull: true,
    defaultValue: 'Admin',
  },
  status: {
    type: DataTypes.ENUM('Active', 'InActive'),
    allowNull: false, 
    defaultValue: 'Active',
  
  },
  craeted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
  },
  modified_at: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
},
}, {
  sequelize,
  tableName: 'login',
  timestamps: false,
});




export default Login;
  
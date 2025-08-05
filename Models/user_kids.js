import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Langauge_pref from './user_kids_langauge_pref.js';


const User_kids = sequelize.define('user_kids', {
    kidId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,

  },
  name: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  
  age: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  dob: {
    type: DataTypes.DATE,
    allowNull: true
  },
  school: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  
  country: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  picture: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Active', 'InActive'),
    allowNull: false,
    defaultValue: 'Active'
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
  tableName: 'user_kids',
  timestamps: false // already handled manually
});
User_kids.hasMany(Langauge_pref, {
  foreignKey: 'kidId',
  as: 'languages'  // ✅ use plural alias for clarity
});

export default User_kids;

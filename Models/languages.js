import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';


const Languages = sequelize.define('languages', {
    languageId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  languageName: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  isoCode: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  languagePicture: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  created_by: {
    type: DataTypes.INTEGER,
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
  tableName: 'languages',
  timestamps: false // already handled manually
});

export default Languages;

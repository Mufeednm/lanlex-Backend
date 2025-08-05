import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';


const Story_p_categories = sequelize.define('story_p_categories', {
  primaryCategoryId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  languageId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  categoryName: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  categoryPicture: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  isPremium: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue:0
  },
  planId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Active', 'InActive'),
    allowNull: false, 
    defaultValue: 'Active',
  
  },
  created_by: {
    type: DataTypes.INTEGER,
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
  tableName: 'story_p_categories',
  timestamps: false // already handled manually
});

export default Story_p_categories;

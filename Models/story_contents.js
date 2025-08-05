import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Story_contents = sequelize.define('story_contents', {
  contentId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  languageId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  primaryCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  secondaryCategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  story: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  storyPicture: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  storyAudio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM('Active', 'InActive'),
    allowNull: false,
    defaultValue: 'Active'
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
  tableName: 'story_contents',
  timestamps: false
});

export default Story_contents;

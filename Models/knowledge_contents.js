import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const knowledge_contents = sequelize.define('knowledge_contents', {
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
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contentImage: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  contentAudio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  referenceAudio: {
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
  tableName: 'knowledge_contents',
  timestamps: false
});

export default knowledge_contents;

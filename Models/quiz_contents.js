import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Quiz_contents = sequelize.define('quiz_contents', {
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
  question: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  questionAudio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  option_1: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  option_1_audio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  option_2: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  option_2_audio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  option_3: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  option_3_audio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  option_4: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  option_4_audio: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  correctAnswer: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  questionPicture: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  time: {
    type: DataTypes.INTEGER,
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
  tableName: 'quiz_contents',
  timestamps: false
});

export default Quiz_contents;

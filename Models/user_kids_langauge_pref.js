import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User_kids from './user_kids.js';
import Languages from './languages.js';


const Langauge_pref = sequelize.define('user_kids_langauge_pref', {
  preferenceId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  kidId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  languageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
  tableName: 'user_kids_langauge_pref',
  timestamps: false // already handled manually
}); 
Langauge_pref.belongsTo(Languages, { foreignKey: 'languageId', as: 'language' });
export default Langauge_pref;

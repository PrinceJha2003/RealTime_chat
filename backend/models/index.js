const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('chat_app', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// User Model
const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING
});

// Message Model
const Message = sequelize.define('Message', {
  sender: DataTypes.INTEGER,
  recipient: DataTypes.INTEGER,
  groupId: DataTypes.INTEGER,
  content: DataTypes.TEXT,
  read: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Group Model
const Group = sequelize.define('Group', {
  name: DataTypes.STRING
});

// Sync DB (tables ban jayenge automatically)
sequelize.sync();

module.exports = { sequelize, User, Message, Group };


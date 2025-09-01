// db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app",
});

db.connect((err) => {
  if (err) console.log("MySQL Connection Failed:", err);
  else console.log("MySQL Connected...");
});

module.exports = db;

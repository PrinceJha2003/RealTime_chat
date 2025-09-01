const express = require("express");
const router = express.Router();
const db = require("../db"); // make sure db.js exists in backend root
const bcrypt = require("bcrypt");

// ------------------------
// REGISTER
// ------------------------
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error in Register:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ error: "Username already exists" });
        }
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "User registered successfully!" });
    });
  } catch (error) {
    console.error("Server error in Register:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// ------------------------
// LOGIN
// ------------------------
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Error in Login:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Send user info (id and username) to frontend
    res.json({
      message: "Login successful!",
      user: { id: user.id, username: user.username },
    });
  });
});

module.exports = router;

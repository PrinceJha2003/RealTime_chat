const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chat_app",
});

db.connect(err => {
  if (err) console.log("MySQL Connection Failed:", err);
  else console.log("MySQL Connected...");
});

// Auth routes
const authRoutes = require("./api/auth");
app.use("/api", authRoutes);

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend
    methods: ["GET", "POST"],
  },
});

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (msg) => {
    io.emit("receive_message", msg); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(5000, () => console.log("Server running on port 5000"));

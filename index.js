// Import necessary modules
const express = require("express");
const cors = require("cors");
const path = require("path");
const router = require("./src/Routes");
const { PORT } = require("./src/Globals/variables");
const {
  authorize,
  listFiles,
} = require("./src/Globals/GoogleAuths/GoogleAuthFunctions");

// Authorize and list files on startup
authorize().then(listFiles).catch(console.error);

// Initialize Express application
const app = express();

// Enable CORS
app.use(cors());

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Middleware for serving static files
app.use("/public", express.static(path.join(__dirname, "uploads")));

// Use router for handling routes
app.use("/", router);

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

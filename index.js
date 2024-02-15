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

app.use("/", router);

// Start the server on port 5000
app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server running on ${5000}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(err);
});

// Handle uncaught promise rejections
process.on("unhandledRejection", (err) => {
  console.log(err);
});

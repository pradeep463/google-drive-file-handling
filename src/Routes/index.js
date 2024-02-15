const express = require("express");

// Import the fileHandlingRoutes from the separate file
const { fileHandlingRoutes } = require("./fileHandlingRoutes");

const router = express.Router();

// Define an array containing all route configurations
const allRoutes = [fileHandlingRoutes];

// Iterate over each set of routes in the allRoutes array
allRoutes.forEach((routes) => {
  // Iterate over each route in the current set of routes
  routes.forEach((route) => {
    const { type, route: routePath, base, controller } = route;

    // Concatenate the base path with the route path to get the full route path
    const fullPath = base + routePath;

    // Switch based on the HTTP method specified in the route
    switch (type.toUpperCase()) {
      case "GET":
        // Set up a GET route using router.get()
        router.get(fullPath, controller);
        break;

      case "POST":
        // Set up a POST route using router.post()
        router.post(fullPath, controller);
        break;

      default:
        // Log a warning for unsupported HTTP methods
        console.warn(`Unsupported HTTP method: ${type}`);
    }
  });
});

// Export the router to be used in other parts of the application
module.exports = router;

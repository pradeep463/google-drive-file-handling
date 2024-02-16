const fs = require("fs");

// Path to the JSON file where API call data is stored
const FILEPATH = "uploads/progress.json";

/**
 * Function to read JSON data from the file.
 * @returns {Array} An array containing the JSON data read from the file.
 */
function readJsonData() {
  try {
    const data = fs.readFileSync(FILEPATH, "utf8");
    if (data.trim() === "") {
      // Handle empty file by returning an empty array
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading API call data:", error);
    // Return empty array or handle error as appropriate for your application
    return [];
  }
}

/**
 * Function to read JSON data for a specific ID from the file.
 * @param {string} id - The ID of the JSON data to retrieve.
 * @returns {Array} An array containing the JSON data for the specified ID.
 */
function readDataById(id) {
  try {
    const data = fs.readFileSync(FILEPATH, "utf8");
    if (data.trim() === "") {
      // Handle empty file by returning an empty array
      return [];
    }
    return JSON.parse(data).length > 0
      ? JSON.parse(data).filter((i) => i.id == id)
      : [];
  } catch (error) {
    console.error("Error reading API call data:", error);
    // Return empty array or handle error as appropriate for your application
    return [];
  }
}

/**
 * Function to write JSON data to the file synchronously.
 * @param {Array} data - The JSON data to write to the file.
 */
function writeApiJsonData(data) {
  try {
    fs.writeFileSync(FILEPATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing API call data:", error);
  }
}

/**
 * Function to create or update a JSON entry.
 * @param {string} id - The ID of the JSON entry to create or update.
 * @param {Object} newData - The new data to update the JSON entry with.
 */
function createOrUpdateJSON(id, newData) {
  const apiCallData = readJsonData();
  const index = apiCallData.findIndex((call) => call.id === id);
  if (index !== -1) {
    // Update existing entry
    apiCallData[index] = { ...apiCallData[index], ...newData };
  } else {
    // Create new entry
    apiCallData.push({ id, ...newData });
  }
  writeApiJsonData(apiCallData);
  return;
}

module.exports = {
  createOrUpdateJSON,
  readDataById,
};

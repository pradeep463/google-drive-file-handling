const fs = require("fs");

const FILEPATH = "uploads/progress.json";
// Function to read the API call data from the JSON file
function readApiCallData() {
  try {
    const data = fs.readFileSync(FILEPATH, "utf8");
    if (data.trim() === "") {
      // Handle empty file
      return [];
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading API call data:", error);
    // Return empty array or handle error as appropriate for your application
    return [];
  }
}

// Function to write the API call data to the JSON file
// Function to write the API call data to the JSON file synchronously
function writeApiCallData(data) {
  try {
    fs.writeFileSync(FILEPATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing API call data:", error);
  }
}

// Function to create or update an API call entry
function createOrUpdateApiCall(id, newData) {
  const apiCallData = readApiCallData();
  const index = apiCallData.findIndex((call) => call.id === id);
  if (index !== -1) {
    // Update existing entry
    apiCallData[index] = { ...apiCallData[index], ...newData };
  } else {
    // Create new entry
    apiCallData.push({ id, ...newData });
  }
  writeApiCallData(apiCallData);
  return;
}

module.exports = {
  createOrUpdateApiCall,
};

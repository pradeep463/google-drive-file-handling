require("dotenv").config();
const path = require("path");

/**
 * The environment mode (e.g., DEVELOPMENT, PRODUCTION).
 * Defaults to DEVELOPMENT if not specified in the environment variables.
 * @type {string}
 */
const MODE = process.env.MODE || "DEVELOPMENT";

/**
 * The port number to run the application.
 * Defaults to 8000 if not specified in the environment variables.
 * @type {number}
 */
const PORT = process.env.PORT || 8000;

/**
 * The scopes required for accessing Google Drive APIs.
 * @type {string[]}
 */
const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive",
];

/**
 * The path to the file storing the authorization token.
 * @type {string}
 */
const TOKEN_PATH = path.join(process.cwd(), "token.json");

/**
 * The path to the file storing the credentials for accessing Google APIs.
 * @type {string}
 */
const CREDENTIALS_PATH = path.join(process.cwd(), "./credentials.json");

module.exports = {
  MODE,
  PORT,
  SCOPES,
  TOKEN_PATH,
  CREDENTIALS_PATH,
};

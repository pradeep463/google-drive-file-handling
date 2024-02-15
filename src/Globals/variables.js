require("dotenv").config();
const path = require("path");
const { google } = require("googleapis");

const MODE = process.env.MODE || "DEVELOPMENT";
const PORT = process.env.PORT || 8000;

const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive",
];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "./credentials.json");

module.exports = {
  MODE,
  PORT,
  SCOPES,
  TOKEN_PATH,
  CREDENTIALS_PATH,
 
};

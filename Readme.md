# Interview Task

# Video File Handling with Node.js

## Introduction

This project focuses on developing a Node.js application for handling large video files. The main objectives of the project are:

- **Download from Google Drive**: Develop a Node.js function to download a large video file from a specific Google Drive directory.

- **Chunked Upload**: Implement a chunked uploading mechanism to efficiently and reliably upload large video files to another Google Drive directory.

- **Progress Monitoring**: Create an endpoint to monitor the status of both the download and the chunked upload processes, providing visibility into the progress of each chunk.

The project aims to provide a robust solution for handling video files, ensuring smooth and efficient transfer between Google Drive directories while providing real-time progress updates to users.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Folder Structure](#folder-structure)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Google Drive API Quickstart](#GoogleDriveAPIQuickstart)

## Introduction

Provide a brief overview of the project, its purpose, and its goals.

## Folder Structure

```
📦 Src
 ┣ 📂 Controller
 ┣ 📂 Globals
 ┣ 📂 Routes
 ┗ 📂 utilities
📂 uploads
📜 .env
📜 .gitignore
📜 credentials.json
📜 index.js
📜 nodemon.json
📜 package-lock.json
📜 package.json
📜 README.md
📜 test.txt
📜 token.json
```
## Installation

Include instructions on how to install and set up the project.

1. Clone the repository:
   ```
   git clone https://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@github.com/pradeep463/google-drive-file-handling.git
   ```
2. Navigate to the project directory:
   ```
   cd project-directory
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

Provide guidance on how to use the project, including any necessary configuration or setup.

1. Configure environment variables:
   ```
   // Create a .env file and add necessary variables
   PORT=8000
   MODE=DEVELOPMENT
   ```
2. Start the server:
   ```
   npm start
   ```

## API Endpoints

### 1. Get All Drive Files

- **URL**: `/api/v1/drive/get-all-drive-files`
- **Method**: GET
- **Description**: Retrieves a list of all files in the Google Drive.

### 2. Download and Upload Drive File by ID

- **URL**: `/api/v1/drive/download-drive-file-by-id/:fileId/:folderId`
- **Method**: GET
- **Description**: Downloads a file from Google Drive by its ID and uploads it to a specified folder.

   **Parameters**:
   - `:fileId`: The ID of the file to be downloaded.
   - `:folderId`: The ID of the destination folder in Google Drive.

### 3. Check Download and Upload Progress

- **URL**: `/api/v1/drive/check-download-upload-progress`
- **Method**: GET
- **Description**: Checks the progress of the download and upload processes.

---

## Google Drive API Quickstart

To integrate with the Google Drive API, you can follow the official Google Drive API Quickstart guide for Node.js. This guide provides step-by-step instructions on how to set up your project, enable the Drive API, and authenticate your application.

- **Guide Link**: [Google Drive API Quickstart Guide for Node.js](https://developers.google.com/drive/api/quickstart/nodejs)

The Quickstart guide will help you get started with accessing files on Google Drive and performing various operations such as listing files, downloading files, and uploading files.

---

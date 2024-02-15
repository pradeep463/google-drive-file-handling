const fs = require("fs").promises;
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const { TOKEN_PATH, CREDENTIALS_PATH, SCOPES } = require("../variables");
const FILES = require("fs");
const { Readable } = require("stream");
const { createOrUpdateApiCall } = require("../functions");
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.list({
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  });
  const files = res.data.files;
  if (files.length === 0) {
    return { status: false, data: [] };
  }
  return { status: true, data: files };
}

async function listFolders(authClient) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder'", // Filter to only include folders
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  });
  const folders = res.data.files;
  if (folders.length === 0) {
    return { status: false, data: [] };
  }
  return { status: true, data: folders };
}
async function getFolderId(folderName) {
  const response = await DRIVE.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
  });
  if (!response.data.files || response.data.files.length === 0) {
    throw new Error(`Folder '${folderName}' not found.`);
  }
  return response.data.files[0].id;
}

async function listFilesInFolder(folderId, authClient) {
  const drive = google.drive({ version: "v3", auth: authClient });
  const res = await drive.files.list({
    q: `'${folderId}' in parents`,
    pageSize: 100, // Adjust pageSize as needed
    fields: "files(id, name)",
  });
  const files = res.data.files;
  console.log(res.data);
  if (files.length === 0) {
    return { status: false, data: [] };
  }
  return { status: true, data: files };
}

async function downloadDriveFileById(fileId, authClient, id, data) {
  data.download = "INITIATED";
  await createOrUpdateApiCall(id, data);

  const downloadPath = `uploads/video_${fileId}.mp4`; // Path to download the video file
  const dest = FILES.createWriteStream(downloadPath);
  const drive = google.drive({ version: "v3", auth: authClient });
  let totalDownloaded = 0;
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );

  await new Promise((resolve, reject) => {
    res.data
      .on("end", async () => {
        console.log("Video downloaded successfully.");
        data = {
          ...data,
          download: "COMPLETED",
        };
        await createOrUpdateApiCall(id, data);
        resolve({ downloadPath, data });
      })
      .on("error", (err) => {
        console.error("Error downloading video:", err);
        reject(err);
        throw Error("Error downloading video:", err);
      })
      .on("data", (chunk) => {
        // Emit event to track download progress
        totalDownloaded += chunk.length;
        console.log(
          `downloaded: ${(totalDownloaded / (1024 * 1024)).toFixed(2)} MB`
        );
        console.log(`downloaded: ${(totalDownloaded / 1024).toFixed(2)} KB`);
        data = {
          ...data,
          download: "INPROGRESS",
          progress: {
            downloaded_file_size: `${(totalDownloaded / (1024 * 1024)).toFixed(
              2
            )} MB`,
            upload: 0,
          },
        };
        setTimeout(async () => {
          await createOrUpdateApiCall(id, data);
        }, 800);
      })
      .pipe(dest);
  });
  console.log(data);
  return { downloadPath, data };
}

async function uploadVideoFileToDirectory(
  videoFilePath,
  destinationDirectoryId,
  authClient,
  id,
  data
) {
  try {
    // Initialize upload: Create file metadata
    data.upload = "INITIATED";
    await createOrUpdateApiCall(id, data);
    const fileMetadata = {
      name: "uploaded_video.mp4", // Name for the uploaded file
      parents: [destinationDirectoryId], // ID of the destination directory
    };

    const drive = google.drive({ version: "v3", auth: authClient });

    // Create a readable stream from the video file
    const media = {
      mimeType: "video/mp4",
      body: FILES.createReadStream(videoFilePath),
    };

    // Get file size
    const stats = FILES.statSync(videoFilePath);
    const fileSizeInBytes = stats.size;

    // Define chunk size and progress update threshold
    const chunkSize = 16 * 1024; // 16 KB
    const progressThreshold = 0.1; // 10% progress

    // Initialize variables for tracking progress
    let uploadedBytes = 0;
    let lastProgress = -1;

    // Upload the video file in chunks
    await drive.files.create({
      resource: fileMetadata,
      media: {
        mimeType: "video/mp4",
        body: new Readable({
          read() {},
          highWaterMark: chunkSize,
        })
          .wrap(media.body)
          .on("data", (chunk) => {
            uploadedBytes += chunk.length;
            const percentageUploaded = (uploadedBytes / fileSizeInBytes) * 100;
            const currentProgress = Math.floor(percentageUploaded);

            // Check if progress has reached the threshold or it's the final chunk
            if (
              currentProgress > lastProgress + progressThreshold ||
              uploadedBytes === fileSizeInBytes
            ) {
              console.log(`Upload progress: ${currentProgress.toFixed(2)}%`);
              lastProgress = currentProgress;
              data = {
                ...data,
                upload: "INPROGRESS",
                progress: {
                  downloaded_file_size: data.progress.downloaded_file_size,
                  upload: currentProgress,
                },
              };
              setTimeout(async () => {
                await createOrUpdateApiCall(id, data);
              }, 800);
            }
          }),
      },
      fields: "id",
    });
    data = {
      ...data,
      upload: "COMPLETED",
    };
    await createOrUpdateApiCall(id, data);

    console.log("Video file uploaded successfully.");
  } catch (error) {
    throw Error("Error uploading video file:", error);
  }
}

module.exports = {
  authorize,
  listFiles,
  getFolderId,
  downloadDriveFileById,
  listFolders,
  listFilesInFolder,
  uploadVideoFileToDirectory,
};

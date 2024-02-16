const {
  listFiles,
  authorize,
  downloadDriveFileById,
  listFolders,
  uploadVideoFileToDirectory,
} = require("../Globals/GoogleAuths/GoogleAuthFunctions");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { createOrUpdateJSON } = require("../Globals/functions");

/**
 * Retrieves a list of all files stored in Google Drive.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response containing file information or an error message.
 */
exports.listAllDriveFiles = async (req, res) => {
  try {
    const authClient = await authorize();
    const results = await listFiles(authClient);
    const folderList = await listFolders(authClient);
    if (results?.status)
      return res.status(200).json({
        status: true,
        message: `${results?.data?.length || 0} Files Found`,
        data: results.data || [],
        error: {},
        extra: { folderList },
        date_time: new Date(),
      });

    res.status(404).json({
      status: false,
      message: "No Files Found.",
      error: {},
      data: [],
      extra: {},
      date_time: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong!!!",
      error: {
        error: error.toString(),
      },
      data: [],
      extra: {},
      date_time: new Date(),
    });
  }
};

/**
 * Downloads a file from Google Drive by its ID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response indicating whether the download was initiated.
 */
exports.downloadTesting = async (req, res) => {
  try {
    const fileId = req.params.fileId || "";
    const authClient = await authorize();
    const drive = google.drive({ version: "v3", auth: authClient });
    const fileMetadata = await drive.files.get({ fileId });
    if (!fileMetadata.data || !fileMetadata.data.name) {
      console.error("File metadata or name not found");
      return;
    }

    const fileName = fileMetadata.data.name;
    const destinationPath = `uploads/${fileName}`;

    const dest = fs.createWriteStream(destinationPath);
    const response = await drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    response.data
      .on("end", () => console.log("Download completed"))
      .on("error", (err) => console.error("Error downloading file:", err))
      .pipe(dest); // Pipe the response data to the destination stream

    res.status(200).json({
      status: true,
      message: `Download initiated.`,
      data: {
        link: "",
      },
      error: {},
      extra: {},
      date_time: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong!!!",
      error: {
        error: error.toString(),
      },
      data: [],
      extra: {},
      date_time: new Date(),
    });
  }
};

/**
 * Downloads a file from Google Drive by its ID and uploads it to a specified folder.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response indicating that the download was initiated and the upload is in progress.
 */
exports.downloadAndUploadDriveFileById = async (req, res) => {
  try {
    const fileId = req.params.fileId || "";
    const folderId = req.params.folderId || "";
    const authClient = await authorize();
    const id = uuidv4();
    let data = {
      id: id,
      download: "PENDING",
      upload: "PENDING",
      progress: {
        downloaded_file_size: 0,
        upload: 0,
      },
      created_at: new Date(),
      updated_at: new Date(),
    };

    const uploadFromPath = `uploads/sampleFileToUpload.mp4`; // Path to download the video file

    await createOrUpdateJSON(id, data);

    const result = await downloadDriveFileById(fileId, authClient, id, data);

    uploadVideoFileToDirectory(
      uploadFromPath,
      folderId,
      authClient,
      id,
      result?.data
    );
    res.status(200).json({
      status: true,
      message: `Download initiated And Upload is in progress.`,
      data: {
        filePath: uploadFromPath,
        trackId: id,
      },
      error: {},
      extra: {},
      date_time: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong!!!",
      error: {
        error: error.toString(),
      },
      data: [],
      extra: {
        params: req.params,
      },
      date_time: new Date(),
    });
  }
};

/**
 * Checks the progress of a download/upload operation by trackID.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Object} The response containing the progress data or an error message.
 */
exports.checkDownloadUploadProgress = async (req, res) => {
  try {
    const trackID = req?.query?.trackID || "";

    let data = fs.readFileSync("uploads/progress.json", "utf8");
    data = JSON.parse(data);

    const filteredData = data?.filter((i) => i.id == trackID);
    if (filteredData?.length > 0)
      return res.status(200).json({
        status: true,
        message: `Check Progress...`,
        data: filteredData,
        error: {},
        extra: {},
        date_time: new Date(),
      });
    res.status(200).json({
      status: false,
      message: `No Data Found Please check track id`,
      data: filteredData,
      error: {},
      extra: {},
      date_time: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Something went wrong!!!",
      error: {
        error: error.toString(),
      },
      data: [],
      extra: {},
      date_time: new Date(),
    });
  }
};

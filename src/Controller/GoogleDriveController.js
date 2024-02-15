const {
  listFiles,
  authorize,
  downloadDriveFileById,
  listFolders,
  uploadVideoFileToDirectory,
} = require("../Globals/GoogleAuths/GoogleAuthFunctions");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { createOrUpdateApiCall } = require("../Globals/functions");
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

exports.downloadAndUploadDriveFileById = async (req, res) => {
  try {
    const fileId = req.params.fileId || "";
    const folderId = req.params.folderId || "";
    const authClient = await authorize();
    const id = uuidv4();
    // const id = "8404ce9f-1b54-408f-b9fe-70d743ad95cb";
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
    await createOrUpdateApiCall(id, data);

    // "TestingInterview";
    const result = await downloadDriveFileById(fileId, authClient, id, data);

    //No Need to Wait to complete
    uploadVideoFileToDirectory(
      result?.downloadPath,
      folderId,
      authClient,
      id,
      result?.data
    );
    res.status(200).json({
      status: true,
      message: `Download initiated And Upload is in progress.`,
      data: {
        filePath: result?.downloadPath,
        trackId: id,
        // fileList: fileList,
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

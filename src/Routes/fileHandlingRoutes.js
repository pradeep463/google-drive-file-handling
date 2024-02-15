const {
  listAllFiles,
  listAllDriveFiles,
  downloadAndUploadDriveFileById,
  checkDownloadUploadProgress,
} = require("../Controller/GoogleDriveController");
const { getHello } = require("../Controller/test");

const fileHandlingRoutes = [
  {
    type: "GET",
    route: "/hello",
    base: "/test",
    controller: getHello,
  },
  {
    type: "GET",
    route: "/get-all-drive-files",
    base: "/drive",
    controller: listAllDriveFiles,
  },
  {
    type: "GET",
    route: "/download-drive-file-by-id/:fileId/:folderId",
    base: "/drive",
    controller: downloadAndUploadDriveFileById,
  },
  {
    type: "GET",
    route: "/check-download-upload-progress",
    base: "/drive",
    controller: checkDownloadUploadProgress,
  },
];

module.exports = {
  fileHandlingRoutes,
};

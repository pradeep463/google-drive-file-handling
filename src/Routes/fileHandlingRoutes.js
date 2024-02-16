const {
  listAllFiles,
  listAllDriveFiles,
  downloadAndUploadDriveFileById,
  checkDownloadUploadProgress,
} = require("../Controller/GoogleDriveController");
const { getHello } = require("../Controller/test");

const BASEURL = "/api/v1/drive";

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
    base: BASEURL,
    controller: listAllDriveFiles,
  },
  {
    type: "GET",
    route: "/download-drive-file-by-id/:fileId/:folderId",
    base: BASEURL,
    controller: downloadAndUploadDriveFileById,
  },
  {
    type: "GET",
    route: "/check-download-upload-progress",
    base: BASEURL,
    controller: checkDownloadUploadProgress,
  },
];

module.exports = {
  fileHandlingRoutes,
};

const {
  listAllFiles,
  listAllDriveFiles,
  downloadAndUploadDriveFileById,
  checkDownloadUploadProgress,
} = require("../Controller/GoogleDriveController");
const { getHello } = require("../Controller/test");

/**
 * The base URL for the file handling routes.
 * @type {string}
 */
const BASEURL = "/api/v1/drive";

/**
 * Routes related to file handling.
 * @type {object[]}
 */
const fileHandlingRoutes = [
  {
    /**
     * HTTP method for the route.
     * @type {string}
     */
    type: "GET",
    /**
     * Path for the route.
     * @type {string}
     */
    route: "/hello",
    /**
     * Base URL for the route.
     * @type {string}
     */
    base: "/test",
    /**
     * Controller function for handling the route.
     * @type {Function}
     */
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

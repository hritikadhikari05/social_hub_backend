const express = require("express");
const router = express.Router();

const fileupload_controller = require("../controller/fileupload_controller.");

const {
  upload,
} = require("../utils/file_upload");

router.post(
  "/single-file-upload",
  // uploadImage.single("upload"),
  upload.single("upload"),
  fileupload_controller.uploadFile
);

router.post(
  "/multiple-file-upload",
  upload.array("upload", 5),
  fileupload_controller.uploadMultipleFile
);

/* Delete file from Firebase */
router.delete(
  "/delete-file/:name",
  fileupload_controller.deleteFile
);

module.exports = { router };

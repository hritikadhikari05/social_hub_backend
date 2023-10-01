const express = require("express");
const router = express.Router();

const fileupload_controller = require("../controller/fileupload_controller.");

const { upload } = require("../utils/file_upload");
const authCheck = require("../middlewares/auth_middleware");

router.post(
  "/single-file-upload",
  // authCheck,
  // uploadImage.single("upload"),
  upload.single("upload"),
  fileupload_controller.uploadFile
);

router.post(
  "/multiple-file-upload",
  authCheck,
  upload.array("upload", 5),
  fileupload_controller.uploadMultipleFile
);

/* Delete file from Firebase */
router.delete(
  "/delete-file/:name",
  authCheck,
  fileupload_controller.deleteFile
);

/* Update profile image */
router.put(
  "/update-profile-image",
  authCheck,
  upload.single("upload"),
  fileupload_controller.updateProfileImage
);

module.exports = { router };

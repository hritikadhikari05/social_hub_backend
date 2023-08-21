const express = require("express");
const router = express.Router();
const multer = require("multer");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");

const {
  firebaseConfig,
} = require("../config/firebase.config");

const fileupload_controller = require("../controller/fileupload_controller.");

/* Initialize Firebase */
initializeApp(firebaseConfig);

const storage = getStorage();
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/single-file-upload",
  upload.single("fileName"),
  fileupload_controller.uploadSingleFile
);

router.post(
  "/multiple-file-upload",
  upload.array("fileName", 5),
  fileupload_controller.uploadMultipleFile
);

/* Delete file from Firebase */
router.delete(
  "/delete-file/:name",
  fileupload_controller.deleteFile
);

module.exports = { storage, router };

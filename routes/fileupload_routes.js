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

module.exports = { storage, router };

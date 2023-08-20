const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const multer = require("multer");

// const {
//   storage,
// } = require("../routes/fileupload_routes");

/* Get current date time */
const getDateTime = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Jan is 0, dec is 11
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();
  return `${year}-${month}-${day}-${hour}:${min}:${sec}`;
};

/* Upload single file Firebase */
exports.uploadSingleFile = async (req, res) => {
  try {
    const dateTime = getDateTime(); //Get current date time
    const storage = getStorage();
    const storageRef = ref(
      storage,
      `files/${
        req.file.originalname.split(".")[0] +
        "-" +
        dateTime +
        "." +
        req.file.originalname.split(".")[1]
      }`
    );
    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };
    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

    // Grab the public url
    const downloadURL = await getDownloadURL(
      snapshot.ref
    );
    return res.send({
      message: "File successfully uploaded.",
      name: snapshot.ref.name,
      type: req.file.mimetype,
      downloadUrl: downloadURL,
    });
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong.",
    });
  }
};

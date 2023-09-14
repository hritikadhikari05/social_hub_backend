const { deleteFileFromSpace, checkFileExistsInSpace } = require("../utils/file_upload");

exports.uploadFile = async (req, res) => {
  // console.log(process.env.aws_access_key_id);
  try {
    if (req.file === undefined) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }
    return res.json({
      message: "File uploaded successfully",
      url: req.file.location,
      fileInfo: req.file,
    });
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
};

exports.uploadMultipleFile = async (req, res) => {
  try {
    if (req.files === undefined) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }
    let urls = [];
    for (let i = 0; i < req.files.length; i++) {
      urls.push(req.files[i].location);
    }
    return res.json({
      message: "File uploaded successfully",
      urls: urls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error,
    });
  }
};

exports.deleteFile = async (req, res) => {
  const bucketName = process.env.BUCKET_NAME; // Replace with your Space's name
  const keyToDelete = `uploads/${req.params.name}`;

  /* delete file from digitalocean spaces */
  const fileExists = await checkFileExistsInSpace(bucketName, keyToDelete);

  if (fileExists) {
    await deleteFileFromSpace(bucketName, keyToDelete)
      .then((val) => {
        res.status(200).json({
          message: `File with ${keyToDelete} sucessfully deleted from ${bucketName}`,
        });
      })
      .catch((err) => {
        res.status(400).json({
          message: `Error something went wrong ${err}`,
        });
      });
  } else {
    res.status(400).json({
      message: `File '${keyToDelete}' does not exist in '${bucketName}'.`,
    });
  }
};

const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// Configure AWS
const spacesEndpoint = new AWS.Endpoint("blr1.digitaloceanspaces.com"); // Replace with your Space's endpoint
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Configure multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    key: function (request, file, cb) {
      cb(null, "uploads/" + Date.now() + "_" + file.originalname);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    serverSideEncryption: "AES256",
  }),
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit (in bytes)
  },
  fileFilter: function (request, file, cb) {
    // Check if the file type is one of the accepted types
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, and PDF files are allowed."
        )
      );
    }
  },
});

//  Function to check if a file exists in a Space
const checkFileExistsInSpace = async (bucketName, key, callback) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  console.log(bucketName, key);
  try {
    await s3.headObject(params).promise();
    return true; // File exists
  } catch (error) {
    // console.log(error);
    if (error.code === "NotFound") {
      return false; // File not found
    } else {
      throw error;
    }
  }
};

// Function to delete a file/image
const deleteFileFromSpace = async (bucketName, key) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  console.log("Key: ", key);
  try {
    await s3.deleteObject(params).promise();
    console.log(`Deletion success: '${key}' was deleted from '${bucketName}'.`);
  } catch (error) {
    console.error("Deletion error:", error);
    throw error;
  }
};

const fileTooLargeErrorHandle = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer error occurred, handle it here
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size is too large. Max allowed size is 4MB.",
      });
    }

    // Handle other Multer errors as needed
    return res.status(500).json({
      message: "Internal server error.",
    });
  }

  // Handle other types of errors or pass them to the default error handler
  next(err);
};

module.exports = {
  upload,
  deleteFileFromSpace,
  fileTooLargeErrorHandle,
  checkFileExistsInSpace,
};

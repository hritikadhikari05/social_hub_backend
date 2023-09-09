const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

// Configure AWS
const spacesEndpoint = new AWS.Endpoint(
  "blr1.digitaloceanspaces.com"
); // Replace with your Space's endpoint
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey:
    process.env.AWS_SECRET_ACCESS_KEY,
});

// Configure multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME, // Replace with your Space's name
    acl: "public-read", // Set permissions for the uploaded file
    key: function (request, file, cb) {
      cb(
        null,
        "uploads/" +
          Date.now() +
          "_" +
          file.originalname
      ); // Set the key under which the file will be stored
    },
  }),
});

//  Function to check if a file exists in a Space
const checkFileExistsInSpace = async (
  bucketName,
  key,
  callback
) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    await s3.headObject(params).promise();
    return true; // File exists
  } catch (error) {
    if (error.code === "NotFound") {
      return false; // File not found
    } else {
      throw error;
    }
  }
};

// Function to delete a file/image
const deleteFileFromSpace = async (
  bucketName,
  key
) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  console.log("Key: ", key);
  try {
    await s3.deleteObject(params).promise();
    console.log(
      `Deletion success: '${key}' was deleted from '${bucketName}'.`
    );
  } catch (error) {
    console.error("Deletion error:", error);
    throw error;
  }
};

module.exports = {
  upload,
  deleteFileFromSpace,
  checkFileExistsInSpace,
};

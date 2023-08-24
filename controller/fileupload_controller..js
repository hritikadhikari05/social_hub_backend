// const {
//   getStorage,
//   ref,
//   uploadBytesResumable,
//   getDownloadURL,
//   deleteObject,
// } = require("firebase/storage");
// const multer = require("multer");

// // const {
// //   storage,
// // } = require("../routes/fileupload_routes");

// /* Get current date time */
// const getDateTime = () => {
//   const date = new Date();
//   const year = date.getFullYear();
//   const month = date.getMonth() + 1; // Jan is 0, dec is 11
//   const day = date.getDate();
//   const hour = date.getHours();
//   const min = date.getMinutes();
//   const sec = date.getSeconds();
//   return `${year}-${month}-${day}-${hour}:${min}:${sec}`;
// };

// /* Upload single file Firebase */
// exports.uploadSingleFile = async (req, res) => {
//   try {
//     const dateTime = getDateTime(); //Get current date time
//     const storage = getStorage();
//     const storageRef = ref(
//       storage,
//       `files/${
//         req.file.originalname.split(".")[0] +
//         "-" +
//         dateTime +
//         "." +
//         req.file.originalname.split(".")[1]
//       }`
//     );
//     // Create file metadata including the content type
//     const metadata = {
//       contentType: req.file.mimetype,
//     };
//     // Upload the file in the bucket storage
//     const snapshot = await uploadBytesResumable(
//       storageRef,
//       req.file.buffer,
//       metadata
//     );
//     //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

//     // Grab the public url
//     const downloadURL = await getDownloadURL(
//       snapshot.ref
//     );
//     return res.send({
//       message: "File successfully uploaded.",
//       name: snapshot.ref.name,
//       type: req.file.mimetype,
//       downloadUrl: downloadURL,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: "Something went wrong.",
//     });
//   }
// };

// /* Upload multiple files Firebase */
// exports.uploadMultipleFile = async (req, res) => {
//   try {
//     const dateTime = getDateTime(); //Get current date time
//     const storage = getStorage();
//     /* Loop through array of files */
//     const files = [];
//     for (let i = 0; i < req.files.length; i++) {
//       const storageRef = ref(
//         storage,
//         `files/${
//           req.files[i].originalname.split(
//             "."
//           )[0] +
//           "-" +
//           dateTime +
//           "." +
//           req.files[i].originalname.split(".")[1]
//         }`
//       );
//       // Create file metadata including the content type
//       const metadata = {
//         contentType: req.files[i].mimetype,
//       };
//       // Upload the file in the bucket storage
//       const snapshot = await uploadBytesResumable(
//         storageRef,
//         req.files[i].buffer,
//         metadata
//       );
//       //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

//       // Grab the public url
//       const downloadURL = await getDownloadURL(
//         snapshot.ref
//       );
//       files.push({
//         message: "File successfully uploaded.",
//         name: snapshot.ref.name,
//         type: req.files[i].mimetype,
//         downloadUrl: downloadURL,
//       });

//       if (i === req.files.length - 1) {
//         return res.send(files);
//       }
//     }
//   } catch (error) {
//     res.status(500).send({
//       message: "Something went wrong.",
//     });
//   }
// };

// /* Delete image from firebase storage */
// exports.deleteFile = async (req, res) => {
//   try {
//     console.log(req.params.name);
//     const storage = getStorage();
//     const storageRef = ref(
//       storage,
//       `files/${req.params.name}`
//     );
//     await deleteObject(storageRef);
//     return res.send({
//       message: "File successfully deleted.",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       message: "Something went wrong.",
//     });
//   }
// };
const {
  deleteFileFromSpace,
  checkFileExistsInSpace,
} = require("../utils/file_upload");

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
    console.log(error);
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
    console.log(error);
  }
};

exports.deleteFile = async (req, res) => {
  console.log(
    `socail-hub/uploads/${req.params.name}`
  );
  const bucketName = "socail-hub"; // Replace with your Space's name
  const keyToDelete = `uploads/${req.params.name}`;
  /* delete file from digitalocean spaces */

  const fileExists = await checkFileExistsInSpace(
    bucketName,
    keyToDelete
  );

  if (fileExists) {
    await deleteFileFromSpace(
      bucketName,
      keyToDelete
    )
      .then((val) => {
        console.log("Success", val);
        res.send(200).json({
          message: `File with ${keyToDelete} sucessfully deleted from ${bucketName}`,
        });
      })
      .catch((err) => {
        console.log("Error", err);
        res.status(400).json({
          message: `Error something went wrong ${err}`,
        });
      });
  } else {
    console.log(
      `File '${keyToDelete}' does not exist in '${bucketName}'.`
    );
    res.status(400).json({
      message: `File '${keyToDelete}' does not exist in '${bucketName}'.`,
    });
  }

  // .then(() => {
  //     console.log(
  //       `Deletion success: '${keyToDelete}' was deleted from '${bucketName}'.`
  //     );
  //     res.status(200).send({
  //       message: `Deletion success: '${keyToDelete}' was deleted from '${bucketName}'.`,
  //     });
  //   })
  //   .catch((err) => {
  //     console.error("Deletion error:", err);
  //   });
};

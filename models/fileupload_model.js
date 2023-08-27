import {
  mongoose,
  Schema,
} from "../utils/mongoose_db_schema";

const fileUploadSchema = new Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
  },
  downloadLink: {
    type: String,
  },
});

module.exports = mongoose.model(
  "FileUpload",
  fileUploadSchema
);

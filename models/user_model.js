const {
  Schema,
  mongoose,
} = require("../utils/mongoose_db_schema");
const Post = require("./post_model");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    profilePic: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBanned: {
      type: Boolean,
      required: true,
      default: false,
    },
    banReason: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "User",
  userSchema
);

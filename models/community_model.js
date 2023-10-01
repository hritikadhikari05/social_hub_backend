const { Schema, mongoose } = require("../utils/mongoose_db_schema");

const communitySchema = new Schema(
  {
    name: { type: String, required: true },
    displayName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    community_type: {
      type: String,
      required: true,
      enum: ["private", "public"],
    },
    icon_image: {
      type: String,
    },
    creator_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    members: {
      type: Array.of(mongoose.Types.ObjectId),
      required: true,
      default: [],
    },
    member_count: {
      type: Number,
      required: true,
      default: 0,
    },
    report_count: {
      type: Number,
      required: true,
      default: 0,
    },
    is_banned: {
      type: Boolean,
      default: false,
    },
    ban_reason: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Community", communitySchema);

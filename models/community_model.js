const {
  Schema,
  mongoose,
} = require("../utils/mongoose_db_schema");

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
    },
    icon_image: {
      type: String,
      required: true,
    },
    creator_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    member_count: {
      type: Number,
      required: true,
    },
    report_count: {
      type: Number,
      required: true,
    },
    is_banned: {
      type: Boolean,
      default: false,
    },
    ban_reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Community",
  communitySchema
);

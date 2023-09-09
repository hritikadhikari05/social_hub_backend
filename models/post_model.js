const {
  Schema,
  mongoose,
} = require("../utils/mongoose_db_schema");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    community_id: {
      type: mongoose.Types.ObjectId,
      required: true,
      // default: null,
    },
    is_sticked: {
      type: Boolean,
      required: true,
      default: false,
    },
    upvotes: {
      type: Array.of(mongoose.Types.ObjectId),
      required: true,
      default: [],
    },
    downvotes: {
      type: Array.of(mongoose.Types.ObjectId),
      required: true,
      default: [],
    },
    upvotes_count: {
      type: Number,
      required: true,
      default: 0,
    },
    downvotes_count: {
      type: Number,
      required: true,
      default: 0,
    },
    reports: {
      type: Array.of(mongoose.Types.ObjectId),
      required: true,
      default: [],
    },
    report_count: {
      type: Number,
      required: true,
      default: 0,
    },
    view_count: {
      type: Number,
      required: true,
      default: 0,
    },
    comment_count: {
      type: Number,
      required: true,
      default: 0,
    },
    tags: {
      type: Array,
      required: true,
      default: [],
    },
    is_blocked: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Post",
  postSchema
);

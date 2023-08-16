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
    author_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    subreddit_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    is_sticked: {
      type: Boolean,
      required: true,
    },
    upvotes: {
      type: Number,
      required: true,
      default: 0,
    },
    downvotes: {
      type: Number,
      required: true,
      default: 0,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Post",
  postSchema
);

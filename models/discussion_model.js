const {
  mongoose,
  Schema,
} = require("../utils/mongoose_db_schema");

const discussionModel = new Schema(
  {
    creator_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    subreddit_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    participant_count: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

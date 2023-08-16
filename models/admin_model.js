const {
  Schema,
  mongoose,
} = require("../utils/mongoose_db_schema");

const adminModel = new Schema(
  {
    admin_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    subreddit_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

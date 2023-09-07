const {
  mongoose,
  Schema,
} = require("../utils/mongoose_db_schema");

const bookmarkSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [
        true,
        "A bookmark must belong to a user!",
      ],
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: [
        true,
        "A bookmark must belong to a post!",
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Bookmark",
  bookmarkSchema
);

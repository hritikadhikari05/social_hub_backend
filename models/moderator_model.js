const {
  Schema,
  mongoose,
} = require("../utils/mongoose_db_schema");

const moderatorSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    subRedditId: {
      type: mongoose.Types.ObjectId,
      ref: "SubRedditId",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Moderator",
  moderatorSchema
);

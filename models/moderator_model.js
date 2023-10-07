const { Schema, mongoose } = require("../utils/mongoose_db_schema");

const moderatorSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    community: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Community",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Moderator", moderatorSchema);

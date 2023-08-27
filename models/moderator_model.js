const {
  Schema,
  mongoose,
} = require("../utils/mongoose_db_schema");

const moderatorSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    community_id: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Moderator",
  moderatorSchema
);

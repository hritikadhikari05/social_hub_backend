const {
  Schema,
  mongoose,
} = require("../utils/mongoose_db_schema");

const subscriptionSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    subRedditId: {
      type: mongoose.Types.ObjectId,
      ref: "SubRedditId",
    },
    role: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema
);

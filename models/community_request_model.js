const { mongo } = require("mongoose");
const { Schema, mongoose } = require("../utils/mongoose_db_schema");

const communityRequestSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    communityId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityRequest", communityRequestSchema);

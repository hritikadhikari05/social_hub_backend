const { Schema, mongoose } = require("../utils/mongoose_db_schema");

const adminModel = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    community: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminModel);

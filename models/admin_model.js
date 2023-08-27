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
    community_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Admin",
  adminModel
);

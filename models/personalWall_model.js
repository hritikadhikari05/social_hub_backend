const {
  mongoose,
  Schema,
} = require("../utils/mongoose_db_schema");

const personalWallSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    wall_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PersonalWall",
  personalWallSchema
);

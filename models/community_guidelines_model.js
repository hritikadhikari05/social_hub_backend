const mongoose = require("mongoose");

const communityGuidelinesSchema = new mongoose.Schema({
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  community_guidelines: {
    type: String,
    required: true,
  },
});

const CommunityGuidelines = mongoose.model(
  "CommunityGuidelines",
  communityGuidelinesSchema
);

module.exports = CommunityGuidelines;

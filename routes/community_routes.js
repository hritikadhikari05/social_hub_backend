const express = require("express");
const router = express.Router();
const communityController = require("../controller/community_controller");
const authCheck = require("../middlewares/auth_middleware");

/* add members field to the community model */
// router.post(
//   "/add-members-field",
//   communityController.addMembersField
// );

/* create a new community */
router.post(
  "/create",
  authCheck,
  communityController.create_community
);

/* get all community */
router.get(
  "/get-all-communities",
  communityController.getAllCommunity
);

/* get community by id */
router.get(
  "/get-community/:communityId",
  communityController.getCommunityById
);

/* Join Community */
router.post(
  "/join-community/:communityId",
  authCheck,
  communityController.joinCommunity
);

/* Promote user to moderator */
router.post(
  "/promote-to-moderator/:communityId",
  authCheck,
  communityController.promoteToModerator
);

module.exports = router;

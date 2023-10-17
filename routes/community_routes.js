const express = require("express");
const router = express.Router();
const communityController = require("../controller/community_controller");
const authCheck = require("../middlewares/auth_middleware");

/* add members field to the community model */
router.post("/add-members-field", communityController.addMembersField);

/* create a new community */
router.post("/create", authCheck, communityController.create_community);

/* update community */
router.put(
  "/update-community/:communityId",
  authCheck,
  communityController.updateCommunityDetails
);

/* get all community */
router.get(
  "/get-all-communities",
  authCheck,
  communityController.getAllCommunity
);

/* get community by id */
router.get(
  "/get-community/:communityId",
  authCheck,
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

/* Leave Community */
router.post(
  "/leave-community/:communityId",
  authCheck,
  communityController.leaveCommunity
);

/* Get list of communities by logged in user */
router.get(
  "/get-joined-communities",
  authCheck,
  communityController.getJoinedCommunities
);

/* Delete Community */
router.delete(
  "/delete-community/:communityId",
  authCheck,
  communityController.deleteCommunity
);

/* Get all community join requests */
router.get(
  "/get-join-requests/:communityId",
  authCheck,
  communityController.getAllCommunityJoinRequests
);

/* Accept community join request */
router.post(
  "/accept-join-request/:requestId",
  authCheck,
  communityController.approveRequestToJoinCommunity
);

/* Get most followed communities */
router.get(
  "/get-most-followed-communities",
  authCheck,
  communityController.getMostFollowedCommunities
);

/* Add community guidelines */
router.post(
  "/add-community-guidelines/:communityId",
  authCheck,
  communityController.addCommunityGuidelines
);

/* Get community guidelines */
router.get(
  "/get-community-guidelines/:communityId",
  authCheck,
  communityController.getCommunityGuidelines
);

/* Delete community guidelines */
router.delete(
  "/delete-community-guidelines/:communityId",
  authCheck,
  communityController.deleteCommunityGuidelines
);

/* Edit community guidelines */
router.put(
  "/edit-community-guidelines/:communityId",
  authCheck,
  communityController.editCommunityGuidelines
);

/* Get joined members of the community */
router.get(
  "/get-joined-members/:communityId",
  authCheck,
  communityController.getJoinedMembers
);

/* Get community moderators */
router.get(
  "/get-moderators/:communityId",
  authCheck,
  communityController.getModeratorsByCommunity
);

/* Transfer ownership of the community */
router.post(
  "/transfer-ownership/:communityId",
  authCheck,
  communityController.transferOwnership
);

/* Demote moderator */
router.post(
  "/demote-moderator/:communityId",
  authCheck,
  communityController.demoteModerator
);

module.exports = router;

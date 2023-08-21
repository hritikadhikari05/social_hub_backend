const express = require("express");
const router = express.Router();
const communityController = require("../controller/community_controller");

/* create a new community */
router.post(
  "/create",
  communityController.create_community
);

module.exports = router;

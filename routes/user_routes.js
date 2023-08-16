const express = require("express");
const router = express.Router();

const user_controller = require("../controller/user_controller.js");
const authCheck = require("../middlewares/auth_middleware");

/* Create Post */
router.post(
  "/create-post",
  authCheck,
  user_controller.createPost
);

/* Get Post */
router.get(
  "/get-post/:postId",
  authCheck,
  user_controller.getPost
);

/* Get All Posts */
router.get(
  "/get-all-posts",
  authCheck,
  user_controller.getAllPosts
);

module.exports = router;

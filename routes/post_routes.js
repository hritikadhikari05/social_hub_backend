const express = require("express");
const router = express.Router();

const post_controller = require("../controller/post_controller.js");
const authCheck = require("../middlewares/auth_middleware.js");

/* Create Post */
router.post(
  "/create-post",
  authCheck,
  post_controller.createPost
);

/* Get Post */
router.get(
  "/get-post/:postId",
  authCheck,
  post_controller.getPost
);

/* Get All Posts */
router.get(
  "/get-all-posts",
  authCheck,
  post_controller.getAllPosts
);

/* Get All Posts By User */
router.get(
  "/get-all-posts-by-user",
  authCheck,
  post_controller.getAllPostsByUser
);

/* Get All Posts By community */
router.get(
  "/get-all-posts-by-community",
  authCheck,
  post_controller.getAllPostsByCommunity
);

/* Get latest Post */
router.get(
  "/get-latest-posts",
  authCheck,
  post_controller.getLatestPosts
);

/* Get Trending Post */
router.get(
  "/get-trending-posts",
  authCheck,
  post_controller.getTrendingPosts
);

/* Upvote Post */
router.post(
  "/upvote-post/:postId",
  authCheck,
  post_controller.upvotePost
);

/* Downvote Post */
router.post(
  "/downvote-post/:postId",
  authCheck,
  post_controller.downvotePost
);

/* Delete Post By Id */
router.delete(
  "/delete-post/:postId",
  authCheck,
  post_controller.deletePost
);

/* Update Post By Id */
router.put(
  "/update-post/:postId",
  authCheck,
  post_controller.updatePost
);

module.exports = router;

const express = require("express");
const router = express.Router();

const post_controller = require("../controller/post_controller.js");
const authCheck = require("../middlewares/auth_middleware.js");

/* Add Reports Field */
router.post("/add-reports", authCheck, post_controller.addReportsField);

/* Create Post */
router.post("/create-post", authCheck, post_controller.createPost);

/* Get Post */
router.get("/get-post/:postId", authCheck, post_controller.getPost);

/* Get All Posts */
router.get("/get-all-posts", authCheck, post_controller.getAllPosts);

/*Get Blocked Posts */
router.get("/get-blocked-posts", authCheck, post_controller.getAllBlockedPosts);

/* Unblock Post */
router.post("/unblock-post/:postId", authCheck, post_controller.unblockPost);

/* Report Post */
router.post("/report-post/:postId", authCheck, post_controller.reportPost);

/* Unreport Post */
router.post("/unreport-post/:postId", authCheck, post_controller.unreportPost);

/* Get All Posts By User */
router.get(
  "/get-all-posts-by-user",
  authCheck,
  post_controller.getAllPostsByUser
);

/* Get All posts by user id */
router.get(
  "/get-all-posts-by-user-id/:userId",
  authCheck,
  post_controller.getAllPostsByUserId
);

/* Get All Posts By community */
router.get(
  "/get-all-posts-by-community/:communityId",
  authCheck,
  post_controller.getAllPostsByCommunity
);

/* Get latest Post */
router.get("/get-latest-posts", authCheck, post_controller.getLatestPosts);

/* Get Trending Post */
router.get("/get-trending-posts", authCheck, post_controller.getTrendingPosts);

/* Get Most Viewed Post */
router.get(
  "/get-most-viewed-posts",
  authCheck,
  post_controller.getMostViewedPosts
);

/* Get Posts by user following */
router.get(
  "/get-posts-by-user-following",
  authCheck,
  post_controller.getPostsByFollowing
);

/* Upvote Post */
router.post("/upvote-post/:postId", authCheck, post_controller.upvotePost);

/* Downvote Post */
router.post("/downvote-post/:postId", authCheck, post_controller.downvotePost);

/* Delete Post By Id */
router.delete("/delete-post/:postId", authCheck, post_controller.deletePost);

/* Update Post By Id */
router.put("/update-post/:postId", authCheck, post_controller.updatePost);

/* Search Post */
router.get("/search-post", authCheck, post_controller.searchPost);

module.exports = router;

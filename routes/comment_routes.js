const express = require("express");
const router = express.Router();

const commentController = require("../controller/comment_controller");
const authCheck = require("../middlewares/auth_middleware");

/* Create Comment */
router.post(
  "/create-comment/:post_id",
  authCheck,
  commentController.createComment
);

/* Get Comment */
router.get("/get-comments/:post_id", authCheck, commentController.getComments);

/* Get Comment Replies */
router.get(
  "/get-comment-replies/:comment_id",
  authCheck,
  commentController.getCommentReplies
);

/* Upvotes Comment */
router.post(
  "/upvote-comment/:comment_id",
  authCheck,
  commentController.upvoteComment
);

/* Downvote Comment */
router.post(
  "/downvote-comment/:comment_id",
  authCheck,
  commentController.downvoteComment
);

/* Delete Comment */
router.delete(
  "/delete-comment/:comment_id",
  authCheck,
  commentController.deleteComment
);

/* Get comment by ID */
router.get(
  "/get-comment/:comment_id",
  authCheck,
  commentController.getCommentById
);

module.exports = router;

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
router.get(
  "/get-comments/:post_id",
  authCheck,
  commentController.getComments
);

/* Get Comment Replies */
router.get(
  "/get-comment-replies/:comment_id",
  authCheck,
  commentController.getCommentReplies
);

/* Delete Comment */
router.delete(
  "/delete-comment/:comment_id",
  authCheck,
  commentController.deleteComment
);

module.exports = router;

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
  "/get-comments",
  authCheck,
  commentController.getComments
);

/* Get Comment Replies */
router.get(
  "/get-comment-replies",
  authCheck,
  commentController.getCommentReplies
);

module.exports = router;

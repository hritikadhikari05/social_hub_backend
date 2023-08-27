const express = require("express");
const router = express.Router();

const authCheck = require("../middlewares/auth_middleware");
const bookmarkController = require("../controller/bookmark_controller");

/* Add BookMarks */
router.post(
  "/add-bookmark/:postId",
  authCheck,
  bookmarkController.addBookmark
);

/* Remove Bookmark */
router.delete(
  "/remove-bookmark/:postId",
  authCheck,
  bookmarkController.removeBookmark
);

/* Get all the bookmarked posts with userId */
router.get(
  "/get-bookmarks",
  authCheck,
  bookmarkController.getBookmarks
);

module.exports = router;

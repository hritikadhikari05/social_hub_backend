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

module.exports = router;

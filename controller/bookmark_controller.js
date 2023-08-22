const Bookmark = require("../models/bookmarks_model");

/* Add selected post to the bookmark */
exports.addBookmark = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const bookmarks = await Bookmark.find({
      userId: userId,
      postId: postId,
    });
    if (bookmarks.length > 0) {
      return res.status(400).json({
        message: "You have already bookmarked",
      });
    }
    const newBookmark = new Bookmark({
      userId: userId,
      postId: postId,
    });
    await newBookmark.save();
    return res.status(200).json({
      message: "Post bookmarked successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Remove selected post from the bookmark */
exports.removeBookmark = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const bookmarks =
      await Bookmark.findOneAndDelete({
        userId: userId,
        postId: postId,
      });
    if (!bookmarks) {
      return res.status(400).json({
        message:
          "You have not bookmarked this post",
      });
    }
    return res.status(200).json({
      message: "Post removed from bookmark",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

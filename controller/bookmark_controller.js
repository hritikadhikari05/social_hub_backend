const BookmarksDto = require("../dto/bookmarks_dto");
const Bookmark = require("../models/bookmarks_model");
const community_model = require("../models/community_model");
const PostService = require("../services/post_service");

/* Change user field to user_id in Bookmark model */
// exports.changeUserField = async (req, res) => {
//   try {
//     const bookmarks = await Bookmark.updateMany(
//       {},
//       {
//         $rename: {
//           user: "user_id",
//         },
//       },
//       { multi: true }
//     );

//     return res.status(200).json({
//       message: "User field changed to user_id",
//     });
//   } catch (error) {
//
//     res.status(500).json({
//       message: "Something went wrong",
//     });
//   }
// };

/* Add selected post to the bookmark */
exports.addBookmark = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const bookmarks = await Bookmark.findOne({
      user_id: userId,
      post: postId,
    });
    /* If post is already bookmarked then remove
     it from bookmark 
    */
    if (bookmarks) {
      await bookmarks.deleteOne();
      return res.status(200).json({
        message: "You have removed from bookmark",
      });
    }

    /* Check if post exists */
    const post = await PostService.getPost(postId);

    if (!post) {
      return res.status(400).json({
        message: "Post does not exist with this id",
      });
    }

    /* If post is not bookmarked then add it 
    to bookmark 
    */
    const newBookmark = new Bookmark({
      user_id: userId,
      post: postId,
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
    const bookmarks = await Bookmark.findOneAndDelete({
      user_id: userId,
      post: postId,
    });
    if (!bookmarks) {
      return res.status(400).json({
        message: "You have not bookmarked this post",
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

/* Get all the bookmarked posts with logged in 
user and latest bookmarked post 
*/
exports.getBookmarks = async (req, res) => {
  const { userId } = req.user;

  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const bookmarks = await Bookmark.find({
      user_id: userId,
    })

      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "post",
        populate: {
          path: "author",
          select: "userName firstName lastName bio profilePic",
        },
      });
    if (bookmarks.length === 0) {
      return res.status(400).json({
        message: "No bookmarked posts found",
      });
    }

    /* Get in bookmarks in specific format */
    const bookmarksDto = await Promise.all(
      bookmarks.map(async (post) => {
        // console.log("Post", post.post.community);
        const community = await community_model.findById(post.post.community);
        return new BookmarksDto(post, userId, community);
      })
    );

    return res.status(200).json({
      message: "Bookmarks found",
      data: bookmarksDto,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

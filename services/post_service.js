const BookMarks = require("../models/bookmarks_model");

class PostService {
  async addBookmarkFieldToThepost(post, userId) {
    return await Promise.all(
      post.map(async (post) => {
        const isBookmarked =
          await BookMarks.findOne({
            user_id: userId,
            post: post._id,
          });
        return {
          ...post._doc,
          isBookmarked: isBookmarked
            ? true
            : false,
        };
      })
    );
  }
}

module.exports = new PostService();

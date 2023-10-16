const BookMarks = require("../models/bookmarks_model");
const Post = require("../models/post_model");

class PostService {
  /* Return upvote status to the post */
  async upvoteStatus(post, userId) {
    const isUpvoted = await post.upvotes.includes(userId);
    return isUpvoted;
  }

  /* Return downvotes status to the post */
  async downvoteStatus(post, userId) {
    const isDownvoted = await post.downvotes.includes(userId);
    return isDownvoted;
  }

  async addBookmarkFieldToThepost(post, userId) {
    return await Promise.all(
      post.map(async (post) => {
        const isBookmarked = await BookMarks.findOne({
          user_id: userId,
          post: post._id,
        });
        return {
          ...post._doc,
          isBookmarked: isBookmarked ? true : false,
          upVoteStatus: (await this.upvoteStatus(post, userId)) ? true : false,
          downVoteStatus: (await this.downvoteStatus(post, userId))
            ? true
            : false,
        };
      })
    );
  }

  /* Return isBookmarked status to the single post */
  async addBookmarkFieldToTheSinglePost(post, userId) {
    const isBookmarked = await BookMarks.findOne({
      user_id: userId,
      post: post._id,
    });
    return {
      ...post._doc,
      isBookmarked: isBookmarked ? true : false,
      upVoteStatus: (await this.upvoteStatus(post, userId)) ? true : false,
      downVoteStatus: (await this.downvoteStatus(post, userId)) ? true : false,
    };
  }

  /* Get post by id */
  async getPost(id) {
    try {
      const post = await Post.findById(id);
      return post;
    } catch (error) {}
  }
}

module.exports = new PostService();

class BookmarksDto {
  post;
  user_id;

  constructor(post, user_id) {
    this.post = post;
    this.user_id = user_id;
  }
  async getBookmarks() {
    return await this.post.map((post) => {
      return {
        _id: post.post._id,
        title: post.post.title,
        content: post.post.content,
        author: post.post.author,
        community_id: post.post.community_id,
        is_sticked: post.post.is_sticked,
        upvotes: post.post.upvotes,
        downvotes: post.post.downvotes,
        upvotes_count: post.post.upvotes_count,
        downvotes_count: post.post.downvotes_count,
        reports: post.post.reports,
        report_count: post.post.report_count,
        view_count: post.post.view_count,
        tags: post.post.tags,
        is_blocked: post.post.is_blocked,
        comment_count: post.post.comment_count,
        createdAt: post.post.createdAt,
        updatedAt: post.post.updatedAt,
        upVoteStatus: post.post.upvotes.includes(this.user_id),
        downVoteStatus: post.post.downvotes.includes(this.user_id),
      };
    });
  }
}

module.exports = BookmarksDto;

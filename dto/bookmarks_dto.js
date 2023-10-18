const Bookmark = require("../models/bookmarks_model");
const Community = require("../models/community_model");
class BookmarksDto {
  _id;
  title;
  content;
  author;
  community_id;
  is_sticked;
  upvotes;
  downvotes;
  upvotes_count;
  downvotes_count;
  reports;
  report_count;
  view_count;
  tags;
  is_blocked;
  comment_count;
  createdAt;
  updatedAt;
  upVoteStatus;
  downVoteStatus;
  isBookmarked;

  constructor(post, user_id, community) {
    this._id = post.post._id;
    this.title = post.post.title;
    this.content = post.post.content;
    this.author = post.post.author;
    this.community = community
      ? {
          _id: community._id,
          name: community.name,
          displayName: community.displayName,
          description: community.description,
          icon_image: community.icon_image,
        }
      : null;
    this.is_sticked = post.post.is_sticked;
    this.upvotes = post.post.upvotes;
    this.downvotes = post.post.downvotes;
    this.upvotes_count = post.post.upvotes_count;
    this.downvotes_count = post.post.downvotes_count;
    this.reports = post.post.reports;
    this.report_count = post.post.report_count;
    this.view_count = post.post.view_count;
    this.tags = post.post.tags;
    this.is_blocked = post.post.is_blocked;
    this.comment_count = post.post.comment_count;
    this.createdAt = post.post.createdAt;
    this.updatedAt = post.post.updatedAt;
    this.upVoteStatus = post.post.upvotes.includes(user_id);
    this.downVoteStatus = post.post.downvotes.includes(user_id);
    this.isBookmarked = true;
  }
}

module.exports = BookmarksDto;

// id;
//   title;
//   content;
//   author;
//   community_id;
//   is_sticked;
//   upvotes;
//   downvotes;
//   upvotes_count;
//   downvotes_count;
//   reports;
//   report_count;
//   view_count;
//   tags;
//   is_blocked;
//   comment_count;
//   createdAt;
//   updatedAt;
//   upVoteStatus;
//   downVoteStatus;
//   isBookmarked;

//   constructor(post, user_id) {
//     id = post.post._id;
//     title = post.post.title;
//     content = post.post.content;
//     author = post.post.author;
//     community_id = post.post.community_id;
//     is_sticked = post.post.is_sticked;
//     upvotes = post.post.upvotes;
//     downvotes = post.post.downvotes;
//     upvotes_count = post.post.upvotes_count;
//     downvotes_count = post.post.downvotes_count;
//     reports = post.post.reports;
//     report_count = post.post.report_count;
//     view_count = post.post.view_count;
//     tags = post.post.tags;
//     is_blocked = post.post.is_blocked;
//     comment_count = post.post.comment_count;
//     createdAt = post.post.createdAt;
//     updatedAt = post.post.updatedAt;
//     upVoteStatus = post.post.upvotes.includes(user_id);
//     downVoteStatus = post.post.downvotes.includes(user_id);
//     isBookmarked = this.getBookmarks() ? true : false;
//   }
//   async getBookmarks() {
//     console.log(id);
//     const bookmarks = await Bookmark.find({ user_id: userId, post: this.id });
//     return bookmarks;
//   }

const User = require("../models/user_model");
const CommentService = require("../services/comment_service");

class CommentDto {
  _id;
  content;
  author;
  post_id;
  upvotes;
  downvotes;
  upvotes_count;
  downvotes_count;
  report_count;
  comment_context;
  parent_type;
  parent_id;
  replies_count;
  upvoteStatus;
  downvoteStatus;

  constructor(comment, userId) {
    this._id = comment._id;
    this.content = comment.content;
    this.author = {
      _id: comment.author_id._id,
      firstName: comment.author_id.firstName,
      lastName: comment.author_id.lastName,
      userName: comment.author_id.userName,
      profilePic: comment.author_id.profilePic,
      bio: comment.author_id.bio,
    };
    this.post_id = comment.post_id;
    this.upvotes = comment.upvotes;
    this.downvotes = comment.downvotes;
    this.upvotes_count = comment.upvotes_count;
    this.downvotes_count = comment.downvotes_count;
    this.report_count = comment.report_count;
    this.comment_context = comment.comment_context;
    this.parent_type = comment.parent_type;
    this.parent_id = comment.parent_id;
    this.replies_count = comment.replies_count;
    this.upVoteStatus = CommentService.getUpvoteStatus(comment, userId);
    this.downVoteStatus = CommentService.getDownvoteStatus(comment, userId);
  }
}

module.exports = CommentDto;

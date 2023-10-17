class CommentService {
  //Get upvote status of a comment
  getUpvoteStatus(comment, userId) {
    if (comment.upvotes.includes(userId)) {
      return true;
    }
    return false;
  }

  //Get downvote status of a comment
  getDownvoteStatus(comment, userId) {
    if (comment.downvotes.includes(userId)) {
      return true;
    }
    return false;
  }
}

module.exports = new CommentService();

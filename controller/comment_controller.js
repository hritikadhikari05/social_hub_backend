const Admin = require("../models/admin_model");
const Moderator = require("../models/moderator_model");
const PersonalWall = require("../models/personalWall_model");
const Comment = require("../models/comment_model");
const Post = require("../models/post_model");
const CommentDto = require("../dto/comment_dto");
const NewComment = require("../models/new_comment_model");
const ReplyComment = require("../models/replies_model");
/* Create Comment */
exports.createComment = async (req, res) => {
  try {
    const { content, parent_type, comment_id } = req.body;
    const { userId } = req.user;
    const { post_id } = req.params;
    let comment_context = "";
    let parent_id = "";

    //Check if parent_type is POST or COMMENT
    if (parent_type == "POST") {
      parent_id = post_id;
    } else if (parent_type == "COMMENT") {
      /* Find comment by id and increase the reply count */
      const comment = await Comment.findById(comment_id);
      if (!comment) {
        return res.status(404).json({
          message: "No comment found with this id",
        });
      }
      comment.replies_count++;
      await comment.save();
      parent_id = comment_id;
    } else {
      return res.status(400).json({
        message: "Invalid Parent Type",
      });
    }

    //Check For comment Context in Admin Schema and Moderator Schema
    const admin = await Admin.findOne({
      admin_id: userId,
    });
    const moderator = await Moderator.findOne({
      user_id: userId,
    });
    const personalWall = await PersonalWall.findOne({
      user_id: userId,
    });

    //Set the value of comment_context by checking if the user is admin
    //moderator or normal user
    if (personalWall.user_id != null) {
      comment_context = "ADMIN";
    } else if (admin.admin_id != null) {
      comment_context = "ADMIN";
    } else if (moderator.user_id != null) {
      comment_context = "MODERATOR";
    } else {
      comment_context = "USER";
    }
    //Create a new comment
    const newComment = new Comment({
      content,
      author_id: userId,
      post_id,
      comment_context,
      parent_type,
      parent_id,
    });
    const postedComment = await newComment.save();

    //Find comment by id
    const comment = await Comment.findById(postedComment._id).populate(
      "author_id"
    );

    /*Increase the comment count of the post*/
    const post = await Post.findById(post_id);
    post.comment_count++;
    post.save();

    return res.status(200).json({
      message: "Comment Created Successfully",
      data: new CommentDto(comment, userId),
    });
  } catch (error) {
    res.status(500).json({ message: "Something Went Wrong." });
  }
};

/* Get All Comments */
exports.getComments = async (req, res) => {
  const { userId } = req.user;
  try {
    const { post_id } = req.params;
    const limit = parseInt(req.query.limit) || 10; // Limit the post

    const page = parseInt(req.query.page) || 1; //Limit the page

    const skip = (page - 1) * limit; // Skip the post

    //Count the total number of comments
    const totalComments = await Comment.countDocuments({
      post_id,
      parent_type: "POST",
    });

    //Get all the comments for a particular post
    const comments = await Comment.find({
      post_id,
      parent_type: "POST",
    })
      .skip(skip)
      .limit(limit)
      .populate("author_id");

    if (!comments) {
      res.status(400).json({
        message: "No Comments Found",
      });
    }

    // const isUpvoted = ;

    res.status(200).json({
      message: "Comments Fetched Successfully",
      data: comments.map((comment) => new CommentDto(comment, userId)),
      totalPages: Math.ceil(totalComments / limit),
      // data: comments,
    });
  } catch (error) {
    // console.log(error.message);
    res.status(500).json({ message: "Something Went Wrong." });
  }
};

/* Get Comment Replies */
exports.getCommentReplies = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { userId } = req.user;

    //Get all the replies for a particular comment
    const replies = await Comment.find({
      parent_id: comment_id,
    }).populate("author_id");
    if (!replies) {
      res.status(400).json({
        message: "No Replies Found",
      });
    }
    res.status(200).json({
      message: "Replies Fetched Successfully",
      data: replies.map((reply) => new CommentDto(reply, userId)),
    });
  } catch (error) {
    res.status(500).json("Something Went Wrong.");
  }
};

/* Upvote Comment */
exports.upvoteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { userId } = req.user;

    const comment = await Comment.findById(comment_id);

    if (!comment) {
      return res.status(404).json({ message: "No comment found" });
    }

    /* Check if the user has downvoted or not */
    if (comment.downvotes.includes(userId)) {
      comment.downvotes.pull(userId);
      comment.downvotes_count--;
    }

    /* Check if the user has already upvoted or not */
    if (comment.upvotes.includes(userId)) {
      comment.upvotes.pull(userId);
      comment.upvotes_count--;
      comment.save();
      return res.status(200).json({
        message: "You have taken back your upvote",
      });
    }

    /* If the user has neither upvoted nor downvoted then 
    push the user id to the upvotes and increase the count
    */
    comment.upvotes.push(userId);
    comment.upvotes_count++;
    comment.save();

    return res.status(200).json({
      message: "Comment Upvoted Successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json("Something Went Wrong.");
  }
};

/* Downvote Comment */
exports.downvoteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { userId } = req.user;

    /* Get commet by comment Id */
    const comment = await Comment.findById(comment_id);

    if (!comment) {
      return res.status(404).json({ message: "No comment found" });
    }

    /* Check if the user has upvoted or not */
    if (comment.upvotes.includes(userId)) {
      comment.upvotes.pull(userId);
      comment.upvotes_count--;
    }

    /* Check if the user has already upvoted or not */
    if (comment.downvotes.includes(userId)) {
      comment.downvotes.pull(userId);
      comment.downvotes_count--;
      comment.save();
      return res.status(200).json({
        message: "You have taken back your downvote",
      });
    }

    /* If the user has neither upvoted nor downvoted then 
    push the user id to the upvotes and increase the count
    */
    comment.downvotes.push(userId);
    comment.downvotes_count++;
    comment.save();
    res.status(200).json({
      message: "Comment downvoted Successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json("Something Went Wrong.");
  }
};

/* Delete Comment and their replies */
exports.deleteComment = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { userId } = req.user;

    //Delete the comment
    const comment = await Comment.findOneAndDelete({
      _id: comment_id,
      author_id: userId,
    });
    if (!comment) {
      res.status(400).json({
        message: "No Comment Found",
      });
    } else {
      //Delete all the replies of the comment
      await Comment.deleteMany({
        parent_id: comment_id,
      });
      res.status(200).json({
        message: "Comment Deleted Successfully",
      });
    }
  } catch (error) {
    res.status(500).json("Something Went Wrong.");
  }
};

/* Get comment by ID */
exports.getCommentById = async (req, res) => {
  const { comment_id } = req.params;
  const { userId } = req.user;

  try {
    const comment = await Comment.findById(comment_id).populate("author_id");
    if (!comment) {
      res.status(400).json({
        message: "No Comment Found",
      });
    }
    res.status(200).json({
      message: "Comment Fetched Successfully",
      data: new CommentDto(comment, userId),
    });
  } catch (error) {
    res.status(500).json("Something Went Wrong.");
  }
};

///New comment testing
exports.createNewComment = async (req, res) => {
  const { userId } = req.user;
  const { post_id } = req.params;
  const { content } = req.body;
  let comment_context = "";

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status.json({
        message: "No post found",
      });
    }
    //Check For comment Context in Admin Schema and Moderator Schema
    const admin = await Admin.findOne({
      admin_id: userId,
    });
    const moderator = await Moderator.findOne({
      user_id: userId,
    });
    const personalWall = await PersonalWall.findOne({
      user_id: userId,
    });

    //Set the value of comment_context by checking if the user is admin
    //moderator or normal user
    if (personalWall.user_id != null) {
      comment_context = "ADMIN";
    } else if (admin.admin_id != null) {
      comment_context = "ADMIN";
    } else if (moderator.user_id != null) {
      comment_context = "MODERATOR";
    } else {
      comment_context = "USER";
    }

    const comment = await NewComment.create({
      content,
      author_id: userId,
      post_id,
      comment_context,
      // replies: [],
    });
    res.status(200).json({
      message: "Comment Created Successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json("Something Went Wrong.");
  }
};

//Get Comments
exports.getNewComments = async (req, res) => {
  try {
    const comments = await NewComment.find();
    if (comments.length == 0) {
      return res.status(404).json({
        message: "No comments found",
      });
    }
    return res.status(200).json({
      message: "Comments Fetched Successfully",
      data: comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//Reply Comment
exports.createReply = async (req, res) => {
  const { post_id } = req.params;
  const { userId } = req.user;
  const { content } = req.body;
  let comment_context = "";

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status.json({
        message: "No post found",
      });
    }
    //Check For comment Context in Admin Schema and Moderator Schema
    const admin = await Admin.findOne({
      admin_id: userId,
    });
    const moderator = await Moderator.findOne({
      user_id: userId,
    });
    const personalWall = await PersonalWall.findOne({
      user_id: userId,
    });

    //Set the value of comment_context by checking if the user is admin
    //moderator or normal user
    if (personalWall.user_id != null) {
      comment_context = "ADMIN";
    } else if (admin.admin_id != null) {
      comment_context = "ADMIN";
    } else if (moderator.user_id != null) {
      comment_context = "MODERATOR";
    } else {
      comment_context = "USER";
    }

    const comment = await ReplyComment.create({
      content,
      author_id: userId,
      post_id,
      comment_context,
      // replies: [],
    });
    res.status(200).json({
      message: "Comment Created Successfully",
      data: comment,
    });
  } catch (error) {}
};

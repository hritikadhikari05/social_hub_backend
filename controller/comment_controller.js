const Admin = require("../models/admin_model");
const Moderator = require("../models/moderator_model");
const PersonalWall = require("../models/personalWall_model");
const Comment = require("../models/comment_model");

/* Create Comment */
exports.createComment = async (req, res) => {
  try {
    const { content, parent_type, comment_id } =
      req.body;
    const { userId } = req.user;
    const { post_id } = req.params;
    let comment_context = "";
    let parent_id = "";

    //Check if parent_type is POST or COMMENT
    if (parent_type == "POST") {
      parent_id = post_id;
    } else if (parent_type == "COMMENT") {
      parent_id = comment_id;
    } else {
      res.status(400).json({
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
    const personalWall =
      await PersonalWall.findOne({
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
    const newComment = await Comment({
      content,
      author_id: userId,
      post_id,
      comment_context,
      parent_type,
      parent_id,
    });
    newComment
      .save()
      .then((comment) => {
        res.status(200).json({
          message: "Comment Created Successfully",
          data: newComment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          message: "Error adding comment",
        });
      });
  } catch (error) {
    res.status(500).json(error);
  }
};

/* Get All Comments */
exports.getComments = async (req, res) => {
  try {
    const { post_id } = req.body;
    const { userId } = req.user;

    //Get all the comments for a particular post
    const comments = await Comment.find({
      post_id,
    });
    if (!comments) {
      res.status(400).json({
        message: "No Comments Found",
      });
    }
    res.status(200).json({
      message: "Comments Fetched Successfully",
      data: comments,
    });
  } catch (error) {
    res.status(500).json("Something Went Wrong.");
  }
};

/* Get Comment Replies */
exports.getCommentReplies = async (req, res) => {
  try {
    const { comment_id } = req.body;
    const { userId } = req.user;

    //Get all the replies for a particular comment
    const replies = await Comment.find({
      parent_id: comment_id,
    });
    if (!replies) {
      res.status(400).json({
        message: "No Replies Found",
      });
    }
    res.status(200).json({
      message: "Replies Fetched Successfully",
      data: replies,
    });
  } catch (error) {
    res.status(500).json("Something Went Wrong.");
  }
};

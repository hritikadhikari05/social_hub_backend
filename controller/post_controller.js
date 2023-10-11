const { default: mongoose } = require("mongoose");
const Post = require("../models/post_model");
const User = require("../models/user_model");
const { post } = require("../routes/auth_routes");
const Comment = require("../models/comment_model");
const BookMarks = require("../models/bookmarks_model");
const PostService = require("../services/post_service");

exports.addReportsField = async (req, res) => {
  // try {
  //   /* Add isbookmarked field to the post model */
  //   const posts = await User.updateMany(
  //     {},
  //     {
  //       $set: {
  //         otp: "",
  //       },
  //     },
  //     { multi: true }
  //   );
  //   res.status(201).json({
  //     message: "User updated successfully added",
  //   });
  // } catch (error) {
  //   console.log(error.message);
  //   res
  //     .status(500)
  //     .json({ message: error.message });
  // }

  const { userId } = req.user;
  try {
    /* add followers, following, followers_count, following_count field to the User  database*/
    try {
      // const user = await User.updateMany(
      //   {},
      //   {
      //     $set: {
      //       followers: [],
      //       following: [],
      //       followers_count: 0,
      //       following_count: 0,
      //     },
      //   }
      // );
      // res.status(201).json({
      //   message: "Fields added successfully",
      // });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }

    /*------- Add multiple posts to the post schema------------*/
    // for (i = 0; i < 50; i++) {
    //   const newPost = new Post({
    //     title: "This is post title number" + i,
    //     content:
    //       "This is post content number" + i,
    //     author: userId,
    //     community_id: userId,
    //     is_sticked: false,
    //     tags: [],
    //   });

    //   await newPost.save();
    // }

    /* Add comment_count field to the post model */
    // const comment = await Comment.updateMany(
    //   {},
    //   {
    //     $set: {
    //       replies_count: 0,
    //     },
    //   },
    //   { multi: true }
    // );

    // console.log(comment);

    // res.status(201).json({
    //   message: "Comment field added successfully",
    // });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

/* Create Post */
exports.createPost = async (req, res) => {
  const { title, content, tags, community_id } = req.body;
  const { userId } = req.user;

  // Save new post
  try {
    // Create new post
    const newPost = new Post({
      title,
      content,
      author: userId,
      community: community_id ? community_id : userId,
      is_sticked: false,
      tags: tags ? tags : [],
    });
    await newPost.save();
    return res.status(200).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* Get Single Post */
exports.getPost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId)
      .populate({
        path: "author",
        select: "userName firstName lastName bio profilePic",
      })
      .populate({
        path: "community",
        select: "name displayName description icon_image",
      });

    if (!post) {
      return res.status(400).json({
        message: "No post found",
      });
    }

    post.view_count++;
    post.save();

    /* Check if the post is bookmarked by the user and return isBookmarked in repsonse */
    // const postWithBookmark = await BookMarks.findOne({ user_id: req.user.userId, post: postId });
    const postWithBookmark = await PostService.addBookmarkFieldToTheSinglePost(
      post,
      req.user.userId
    );

    return res.status(200).json({
      message: "Post found",
      data: postWithBookmark,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* Get All Posts */
exports.getAllPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Limit the post

    const page = parseInt(req.query.page) || 1; //Limit the page

    const skip = (page - 1) * limit; // Skip the post

    /* Get the count */
    const totalItems = await Post.countDocuments({
      $and: [{ report_count: { $lt: 10 } }, { is_blocked: false }],
    });

    //Display post with report count less than 10 and is_blocked is false
    const post = await Post.find({
      $and: [{ report_count: { $lt: 10 } }, { is_blocked: false }],
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "userName firstName lastName bio profilePic",
      })
      .populate({
        path: "community",
        select: "name displayName description icon_image",
      });
    if (!post) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }

    /* Check if the post is bookmarked by the user and return isBookmarked in repsonse */
    const postWithBookmark = await PostService.addBookmarkFieldToThepost(
      post,
      req.user.userId
    );

    return res.status(200).json({
      message: "Posts found",
      data: postWithBookmark,
      hits: post.length,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get All Posts with report count greater than 5 and is_blocked is true */
exports.getAllBlockedPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Limit the post

    const page = parseInt(req.query.page) || 1; //Limit the page

    const skip = (page - 1) * limit; // Skip the post

    const totalItems = await Post.countDocuments({
      $and: [{ report_count: { $gt: 5 } }, { is_blocked: true }],
    });

    //Display post with report count greater than 5 and is_blocked is true
    const post = await Post.find({
      $and: [{ report_count: { $gt: 5 } }, { is_blocked: true }],
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "userName firstName lastName bio profilePic",
      })
      .populate({
        path: "community",
        select: "name displayName description icon_image",
      });

    if (!post) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }
    return res.status(200).json({
      message: "Posts found",
      data: post,
      hits: post.length,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* 
Unblock Post which has report count > than 5 but < 10 and
change the status of is_blocked to false
*/

exports.unblockPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (post.report_count > 5 && post.report_count < 10) {
      post.is_blocked = false;
      post.save();
      return res.status(200).json({
        message: "Post unblocked successfully",
      });
    }
    return res.status(400).json({
      message: "Post cannot be unblocked",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Report Post by Post Id */
exports.reportPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    /* If user has already reported the post */
    if (post.reports.includes(userId)) {
      return res.status(400).json({
        message: "You have already reported post",
      });
    }

    /* If report count is 5 then block the post */
    if (post.report_count == 5) {
      post.is_blocked = true;
      post.save();
    }

    post.reports.push(userId);
    post.report_count++;
    post.save();

    res.status(200).json({
      message: "Post reported successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Unreport Post by Post Id */
exports.unreportPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found.",
      });
    }

    if (!post.reports.includes(userId)) {
      return res.status(400).json({
        message: "You have not reported post",
      });
    }

    post.reports.pull(userId);
    post.report_count--;
    post.save();

    res.status(200).json({
      message: "Post unreported successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong.",
    });
  }
};

/* Get All Posts By User */
exports.getAllPostsByUser = async (req, res) => {
  const { userId } = req.user;
  const limit = parseInt(req.query.limit) || 10; // Limit the post

  const page = parseInt(req.query.page) || 1; //Limit the page

  const skip = (page - 1) * limit; // Skip the post
  try {
    /* Get the count */
    const totalItems = await Post.countDocuments({
      author: userId,
    });

    const posts = await Post.find({
      author: userId,
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "userName firstName lastName bio profilePic",
      })
      .populate({
        path: "community",
        select: "name displayName description icon_image",
      });

    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }

    const postWithBookmark = await PostService.addBookmarkFieldToThepost(
      posts,
      req.user.userId
    );

    return res.status(200).json({
      message: "Posts found",
      data: postWithBookmark,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get all post by user id */
exports.getAllPostsByUserId = async (req, res) => {
  const { userId } = req.params;
  const limit = parseInt(req.query.limit) || 10; // Limit the post

  const page = parseInt(req.query.page) || 1; //Limit the page

  const skip = (page - 1) * limit; // Skip the post

  try {
    /* Get the count */
    const totalItems = await Post.countDocuments({
      $and: [
        { author: userId },
        { report_count: { $lt: 10 } },
        { is_blocked: false },
      ],
    });

    const posts = await Post.find({
      $and: [
        { author: userId },
        { report_count: { $lt: 10 } },
        { is_blocked: false },
      ],
    })

      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "userName firstName lastName bio profilePic",
      })
      .populate({
        path: "community",
        select: "name displayName description icon_image",
      });

    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }

    const postWithBookmark = await PostService.addBookmarkFieldToThepost(
      posts,
      req.user.userId
    );

    return res.status(200).json({
      message: "Posts found",
      data: postWithBookmark,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get All Posts By Community Id */
exports.getAllPostsByCommunity = async (req, res) => {
  const { communityId } = req.params;

  const limit = parseInt(req.query.limit) || 10; // Limit the post
  const page = parseInt(req.query.page) || 1; //Limit the page
  const skip = (page - 1) * limit; // Skip the post

  try {
    /* Get the count */
    const totalItems = await Post.countDocuments({
      community: communityId,
    });

    const posts = await Post.find({
      community: communityId,
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "userName firstName lastName bio profilePic",
      })
      .populate({
        path: "community",
        select: "name displayName description icon_image",
      });
    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }

    const postWithBookmark = await PostService.addBookmarkFieldToThepost(
      posts,
      req.user.userId
    );

    return res.status(200).json({
      message: "Posts found",
      data: postWithBookmark,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get latest Posts */
exports.getLatestPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Limit the post
  const page = parseInt(req.query.page) || 1; //Limit the page
  const skip = (page - 1) * limit; // Skip the post
  try {
    /* Get the count */
    const totalItems = await Post.countDocuments().sort({
      createdAt: -1,
    });

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "userName firstName lastName bio profilePic",
      })
      .populate({
        path: "community",
        select: "name displayName description icon_image",
      });
    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }

    const postWithBookmark = await PostService.addBookmarkFieldToThepost(
      posts,
      req.user.userId
    );

    return res.status(200).json({
      message: "Posts found",
      data: postWithBookmark,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get trending Posts */
exports.getTrendingPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Limit the post
  const page = parseInt(req.query.page) || 1; //Limit the page
  const skip = (page - 1) * limit; // Skip the post
  try {
    /* Get the count */
    const totalItems = await Post.countDocuments().sort({
      upvotes_count: -1,
    });

    const posts = await Post.find()
      .sort({ upvotes_count: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "userName firstName lastName bio profilePic",
      })
      .populate({
        path: "community",
        select: "name displayName description icon_image",
      });
    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }

    const postWithBookmark = await PostService.addBookmarkFieldToThepost(
      posts,
      req.user.userId
    );

    return res.status(200).json({
      message: "Posts found",
      data: postWithBookmark,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get Most Viewed Posts */
exports.getMostViewedPosts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Limit the post
  const page = parseInt(req.query.page) || 1; //Limit the page
  const skip = (page - 1) * limit; // Skip the post
  try {
    /* Get the count */
    const totalItems = await Post.countDocuments().sort({
      view_count: -1,
    });

    const posts = await Post.find()
      .sort({ view_count: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "userName firstName lastName bio profilePic",
      })
      .populate({
        path: "community",
        select: "name displayName description icon_image",
      });
    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }

    const postWithBookmark = await PostService.addBookmarkFieldToThepost(
      posts,
      req.user.userId
    );

    return res.status(200).json({
      message: "Posts found",
      data: postWithBookmark,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Delete post by id */
exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    // console.log(post.author, userId);
    if (post.author != userId) {
      return res.status(401).json({
        message: "You are not authorized",
      });
    }
    post.deleteOne();

    /* Delete all the comments of the post */
    await Comment.deleteMany({
      post_id: postId,
    });

    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Upvote post by id and increase the count */
exports.upvotePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const upvotePost = await Post.findById(postId);

    if (!upvotePost) {
      console.log("hello");
      return res.status(404).json({
        message: "No post found",
      });
    }
    /* Check if ther user has downvoted the 
      same post ::
      Yes: delete from downvote and decrease count
      No: Upvote Post
    */
    if (upvotePost.downvotes.includes(userId)) {
      upvotePost.downvotes.pull(userId);
      upvotePost.downvotes_count--;
      // upvotePost.save();
    }

    if (upvotePost.upvotes.includes(userId)) {
      upvotePost.upvotes.pull(userId);
      upvotePost.upvotes_count--;
      upvotePost.save();
      return res.status(200).json({
        message: "You have taken back your upvote",
      });
    }
    upvotePost.upvotes.push(userId);
    upvotePost.upvotes_count++;
    await upvotePost.save();

    return res.status(200).json({
      message: "Sucessfully upvoted",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Downvote post by id and increase the downvote_count and decrease the upvote_count  */
exports.downvotePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    const downvotePost = await Post.findById(postId);

    if (!downvotePost) {
      return res.status(404).json({
        message: "No post found",
      });
    }
    /* Check if ther user has upvoted the 
      same post ::
      Yes: delete from upvote and decrease count
      No: Downvote Post
    */
    if (downvotePost.upvotes.includes(userId)) {
      downvotePost.upvotes.pull(userId);
      downvotePost.upvotes_count--;
    }

    if (downvotePost.downvotes.includes(userId)) {
      downvotePost.downvotes.pull(userId);
      downvotePost.downvotes_count--;
      downvotePost.save();
      return res.status(200).json({
        message: "You have taken back your downvote",
      });
    }
    downvotePost.downvotes.push(userId);
    downvotePost.downvotes_count++;
    await downvotePost.save();

    return res.status(200).json({
      message: "Sucessfully downvoted",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Edit post by id */
exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;
  const { title, content, tags } = req.body;

  try {
    await Post.findById(postId)
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        if (post.author != userId) {
          return res.status(401).json({
            message: "You are not authorized",
          });
        }
        post.title = title;
        post.content = content;
        post.tags = tags ? tags : [];
        post.save();
        return res.status(200).json({
          message: "Post edited successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "No post found",
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get Posts by user following */

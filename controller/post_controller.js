const Post = require("../models/post_model");
const { post } = require("../routes/auth_routes");

/* Add reports field to the post model */
exports.addReportsField = async (req, res) => {
  try {
    for (i = 11; i <= 10; i++) {
      const posts = new Post({
        title: `This is the reddit post ${i}`,
        content:
          "This its the content of the reddit post for checking the comments",
        author: req.user.userId,
        community_id: req.user.userId,
      });
      await posts.save();
    }

    res.status(201).json({
      message: "Post successfully added",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message });
  }
};

/* Create Post */
exports.createPost = async (req, res) => {
  const { title, content, tags, community_id } =
    req.body;
  const { userId } = req.user;

  // Create new post
  const newPost = new Post({
    title,
    content,
    author: userId,
    community_id: community_id
      ? community_id
      : userId,
    is_sticked: false,
    tags: tags ? tags : [],
  });

  // Save new post
  try {
    await newPost
      .save()
      .then((post) => {
        return res.status(200).json({
          message: "Post created successfully",
          post,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: err,
        });
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
    // await Post.findById(postId)
    //   .then((post) => {
    //     if (!post) {
    //       return res.status(404).json({
    //         message: "Post not found",
    //       });
    //     }
    //     post.view_count++;
    //     post.save();
    //     return res.status(200).json({
    //       message: "Post found",
    //       data: post,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     return res.status(400).json({
    //       message: "No post found",
    //     });
    //   });
    const post = await Post.findById(
      postId
    ).populate({
      path: "author",
      select:
        "userName firstName lastName bio profilePic",
    });

    if (!post) {
      return res.status(400).json({
        message: "No post found",
      });
    }

    post.view_count++;
    post.save();

    return res.status(200).json({
      message: "Post found",
      data: post,
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
      $and: [
        { report_count: { $lt: 10 } },
        { is_blocked: false },
      ],
    });

    //Display post with report count less than 10 and is_blocked is false
    const post = await Post.find({
      $and: [
        { report_count: { $lt: 10 } },
        { is_blocked: false },
      ],
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select:
          "userName firstName lastName bio profilePic",
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

/* Get All Posts with report count greater than 5 and is_blocked is true */
exports.getAllBlockedPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Limit the post

    const page = parseInt(req.query.page) || 1; //Limit the page

    const skip = (page - 1) * limit; // Skip the post

    const totalItems = await Post.countDocuments({
      $and: [
        { report_count: { $gt: 5 } },
        { is_blocked: true },
      ],
    });

    //Display post with report count greater than 5 and is_blocked is true
    const post = await Post.find({
      $and: [
        { report_count: { $gt: 5 } },
        { is_blocked: true },
      ],
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select:
          "userName firstName lastName bio profilePic",
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
    if (
      post.report_count > 5 &&
      post.report_count < 10
    ) {
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
      author_id: userId,
    });

    const posts = await Post.find({
      author_id: userId,
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select:
          "userName firstName lastName bio profilePic",
      });

    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }
    return res.status(200).json({
      message: "Posts found",
      data: posts,
      totalPages: Math.ceil(totalItems / limit),
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get All Posts By Community Id */
exports.getAllPostsByCommunity = async (
  req,
  res
) => {
  const { communityId } = req.body;

  const limit = parseInt(req.query.limit) || 10; // Limit the post
  const page = parseInt(req.query.page) || 1; //Limit the page
  const skip = (page - 1) * limit; // Skip the post

  try {
    /* Get the count */
    const totalItems = await Post.countDocuments({
      community_id: communityId,
    });

    const posts = await Post.find({
      community_id: communityId,
    })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select:
          "userName firstName lastName bio profilePic",
      });
    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }
    return res.status(200).json({
      message: "Posts found",
      data: posts,
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
    const totalItems =
      await Post.countDocuments().sort({
        createdAt: -1,
      });

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select:
          "userName firstName lastName bio profilePic",
      });
    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }
    return res.status(200).json({
      message: "Posts found",
      data: posts,
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
    const totalItems =
      await Post.countDocuments().sort({
        upvotes_count: -1,
      });

    const posts = await Post.find()
      .sort({ upvotes_count: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select:
          "userName firstName lastName bio profilePic",
      });
    if (!posts) {
      return res.status(404).json({
        message: "Posts not found",
      });
    }
    return res.status(200).json({
      message: "Posts found",
      data: posts,
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
    await Post.findById(postId)
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        if (post.author_id != userId) {
          return res.status(401).json({
            message: "You are not authorized",
          });
        }
        post.remove();
        return res.status(200).json({
          message: "Post deleted successfully",
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

/* Upvote post by id and increase the count */
exports.upvotePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    await Post.findById(postId)
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        if (post.upvotes.includes(userId)) {
          return res.status(400).json({
            message: "You have already upvoted",
          });
        }
        post.upvotes.push(userId);
        post.upvotes_count++;
        post.save();
        return res.status(200).json({
          message: "Post upvoted successfully",
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

/* Downvote post by id and increase the downvote_count and decrease the upvote_count  */
exports.downvotePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.user;

  try {
    await Post.findById(postId)
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        if (post.downvotes.includes(userId)) {
          return res.status(400).json({
            message: "You have already downvoted",
          });
        }
        post.downvotes.push(userId);
        post.downvotes_count++;
        // post.upvotes_count--;
        post.save();
        return res.status(200).json({
          message: "Post downvoted successfully",
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
        if (post.author_id != userId) {
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

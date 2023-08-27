const Post = require("../models/post_model");

/* Create Post */
exports.createPost = async (req, res) => {
  const { title, content, tags, community_id } =
    req.body;
  const { userId } = req.user;

  // Create new post
  const newPost = new Post({
    title,
    content,
    author_id: userId,
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
      message: "Something went wrong",
    });
  }
};

/* Get Post */
exports.getPost = async (req, res) => {
  const { postId } = req.params;

  try {
    await Post.findById(postId)
      .then((post) => {
        if (!post) {
          return res.status(404).json({
            message: "Post not found",
          });
        }
        post.view_count++;
        post.save();
        return res.status(200).json({
          message: "Post found",
          data: post,
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

/* Get All Posts */
exports.getAllPosts = async (req, res) => {
  try {
    await Post.find()
      .then((posts) => {
        if (!posts) {
          return res.status(404).json({
            message: "Posts not found",
          });
        }
        return res.status(200).json({
          message: "Posts found",
          data: posts,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "No posts found",
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get All Posts By User */
exports.getAllPostsByUser = async (req, res) => {
  const { userId } = req.user;

  try {
    await Post.find({ author_id: userId })
      .then((posts) => {
        if (!posts) {
          return res.status(404).json({
            message: "Posts not found",
          });
        }
        return res.status(200).json({
          message: "Posts found",
          data: posts,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "No posts found",
        });
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

  try {
    await Post.find({ community_id: communityId })
      .then((posts) => {
        if (!posts) {
          return res.status(404).json({
            message: "Posts not found",
          });
        }
        return res.status(200).json({
          message: "Posts found",
          data: posts,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "No posts found",
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get latest Posts */
exports.getLatestPosts = async (req, res) => {
  try {
    await Post.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .then((posts) => {
        if (!posts) {
          return res.status(404).json({
            message: "Posts not found",
          });
        }
        return res.status(200).json({
          message: "Posts found",
          data: posts,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "No posts found",
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/* Get trending Posts */
exports.getTrendingPosts = async (req, res) => {
  try {
    await Post.find()
      .sort({ upvotes_count: -1 })
      .limit(10)
      .then((posts) => {
        if (!posts) {
          return res.status(404).json({
            message: "Posts not found",
          });
        }
        return res.status(200).json({
          message: "Posts found",
          data: posts,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: "No posts found",
        });
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

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

/* Get All Posts By Community */
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

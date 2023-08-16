const Post = require("../models/post_model");

/* Create Post */
exports.createPost = async (req, res) => {
  const { title, content } = req.body;
  const { userId } = req.user;

  // Create new post
  const newPost = new Post({
    title,
    content,
    author_id: userId,
    community_id: null,
    is_sticked: false,
  });

  // Save new post
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
};

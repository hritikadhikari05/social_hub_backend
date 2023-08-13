const getPosts = require("./get-posts");
const getPost = require("./get-post");
const createPost = require("./create-post");
const updatePost = require("./update-post");
const deletePost = require("./delete-post");

module.exports = {
  paths: {
    "/posts": {
      ...getPosts,
      ...createPost,
    },
    "/posts/{id}": {
      ...getPost,
      ...updatePost,
      ...deletePost,
    },
  },
};

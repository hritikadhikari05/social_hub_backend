const basicInfo = require("./basicInfo");
const servers = require("./server");
const components = require("./components");
const tags = require("./tags");
const posts = require("./posts");

module.exports = {
  ...basicInfo,
  ...servers,
  ...components,
  ...tags,
  ...posts,
};

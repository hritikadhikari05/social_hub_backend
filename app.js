const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const auth_routes = require("./routes/auth_routes.js");
const post_routes = require("./routes/post_routes.js");
const comment_routes = require("./routes/comment_routes.js");
const community_routes = require("./routes/community_routes.js");
const fileupload_routes =
  require("./routes/fileupload_routes.js").router;
const bookmark_routes = require("./routes/bookmark_routes.js");

/* Middlewares */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev")); //Morgan package for getting the request URL

/* Routes */
app.use("/", (req, res) => {
  res.send("Serve is Working");
});
app.use("/api/auth", auth_routes);
app.use("/api/post", post_routes);
app.use("/api/comment", comment_routes);
app.use("/api/community", community_routes);
app.use("/api/uploads", fileupload_routes);
app.use("/api/bookmarks", bookmark_routes);

/* Error Routes */
app.all("*", (req, res, next) => {
  return next(
    res.status(500).send({
      status: "fail",
      message: `Can't find ${req.originalUrl} on this server!`,
    })
  ); // Here will assume that this is an error and skip all middlewares forward to the error handler middleware we defined
});

module.exports = app;

const express = require("express");
const router = express.Router();

router.get("*", (req, res, next) => {
  return res.status(500).send({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  }); // Here will assume that this is an error and skip all middlewares forward to the error handler middleware we defined
});
module.exports = router;

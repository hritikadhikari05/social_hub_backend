const express = require("express");
const router = express.Router();

router.get("/error", (req, res) => {
  res.send({
    error: "Something went wrong",
  });
});

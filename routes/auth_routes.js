const express = require("express");
const router = express.Router();

const auth_controller = require("../controller/auth_controller.js");
const authCheck = require("../middlewares/auth_middleware");

/* Register a new user */
router.post(
  "/register",
  auth_controller.register
);

/* Login a user */
router.post("/login", auth_controller.login);

/* Get user details */
router.get(
  "/user-details",
  authCheck,
  auth_controller.getUserDetails
);

/* Reset Password */
router.put(
  "/reset-password",
  authCheck,
  auth_controller.resetPassword
);
module.exports = router;

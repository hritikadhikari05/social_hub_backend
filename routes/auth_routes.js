const express = require("express");
const router = express.Router();

const auth_controller = require("../controller/auth_controller.js");
const authCheck = require("../middlewares/auth_middleware");

/* Register a new user */
router.post("/register", auth_controller.register);

/* Login a user */
router.post("/login", auth_controller.login);

/* Get user details */
router.get("/user-details", authCheck, auth_controller.getUserDetails);

/* Reset Password */
router.put("/reset-password", authCheck, auth_controller.resetPassword);

/* Get User Details by Id */
router.get(
  "/user-details/:userId",
  authCheck,
  auth_controller.getUserDetailsById
);

/* Delete logged in user */
router.delete("/delete-user", authCheck, auth_controller.deleteUser);

/* Verify Otp */
router.post("/verify-otp", authCheck, auth_controller.verifyOtp);

/* Update userdetails by id*/
router.put(
  "/update-user/:userId",
  authCheck,
  auth_controller.updateUserDetailsById
);

module.exports = router;

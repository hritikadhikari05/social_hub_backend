const User = require("../models/user_model");
const Post = require("../models/post_model");
const PersonalWall = require("../models/personalWall_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { sendOtp } = require("../utils/utils");
const { checkFileExistsInSpace } = require("../utils/file_upload");

/*create token */
const createToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
};

/* Registration */
exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    gender,
    confirmPassword,
    phoneNo,
    bio,
  } = req.body;
  try {
    /* Check if the email exists or not */
    const userWithEmailOrUserNameOrPhone = await User.findOne({
      $or: [{ userName: userName }, { email: email }, { phoneNo: phoneNo }],
    });

    if (userWithEmailOrUserNameOrPhone) {
      return res.status(404).json({
        message: "Email or Username or Phone is already registered",
      });
    }

    /* Check if the password and confirm password are same */
    if (password !== confirmPassword) {
      return res.status(404).json({
        message: "Password and confirm password are not same",
      });
    }

    /* Hash the password */
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    /* ---/////////////////////Generate Otp ///////////////////////
    ---------------------------            ------------------------
    */
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      specialChars: false,
    });

    // // console.log(otp);
    const otpResponse = await sendOtp(phoneNo, otp);

    /* Create new user */
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      phoneNo: `+91${phoneNo}`,
      password: hashedPassword,
      gender,
      bio,
      otp,
    });

    /* Save new user */
    await newUser.save();

    /* Create token */
    const token = createToken(newUser._id);

    /* Register user in personal wall as Community wall */
    const newPersonalWall = new PersonalWall({
      user_id: newUser._id,
    });
    await newPersonalWall.save();
    return res.status(201).json({
      message: "User created successfully",
      token: token,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(400).json({
      message: "Something went wrong",
    });
  }
};

/* -----------------------------------------------Login------------------------------------------- 
-----------------------------------------------------------------------------------------------
*/
exports.login = async (req, res) => {
  const { password, email } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ userName: email }, { email: email }, { phoneNo: email }],
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password",
      });
    }

    return res.status(200).json({
      message: "User logged in successfully",
      token: createToken(user),
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* Reset Password */
exports.resetPassword = async (req, res) => {
  const { userId } = req.user;
  //Reset Password
  const { oldPassword, newPassword } = req.body;

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(newPassword, salt);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Old password is incorrect",
      });
    }

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
      token: createToken(user),
    });
  } catch (error) {
    return res.status(400).json({
      message: "Internal server error",
    });
  }
};

/* Get user details */
exports.getUserDetails = (req, res) => {
  User.findById(req.user.userId)
    .then((user) => {
      return res.status(200).json({
        message: "User found",
        data: user,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        message: err,
      });
    });
};

/* Get user details by id */
exports.getUserDetailsById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User found",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

/* Delete logged in User */
exports.deleteUser = async (req, res) => {
  const { userId } = req.user;
  try {
    const user = await User.findOne({
      _id: userId,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
      });
    }

    // if (user) {
    // console.log("hello from c");
    await user.deleteOne();

    /* Cascade delete for user posts from model*/
    await Post.deleteMany({
      author: userId,
    });
    // }

    return res.status(200).json({
      message: "User successfully deleted.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
Login/Signup: Using Mobile Number
OTP Based Login
*/

/* //////////------VERIFY OTP---------///////////// */
exports.verifyOtp = async (req, res) => {
  const { userId } = req.user;
  const { otp } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    /* Verify Otp form database */
    if (user.otp === otp) {
      user.otp = "";
      user.save();
      return res.status(200).json({
        message: "User verified successfully",
      });
    }
    return res.status(400).json({
      message: "You have entered wrong otp.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

//* Update User details */
exports.updateUserDetailsById = async (req, res) => {
  const { firstName, lastName, bio, gender } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    user.firstName = firstName ? firstName : user.firstName;
    user.lastName = lastName ? lastName : user.lastName;
    user.bio = bio ? bio : user.bio;
    user.gender = gender ? gender : user.gender;
    await user.save();

    return res.status(200).json({
      message: "User details updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* Follow user */
exports.followUser = async (req, res) => {
  const { userId } = req.user;
  const { userToFollowId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({
        message: "User to follow not found",
      });
    }

    /* Check if user is already following the user */
    const isAlreadyFollowing = user.following.includes(userToFollowId);

    if (isAlreadyFollowing) {
      user.following.pull(userToFollowId); //Remove the userid from following
      userToFollow.followers.pull(userId); // Remove the userIdToFollow from followers
      user.following_count--; //Decrease the following count
      userToFollow.followers_count--; // Decrease the followers count
      await user.save();
      await userToFollow.save();

      return res.status(200).json({
        message: "You have taken back your following request",
      });
    }

    /* Add user to following list */
    user.following.push(userToFollowId);

    /* Add user to followers list */
    userToFollow.followers.push(userId);

    /* Increase the following count */
    user.following_count++;

    /* Increase the follower count */
    userToFollow.followers_count++;

    await user.save();
    await userToFollow.save();

    return res.status(200).json({
      message: "User followed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* Unfollow user */
exports.unfollowUser = async (req, res) => {
  const { userId } = req.user;
  const { userIdToUnfollow } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User Not found",
      });
    }

    const userToUnfollow = await User.findById(userIdToUnfollow);

    if (!userToUnfollow) {
      return res.status.json({
        message: "No user found with this user id.",
      });
    }

    /* Check if the userId is in the followers list or not.
    if YES then remove from the list
    else return response "Not following this user"
    */
    if (!userToUnfollow.followers.includes(userId)) {
      return res.status(400).json({
        message: "You are not following this user",
      });
    }

    userToUnfollow.followers.pull(userId);
    userToUnfollow.followers_count--;
    user.following.pull(userIdToUnfollow);
    user.following_count--;
    await userToUnfollow.save();
    await user.save();

    return res.status(200).json({
      message: "You have successfully unfollowed the user",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Errro",
    });
  }
};

/* Get following status */
exports.getFollowingStatus = async (req, res) => {
  const { userId } = req.user;

  const { userIdToCheck } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    const userToCheck = await User.findById(userIdToCheck);
    if (!userIdToCheck) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    if (user.following.includes(userIdToCheck)) {
      return res.status(200).json({
        message: "User is following this user",
        following: true,
      });
    }

    return res.status(400).json({
      message: "User is not following this user",
      following: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

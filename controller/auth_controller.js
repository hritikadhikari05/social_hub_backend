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
    // const otp = otpGenerator.generate(6, {
    //   digits: true,
    //   upperCase: false,
    //   specialChars: false,
    // });

    // // console.log(otp);
    // const otpResponse = await sendOtp(
    //   phoneNo,
    //   otp
    // );
    // console.log(otpResponse);

    /* Create new user */
    const newUser = new User({
      firstName,
      lastName,
      userName,
      email,
      phoneNo,
      password: hashedPassword,
      gender,
      bio,
      // otp,
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
exports.login = (req, res) => {
  const { password, email } = req.body;

  try {
    // Find user by email or username
    User.findOne({
      $or: [{ userName: email }, { email: email }],
    }).then((user) => {
      // Check if user exists
      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      // Check if password matches
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          return res.status(200).json({
            message: "User logged in successfully",
            token: createToken(user),
          });
        } else {
          return res.status(400).json({
            message: "Incorrect password",
          });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server error" });
  }
};

/* Reset Password */
exports.resetPassword = (req, res) => {
  //Reset Password
  const { password, confirmPassword } = req.body;
  //Check whether the password and confirm password are same
  if (password === confirmPassword) {
    bcrypt
      .genSalt(10)
      .then((salt) => {
        bcrypt
          .hash(password, salt)
          .then((hashedPassword) => {
            // User.findByIdAndUpdate()
            User.findByIdAndUpdate(req.user.userId, {
              password: hashedPassword,
            })
              .then((user) => {
                return res.status(200).json({
                  message: "Password reset successfully",
                  token: createToken(user),
                });
              })
              .catch((err) => {
                console.log(err);
                return res.status(400).json({
                  message: err,
                });
              });
          })
          .catch((err) => {
            console.log(err);
            return res.status(400).json({
              message: err,
            });
          });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          message: err,
        });
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
      console.log(err);
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
  console.log(userId);
  try {
    const user = await User.findOne({
      _id: userId,
    });

    console.log(user);
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
  const { firstName, lastName, bio } = req.body;
  const { userId } = req.params;

  console.log(lastName, firstName, bio, userId);
  // console.log(lastName ? lastName : "no last name");

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

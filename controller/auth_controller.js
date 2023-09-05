const User = require("../models/user_model");
const PersonalWall = require("../models/personalWall_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*create token */
const createToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  );
};

/* Registration */
exports.register = (req, res) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    gender,
    confirmPassword,
    bio,
  } = req.body;

  //Register new user and check whether the user with email and username already exists using promise

  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    } else {
      User.findOne({ userName: userName }).then(
        async (user) => {
          if (user) {
            return res.status(400).json({
              message: "Username already exists",
            });
          } else {
            //Check whether the password and confirm password are same
            if (password === confirmPassword) {
              const salt = await bcrypt.genSalt(
                10
              );
              const hashedPassword =
                await bcrypt.hash(password, salt);
              // Create new user
              const newUser = new User({
                firstName,
                lastName,
                userName,
                email,
                password: hashedPassword,
                gender,
                bio,
              });
              // Save new user
              await newUser
                .save()
                .then((user) => {
                  // Register user in personal wall as Community wall
                  const newPersonalWall =
                    new PersonalWall({
                      user_id: user._id,
                      wall_id: user._id,
                    });
                  newPersonalWall
                    .save()
                    .then((personalWall) => {
                      console.log(
                        "Personal wall created successfully",
                        personalWall
                      );
                    });
                  return res.status(200).json({
                    message:
                      "User registered successfully",
                    token: createToken(user),
                  });
                })
                .catch((err) => {
                  console.log(err);
                  return res.status(400).json({
                    message: err,
                  });
                });
            } else {
              return res.status(400).json({
                message:
                  "Password and confirm password are not same",
              });
            }
          }
        }
      );
    }
  });
};

/* Login */
exports.login = (req, res) => {
  const { password, email } = req.body;

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
    bcrypt
      .compare(password, user.password)
      .then((isMatch) => {
        if (isMatch) {
          return res.status(200).json({
            message:
              "User logged in successfully",
            token: createToken(user),
          });
        } else {
          return res.status(400).json({
            message: "Incorrect password",
          });
        }
      });
  });
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
            User.findByIdAndUpdate(
              req.user.userId,
              {
                password: hashedPassword,
              }
            )
              .then((user) => {
                return res.status(200).json({
                  message:
                    "Password reset successfully",
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
        user: user,
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
      user: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

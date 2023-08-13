const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
                  let token = jwt.sign(
                    {
                      userId: user._id,
                    },
                    process.env.JWT_SECRET,
                    {
                      expiresIn: "365d",
                    }
                  );

                  return res.status(200).json({
                    message:
                      "User registered successfully",
                    token: token,
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
          let token = jwt.sign(
            {
              userId: user._id,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "365d",
            }
          );

          return res.status(200).json({
            message:
              "User logged in successfully",
            token: token,
          });
        } else {
          return res.status(400).json({
            message: "Incorrect password",
          });
        }
      });
  });
};

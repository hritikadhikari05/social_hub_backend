const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  const { authorization } = req.headers;
  const formattedToken =
    authorization.split(" ")[1];
  if (!formattedToken)
    return res
      .status(401)
      .send("Access denied. No token provided.");

  try {
    const decoded = jwt.verify(
      formattedToken,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    // console.log("decoded", decoded);

    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

module.exports = authCheck;

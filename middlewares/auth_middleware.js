const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).send({
      message:
        "Access denied. No token provided.",
    });
  const formattedToken =
    authorization.split(" ")[1];
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

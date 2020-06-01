const { JWT_SECRET } = require("../../middlewares/auth");
const jwt = require("jsonwebtoken");

module.exports.accessToken = (uid) =>
  `Bearer ${jwt.sign({ userId: uid }, JWT_SECRET, {
    expiresIn: "1 hour",
  })}`;

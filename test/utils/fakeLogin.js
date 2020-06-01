const jwt = require("jsonwebtoken");

const User = require("../../models/user");

const { check } = require("express-validator");
const { JWT_SECRET } = require("../../middlewares/auth");

module.exports.fakeLogin = async (email, password) => {
  check(email).isEmail(), check(password).isString().isLength({ min: 5 });

  const filter = {
    email: email.toString(),
    password: password.toString(),
  };

  const user = await User.findOne(filter, (err, user) => {
    if (err) {
      throw new Error(err);
    }
    if (!user) {
      throw new Error("Invalid email or password");
    }
  });

  const accessToken = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "1 hour",
  });
  return {
    userId: user._id,
    accessToken,
  };
};

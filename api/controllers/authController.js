const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models/User");

const generateToken = (userId, isAdmin) => {
  return jwt.sign({ userId, isAdmin }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d",
  });
};

/**
 *   @desc   Register New User
 *   @route  /api/auth/register
 *   @method  Post
 *   @access  public
 */
module.exports.register = asyncHandler(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).json({ message: "this user is already exsist!" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  user = await User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass,
  });

  const newUser = await user.save();
  const token = generateToken(user._id, user.isAdmin);
  const { password, ...others } = newUser._doc;

  res.status(201).json({ ...others, token });
});

/**
 *   @desc   Login User
 *   @route  /api/auth/login
 *   @method  Post
 *   @access  public
 */
module.exports.login = asyncHandler(async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: "Wrong credentials!" });
  }

  const isPasswordMatch = await bcrypt.compare(
    req.body.password,
    user.password
  );
  !isPasswordMatch && res.status(400).json({ message: "Wrong credentials!" });

  const token = generateToken(user._id, user.isAdmin);
  const { password, ...others } = user._doc;

  res.status(200).json({ ...others, token });
});

/**
 *   @desc   Logout User
 *   @route  /api/auth/logout
 *   @method  Post
 *   @access  public
 */
module.exports.logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "User logged out successfully",
    success: true,
  });
});

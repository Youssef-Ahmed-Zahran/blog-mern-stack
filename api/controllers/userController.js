const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User } = require("../models/User");

// Http Methods / Verbs

/**
 *   @desc   Get Current User
 *   @route  /api/users/me
 *   @method  Get
 *   @access  private (authenticated user)
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

/**
 *   @desc   Get All User
 *   @route  /api/users
 *   @method  Get
 *   @access  private (only admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

/**
 *   @desc   Get User By Id
 *   @route  /api/users/:id
 *   @method  Get
 *   @access  private (only admin & User himself)
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  !user && res.status(400).json({ message: "user not found" });
  const { password, ...others } = user._doc;

  res.status(200).json(others);
});

/**
 *   @desc   Update User By Id
 *   @route  /api/users/:id
 *   @method  Put
 *   @access  private (only admin & User himself)
 */
const updateUserById = asyncHandler(async (req, res) => {
  let updatedUser = await User.findById(req.params.id);

  if (!updatedUser) {
    return res.status(400).json({ message: "user not found" });
  }

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  ).select("-password");

  res.status(200).json(updatedUser);
});

/**
 *   @desc   Delete User By Id
 *   @route  /api/users/:id
 *   @method  Delete
 *   @access  private (only admin & User himself)
 */
const deleteUserById = asyncHandler(async (req, res) => {
  const deletedUser = await User.findById(req.params.id);
  if (!deletedUser) {
    return res.status(400).json({ message: "user not found" });
  } else {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "user has been deleted successfully" });
  }
});

/**
 *   @desc   Get All Saved Post
 *   @route  /api/users/saved
 *   @method  Get
 *   @access  private (only admin & User himself)
 */
const getUserSavedPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json(user.savedPost);
});

/**
 *   @desc   Update User Saved Post
 *   @route  /api/users/save
 *   @method  Patch
 *   @access  private (only admin & User himself)
 */
const savePosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const postId = req.body.postId;

  const isSaved = user.savedPost.some((p) => p === postId);

  if (!isSaved) {
    await User.findByIdAndUpdate(user._id, {
      $push: { savedPost: postId },
    });
  } else {
    await User.findByIdAndUpdate(user._id, {
      $pull: { savedPost: postId },
    });
  }

  setTimeout(() => {
    res.status(200).json({
      message: isSaved ? "Post unsaved" : "Post saved",
      isSaved: !isSaved, // Return the new state
    });
  }, 1000);
});
module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getCurrentUser,
  getUserSavedPosts,
  savePosts,
};

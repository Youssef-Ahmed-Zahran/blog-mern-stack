const asyncHandler = require("express-async-handler");
const { Comment } = require("../models/Comment");
const { User } = require("../models/User");

// Http Methods / Verbs

/**
 *   @desc   Get All Comments
 *   @route  /api/comments/:postId
 *   @method  Get
 *   @access  public
 */
const getPostComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });

  res.status(200).json(comments);
});

/**
 *   @desc   Add Comment
 *   @route  /api/comments/:postId
 *   @method  Post
 *   @access  private (only admin & User himself)
 */
const addComment = asyncHandler(async (req, res) => {
  const newComment = await Comment(req.body);
  const savedComment = await newComment.save();
  setTimeout(() => {
    res.status(201).json(savedComment);
  }, 2000);
});

/**
 *   @desc   Delete Comment
 *   @route  /api/comments/:id
 *   @method  Post
 *   @access  private (only admin & User himself)
 */
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (comment) {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    res.status(201).json(deletedComment);
  } else {
    res.status(404).json({ message: "Comment not found!" });
  }
});

module.exports = {
  getPostComments,
  addComment,
  deleteComment,
};

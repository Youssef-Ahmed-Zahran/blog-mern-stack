const express = require("express");
const router = express.Router();
const {
  getPostComments,
  addComment,
  deleteComment,
} = require("../controllers/commentController");
const {
  verifyTokenAndAuthorization,
  verifyToken,
} = require("../middlewares/verifyToken");

router.get("/:postId", getPostComments);
router.post("/:postId", verifyToken, addComment);
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;

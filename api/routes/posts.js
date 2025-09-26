const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createNewPost,
  updatePostById,
  deletePostById,
  uploadAuth,
  featurePost,
} = require("../controllers/postController");
const {
  verifyTokenAndAdmin,
  verifyToken,
} = require("../middlewares/verifyToken");
const { increaseVisit } = require("../middlewares/increaseVisit");

router.get("/upload-auth", uploadAuth);

router.route("/").get(getAllPosts).post(createNewPost);

router.get("/:slug", increaseVisit, getPostById);

router
  .route("/:id")
  .put(verifyToken, updatePostById)
  .delete(verifyToken, deletePostById);

router.patch("/feature", verifyTokenAndAdmin, featurePost);

module.exports = router;

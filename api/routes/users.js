const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getCurrentUser,
  getUserSavedPosts,
  savePosts,
} = require("../controllers/userController");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

// Get current logged-in user
router.route("/me").get(verifyToken, getCurrentUser);

router.route("/").get(verifyTokenAndAdmin, getAllUsers);

router.get("/saved", verifyToken, getUserSavedPosts);
router.patch("/save", verifyToken, savePosts);

router
  .route("/:id")
  .get(verifyTokenAndAuthorization, getUserById)
  .put(verifyTokenAndAuthorization, updateUserById)
  .delete(verifyTokenAndAuthorization, deleteUserById);

module.exports = router;

const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { Post } = require("../models/Post");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select({
      _id: 1,
      username: 1,
      email: 1,
      img: 1,
      isAdmin: 1,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

const verifyTokenAndAuthorization = async (req, res, next) => {
  try {
    await verifyToken(req, res, async () => {
      // For post routes, check if the user owns the post
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      // Compare the post's user ID with the current user's ID, or check if user is admin
      if (
        post.user.toString() === req.user._id.toString() ||
        req.user.isAdmin
      ) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "You are not allowed to modify this post." });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Server error during authorization." });
  }
};

const verifyTokenAndAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select({
      _id: 1,
      username: 1,
      email: 1,
      img: 1,
      isAdmin: 1,
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token." });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ error: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};

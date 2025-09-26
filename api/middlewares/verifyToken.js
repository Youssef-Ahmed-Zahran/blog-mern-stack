const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

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

    // Check authorization: user can access their own resources or is admin
    const resourceUserId =
      req.params.id || req.params.userId || req.body.userId;

    if (!user.isAdmin && user._id.toString() !== resourceUserId) {
      return res
        .status(403)
        .json({
          error: "Access denied. You can only access your own resources.",
        });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
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

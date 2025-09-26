const asyncHandler = require("express-async-handler");
const { Post } = require("../models/Post");
const { User } = require("../models/User");
const ImageKit = require("imagekit");

// Http Methods / Verbs

/**
 *   @desc   Get All Posts
 *   @route  /api/posts
 *   @method  Get
 *   @access  public
 */
const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const query = {};

  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) {
    query.category = cat;
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");

    if (!user) {
      return res.status(404).json({ message: "No post found!" });
    }

    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
    switch (sortQuery) {
      case "newest":
        sortObj = { createdAt: -1 };
        break;

      case "oldest":
        sortObj = { createdAt: 1 };
        break;

      case "popular":
        sortObj = { visit: -1 };
        break;

      case "trending":
        sortObj = { visit: -1 };
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;

      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true;
  }

  const posts = await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPosts = await Post.countDocuments();

  const hasMore = page * limit < totalPosts;

  res.status(200).json({ posts, hasMore });
});

/**
 *   @desc   Get Post By slug
 *   @route  /api/posts/:slug
 *   @method  Get
 *   @access  public
 */
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username img"
  );
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: "post not found!" });
  }
});

/**
 *   @desc   Create New Post
 *   @route  /api/posts
 *   @method  Post
 *   @access  public
 */
const createNewPost = asyncHandler(async (req, res) => {
  let slug = req.body.title.replace(/ /g, "-").toLowerCase();

  let existingPost = await Post.findOne({ slug });

  let counter = 2;

  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const newPost = new Post({
    ...req.body,
    slug: slug,
  });
  const savePost = await newPost.save();
  res.status(201).json(savePost);
});

/**
 *   @desc   Update Post By Id
 *   @route  /api/posts/:id
 *   @method  Put
 *   @access  private (only admin & User himself)
 */
const updatePostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } else {
    res.status(404).json({ message: "post not found!" });
  }
});

/**
 *   @desc   Delete Post By Id
 *   @route  /api/posts/:id
 *   @method  Delete
 *   @access  private (only admin & User himself)
 */
const deletePostById = asyncHandler(async (req, res) => {
  const deletedPost = await Post.findById(req.params.id);
  if (deletedPost) {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "post has been deleted." });
  } else {
    res.status(404).json({ message: "post not found!" });
  }
});

// Initialize ImageKit lazily when needed
let imagekit = null;

const getImageKit = () => {
  if (!imagekit) {
    imagekit = new ImageKit({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
  }
  return imagekit;
};

const uploadAuth = asyncHandler(async (req, res) => {
  const imagekitInstance = getImageKit();
  const { token, expire, signature } =
    imagekitInstance.getAuthenticationParameters();
  res.send({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
});

const featurePost = asyncHandler(async (req, res) => {
  const postId = req.body.postId;

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json({ message: "post not found!" });
  }

  const isFeatured = post.isFeatured;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true }
  );
  setTimeout(() => {
    res.status(200).json(updatedPost);
  }, 1000);
});

module.exports = {
  getAllPosts,
  getPostById,
  createNewPost,
  updatePostById,
  deletePostById,
  uploadAuth,
  featurePost,
};

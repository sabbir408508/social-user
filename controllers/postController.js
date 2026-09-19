const Post = require('../models/Post');
const Comment = require('../models/Comment');
const AppError = require('../utils/AppError');

// Create a new post
const createPost = async (req, res, next) => {
  try {
    const { author, title, content } = req.body;
    const post = await Post.create({
      author: author || 'Anonymous',
      title,
      content,
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Get all posts (newest first)
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    next(error);
  }
};

// Get single post by ID with comments
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    const comments = await Comment.find({ postId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { post, comments } });
  } catch (error) {
    next(error);
  }
};

// Like a post
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// Delete post and its comments
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    await Comment.deleteMany({ postId: req.params.id });
    res.status(200).json({ success: true, message: 'Post and associated comments deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// Add comment to a post
const addComment = async (req, res, next) => {
  try {
    const { author, text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError('Post not found', 404));
    }
    const comment = await Comment.create({
      postId: req.params.id,
      author: author || 'Anonymous',
      text,
    });
    res.status(201).json({ success: true, data: comment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  deletePost,
  addComment,
};
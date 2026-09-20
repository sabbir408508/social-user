const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      default: 'Anonymous',
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = Post;
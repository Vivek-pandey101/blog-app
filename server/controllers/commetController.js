const Comment = require("../models/Commnet");
const Post = require("../models/Post");

// GET all comments for a post
const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ post: postId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error getting comments:", err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};

// POST a new comment on a post
const createComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Comment content is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = new Comment({
      content,
      author: userId,
      post: postId,
    });

    await comment.save();
    await comment.populate("author", "username");

    res.status(201).json(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Failed to create comment" });
  }
};

module.exports = { getCommentsByPostId, createComment };

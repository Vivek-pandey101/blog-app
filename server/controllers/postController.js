const Post = require("../models/Post");

const createPost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const newPost = await Post.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to create post" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/posts/:id
const updatePost = async (req, res) => {
    const { title, content } = req.body;
  
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      post.title = title || post.title;
      post.content = content || post.content;
  
      const updatedPost = await post.save();
      res.json(updatedPost);
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  // DELETE /api/posts/:id
const deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      await post.deleteOne();
      res.json({ message: "Post deleted" });
    } catch (err) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  

module.exports = { createPost, getAllPosts, getPostById, updatePost, deletePost };

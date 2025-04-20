const express = require("express");
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
} = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");

router.post("/posts", protect, createPost);
router.put("/posts/:id", protect, updatePost);
router.delete("/posts/:id", protect, deletePost);
router.get("/getposts", getAllPosts);
router.get("/getpost/:id", getPostById); // Public route

module.exports = router;

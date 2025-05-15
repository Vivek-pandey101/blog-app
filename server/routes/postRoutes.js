const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
} = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/posts", protect, upload.single("image"), createPost);
router.put("/posts/:id", protect, updatePost);
router.delete("/posts/:id", protect, deletePost);
router.get("/getposts", getAllPosts);
router.get("/getpost/:id", getPostById); // Public route

module.exports = router;

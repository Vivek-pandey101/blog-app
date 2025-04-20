const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getCommentsByPostId, createComment } = require("../controllers/commetController");

router.get("/:postId/comments", getCommentsByPostId);
router.post("/:postId/addcomments", protect, createComment);

module.exports = router;

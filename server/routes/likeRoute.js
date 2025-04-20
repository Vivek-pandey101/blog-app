const express = require("express");
const router = express.Router();
const { toggleLike, getLikeStatus } = require("../controllers/likeController");
const protect = require("../middleware/authMiddleware");

router.post("/:postId/like", protect, toggleLike);
router.get("/:postId/getlikes", getLikeStatus);

module.exports = router;

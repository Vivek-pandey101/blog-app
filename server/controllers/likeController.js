const Post = require("../models/Post");
const Like = require("../models/Like");

// Toggle like/unlike
const toggleLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ post: postId, user: userId });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.status(200).json({ liked: false, message: "Post unliked" });
    } else {
      const newLike = new Like({ post: postId, user: userId });
      await newLike.save();
      return res.status(201).json({ liked: true, message: "Post liked" });
    }
  } catch (err) {
    console.error("Toggle like error:", err);
    res.status(500).json({ error: "Failed to toggle like" });
  }
};

// Get like status for a post
const getLikeStatus = async (req, res) => {
  try {
    const postId = req.params.postId;

    const totalLikes = await Like.countDocuments({ post: postId });
    const liked = await Like.exists({ post: postId });

    res.status(200).json({ totalLikes, liked: !!liked });
  } catch (err) {
    console.error("Like status error:", err);
    res.status(500).json({ error: "Failed to get like status" });
  }
};

module.exports = { toggleLike, getLikeStatus };

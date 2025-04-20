import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deletePost,
  getPostById,
  toggleLike,
  getLikes,
  addComment,
  getComments,
} from "../services/postAPI";
import { useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Calendar,
  User,
  Edit3,
  Trash2,
  ArrowLeft,
  AlertCircle,
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
} from "lucide-react";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPostById(id);
      setPost(res.data);
      setLikeCount(res.data.likes?.length || 0);
      setIsLiked(res.data.likes?.includes(user?._id));
    } catch (err) {
      setError("Could not load the post. Please try again later.");
      console.error("Error fetching post:", err);
    } finally {
      setLoading(false);
    }
  }, [id, user?._id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await getComments(id);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  }, [id]);

  const fetchLikes = useCallback(async () => {
    try {
      const res = await getLikes(id, user?.token);
      setLikeCount(res.data.totalLikes || 0);
      setIsLiked(res.data.isLiked || false);
    } catch (err) {
      console.error("Failed to fetch likes:", err);
    }
  }, [id, user?.token]);

  useEffect(() => {
    fetchPost();
    fetchComments();
    fetchLikes();
  }, [fetchPost, fetchComments, fetchLikes]);

  const handleDelete = async () => {
    try {
      await deletePost(id, user.token);
      setShowDeleteModal(false);
      navigate("/");
    } catch (err) {
      setError("Failed to delete post. Please try again.");
      setShowDeleteModal(false);
      console.error("Delete error:", err);
    }
  };

  const handleLike = async () => {
    if (!user?.token) {
      setError("Please login to like posts");
      return;
    }

    try {
      await toggleLike(id, user.token);
      // Optimistic UI update
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      // Then sync with server
      await fetchLikes();
    } catch (err) {
      // Revert on error
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      console.error("Failed to toggle like:", err);
    }
  };

  const handleCommentPost = async () => {
    if (!commentText.trim()) return;
    if (!user?.token) {
      setError("Please login to comment");
      return;
    }

    setCommentLoading(true);
    try {
      await addComment(id, commentText, user.token);
      setCommentText("");
      await fetchComments();
    } catch (err) {
      console.error("Posting comment failed:", err);
      setError("Failed to post comment");
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateReadTime = (content) => {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-50">
        <div className="bg-white shadow-xl rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <h2 className="text-xl font-bold mb-2">Error Loading Post</h2>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user && post.author?._id === user._id;
  const readTime = calculateReadTime(post.content);

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 text-red-800 p-4 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Post card */}
        <article className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="p-8 border-b">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2 text-blue-500" />
                {post.author?.username || "Anonymous"}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                {formatDate(post.createdAt)}
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                {readTime} min read
              </div>
            </div>
          </div>

          {isAuthor && (
            <div className="px-8 py-4 bg-gray-50 border-b">
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/edit/${id}`)}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center"
                  aria-label="Edit post"
                >
                  <Edit3 className="w-4 h-4 mr-2" /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center"
                  aria-label="Delete post"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </button>
              </div>
            </div>
          )}

          <div className="p-8">
            <div className="prose prose-blue max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* Likes & buttons */}
          <div className="px-8 py-4 bg-gray-50 flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                  isLiked
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <ThumbsUp
                  className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                />
                {likeCount}
              </button>
              <button
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                aria-label="Comment on post"
              >
                <MessageSquare className="h-4 w-4" />
                {comments.length}{" "}
                {comments.length === 1 ? "Comment" : "Comments"}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Share post"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Bookmark post"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>
        </article>

        {/* Comments section */}
        <section className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Comments ({comments.length})
            </h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
                className="w-full border p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-label="Comment input"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleCommentPost}
                  disabled={commentLoading || !commentText.trim()}
                  className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
                    commentLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {commentLoading ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {comments.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Be the first to comment!
                </p>
              ) : (
                comments.map((comment) => (
                  <article
                    key={comment._id}
                    className="border-t pt-4 text-sm text-gray-800"
                  >
                    <header className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {comment.author?.username || "Anonymous"}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {formatDate(comment.createdAt)}
                      </span>
                    </header>
                    <p className="whitespace-pre-line">{comment.content}</p>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Delete modal */}
        {showDeleteModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-3">Delete Post</h3>
              <p className="text-gray-600 mb-5">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="border px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetails;

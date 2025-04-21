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
import { useEffect, useState, useCallback, useRef } from "react";
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
  const contentRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPostById(id);
      setPost(res.data);
      setLikeCount(res.data.likes?.length || 0);
      setIsLiked(res.data.likes?.includes(user?._id));

      // Set content directly from HTML string
      if (contentRef.current && res.data.content) {
        // For HTML content (from our custom editor)
        contentRef.current.innerHTML = res.data.content;
      }
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
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      await fetchLikes();
    } catch (err) {
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

  // Calculate read time based on HTML content
  const calculateReadTime = (content) => {
    if (!content) return 1;

    // Create a temporary element to strip HTML tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";

    const wordsPerMinute = 200;
    const wordCount = plainText.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  // Delete confirmation modal
  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Delete Post</h3>
        <p className="mb-6">
          Are you sure you want to delete this post? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

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
      {showDeleteModal && <DeleteModal />}

      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to all posts
          </button>
        </div>

        {/* Post Title */}
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

        {/* Author and Meta */}
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {post.author?.username}
          </span>
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(post.createdAt)}
          </span>
          <span>{readTime} min read</span>
        </div>

        {/* Post Actions */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 text-sm ${
              isLiked ? "text-blue-600" : "text-gray-500"
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{likeCount}</span>
          </button>

          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <MessageSquare className="w-4 h-4" />
            <span>{comments.length}</span>
          </div>

          <button className="text-gray-500 hover:text-blue-600">
            <Share2 className="w-4 h-4" />
          </button>

          <button className="text-gray-500 hover:text-blue-600">
            <Bookmark className="w-4 h-4" />
          </button>

          {isAuthor && (
            <div className="ml-auto flex items-center space-x-2">
              <button
                onClick={() => navigate(`/edit/${id}`)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Post Content (Custom rendered) */}
        <div className="bg-white shadow p-6 rounded-lg prose max-w-none">
          <div ref={contentRef} className="content-display" />
        </div>

        {/* Comments Section */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Comments</h3>

          {error && (
            <div className="mb-4 flex items-center p-3 bg-red-50 text-red-700 rounded">
              <AlertCircle className="w-4 h-4 mr-2" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {user ? (
            <div className="mb-6">
              <textarea
                rows="3"
                className="w-full border border-gray-300 p-3 rounded mb-2"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                onClick={handleCommentPost}
                disabled={commentLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </button>
            </div>
          ) : (
            <p className="text-gray-600 mb-4">Login to post a comment.</p>
          )}

          {comments.length === 0 ? (
            <p className="text-gray-500 italic">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            <ul className="space-y-4">
              {comments.map((comment) => (
                <li key={comment._id} className="border-b pb-4">
                  <div className="flex items-center mb-1">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {comment.username || "Anonymous"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="pl-10 text-gray-700">{comment.text}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;

import React, { useEffect, useState } from "react";
import { getPosts } from "../services/postAPI";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Book,
  Clock,
  User,
  Search,
  Bookmark,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useSelector } from "react-redux";

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await getPosts();
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load posts");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on search term and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to generate a random pastel color based on author's username
  const getAuthorColor = (username) => {
    if (!username) return "bg-gray-200";
    const colors = [
      "bg-red-100 text-red-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 py-6 px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white">Blog Posts</h2>
                <p className="text-indigo-100 mt-1">
                  Discover interesting articles and stories
                </p>
              </div>

              {user ? (
                <Link
                  to="/create"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium shadow transition-all"
                >
                  + Create Post
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md text-sm font-medium shadow transition-all"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Search and filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Post list */}
            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <Book className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  No posts found
                </h3>
                <p className="text-gray-500">
                  {searchTerm
                    ? "Try a different search term or category"
                    : "Be the first to create a post!"}
                </p>
                <Link to="/create">
                  <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all">
                    Create New Post
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post, index) => (
                  <Link
                    to={`/posts/${post._id}`}
                    key={post._id}
                    className="group"
                  >
                    <div
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col transform group-hover:-translate-y-1"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {/* Post image placeholder */}
                      <div className="h-40 bg-gradient-to-r from-blue-100 to-indigo-100 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
                        <div className="absolute top-3 right-3">
                          <Bookmark className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      <div className="p-5 flex-grow">
                        <div className="flex items-center mb-3">
                          <div
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getAuthorColor(
                              post.author?.username
                            )}`}
                          >
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {post.author?.username || "Anonymous"}
                            </span>
                          </div>
                          <div className="ml-auto text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-all">
                          {post.title}
                        </h3>
                        <div className="prose prose-sm max-w-none text-gray-600 line-clamp-3 mb-4">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {post.content.substring(0, 50) +
                              (post.content.length > 50 ? "..." : "")}
                          </ReactMarkdown>
                        </div>
                        <div className="mt-auto flex items-center text-indigo-600 text-sm font-medium">
                          Read more
                          <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllPosts;

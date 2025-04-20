import React, { useState, useEffect } from "react";
import { createPost } from "../services/postAPI";
import { useNavigate } from "react-router-dom";
import { Send, AlertCircle, FileText, Type, ArrowLeft } from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setAnimate(true);

    try {
      await createPost(formData);
      navigate("/"); // or /posts
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create post");
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Animation delay
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [animate]);

  // Simple markdown preview renderer
  const renderMarkdown = (text) => {
    if (!text)
      return <p className="text-gray-400 italic">No content to preview</p>;

    // This is a very simplified markdown renderer
    // For a real app, you'd want to use a library like marked or react-markdown
    const headers = text.replace(
      /# (.*?)$/gm,
      '<h1 class="text-2xl font-bold my-4">$1</h1>'
    );
    const subheaders = headers.replace(
      /## (.*?)$/gm,
      '<h2 class="text-xl font-bold my-3">$1</h2>'
    );
    const paragraphs = subheaders.replace(
      /(?<!\n)\n(?!\n)(.*?)$/gm,
      '<p class="my-2">$1</p>'
    );
    const boldText = paragraphs.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    const italicText = boldText.replace(/\*(.*?)\*/g, "<em>$1</em>");

    return <div dangerouslySetInnerHTML={{ __html: italicText }} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4">
      <div
        className={`max-w-4xl mx-auto transition-all duration-500 ${
          animate ? "opacity-80 scale-98" : "opacity-100 scale-100"
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 py-6 px-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Create New Post</h2>
              <p className="text-green-100 mt-1">
                Share your thoughts with the world
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
            >
              See Posts
            </button>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Type className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="title"
                  placeholder="Post Title"
                  value={formData.title}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg font-medium"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex items-center border-b bg-gray-50 px-4 py-2">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        !previewMode
                          ? "bg-green-100 text-green-800"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setPreviewMode(false)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        previewMode
                          ? "bg-green-100 text-green-800"
                          : "text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setPreviewMode(true)}
                    >
                      Preview
                    </button>
                  </div>
                  <div className="ml-auto flex items-center text-xs text-gray-500">
                    <FileText className="h-4 w-4 mr-1" />
                    Markdown supported
                  </div>
                </div>

                {!previewMode ? (
                  <textarea
                    name="content"
                    rows="12"
                    placeholder="Write your markdown content here..."
                    value={formData.content}
                    className="w-full p-4 font-mono text-gray-800 focus:outline-none"
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <div className="w-full p-4 min-h-64 prose max-w-none">
                    {renderMarkdown(formData.content)}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Tips:</span> Use # for headings,
                  ** for bold **, * for italic *
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg px-6 py-2 font-medium transition-all duration-300 ${
                      isSaving
                        ? "opacity-75 cursor-not-allowed"
                        : "hover:from-green-700 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-1"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Publishing...
                      </>
                    ) : (
                      <>
                        Publish Post
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            {message && (
              <div className="mt-6 flex items-center p-4 bg-red-50 text-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;

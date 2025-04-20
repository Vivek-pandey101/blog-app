import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "../services/postAPI";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  Save,
  FileText,
  Type,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [originalData, setOriginalData] = useState({
    title: "",
    content: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await getPostById(id);
        if (!user || res.data.author._id !== user._id) {
          setError("You are not authorized to edit this post.");
        } else {
          const postData = {
            title: res.data.title,
            content: res.data.content,
          };
          setFormData(postData);
          setOriginalData(postData);
        }
      } catch (err) {
        setError("Failed to load post data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnimate(true);
    setSaving(true);

    try {
      await updatePost(id, formData, user.token);
      setSuccess("Post updated successfully!");
      setOriginalData(formData);
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 1500);
    } catch (err) {
      setError("Failed to update post.");
      setSaving(false);
    }
  };

  useEffect(() => {
    // Animation delay
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [animate]);

  // Detect if there are unsaved changes
  const hasChanges =
    originalData.title !== formData.title ||
    originalData.content !== formData.content;

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4">
      <div
        className={`max-w-4xl mx-auto transition-all duration-500 ${
          animate ? "opacity-80 scale-98" : "opacity-100 scale-100"
        }`}
      >
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-6 px-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">Edit Post</h2>
              <p className="text-purple-100 mt-1">Update your blog post</p>
            </div>
            <button
              onClick={() => navigate(`/posts/${id}`)}
              className="flex items-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Post
            </button>
          </div>

          <div className="p-8">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : error ? (
              <div className="flex items-center p-4 bg-red-50 text-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Type className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium"
                    placeholder="Post Title"
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
                            ? "bg-purple-100 text-purple-800"
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
                            ? "bg-purple-100 text-purple-800"
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
                      value={formData.content}
                      onChange={handleChange}
                      rows="12"
                      className="w-full p-4 font-mono text-gray-800 focus:outline-none"
                      placeholder="Write in Markdown..."
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
                    <span className="font-medium">Tips:</span> Use # for
                    headings, ** for bold **, * for italic *
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/posts/${id}`)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !hasChanges}
                      className={`flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                        saving
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : !hasChanges
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-lg transform hover:-translate-y-1"
                      }`}
                    >
                      {saving ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Update Post
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {success && (
              <div className="mt-6 flex items-center p-4 bg-green-50 text-green-800 rounded-lg">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, updatePost } from "../services/postAPI";
import { useSelector } from "react-redux";
import {
  AlertCircle,
  Save,
  ArrowLeft,
  CheckCircle,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Code,
  Heading1,
  Heading2,
} from "lucide-react";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Refs for the editor
  const editorRef = useRef(null);
  const isMounted = useRef(false);

  // Track selection state
  const [selection, setSelection] = useState({
    range: null,
    savedRange: null,
  });

  useEffect(() => {
    isMounted.current = true;

    // Add event listener to save selection when the editor loses focus
    const handleSelectionChange = () => {
      if (document.activeElement === editorRef.current) {
        saveSelection();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      isMounted.current = false;
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  // Save current selection
  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        const range = sel.getRangeAt(0);
        setSelection((prev) => ({ ...prev, savedRange: range }));
      }
    }
  };

  // Restore saved selection
  const restoreSelection = () => {
    if (selection.savedRange) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(selection.savedRange);
      }
    }
  };

  // Focus the editor and restore selection
  const focusEditor = () => {
    editorRef.current.focus();
    restoreSelection();
  };

  // Execute command
  const execCommand = (command, value = null) => {
    focusEditor();
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  // Common formatting functions
  const commands = {
    bold: () => execCommand("bold"),
    italic: () => execCommand("italic"),
    underline: () => execCommand("underline"),
    insertUnorderedList: () => execCommand("insertUnorderedList"),
    insertOrderedList: () => execCommand("insertOrderedList"),
    alignLeft: () => execCommand("justifyLeft"),
    alignCenter: () => execCommand("justifyCenter"),
    alignRight: () => execCommand("justifyRight"),
    heading1: () => execCommand("formatBlock", "<h1>"),
    heading2: () => execCommand("formatBlock", "<h2>"),
    paragraph: () => execCommand("formatBlock", "<p>"),
    code: () => {
      saveSelection();
      const selectedText = window.getSelection().toString();
      execCommand(
        "insertHTML",
        `<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">${
          selectedText || "code"
        }</code>`
      );
    },
  };

  // Insert link
  const insertLink = () => {
    saveSelection();
    const url = prompt("Enter URL:");
    if (url) {
      restoreSelection();
      execCommand("createLink", url);
    }
  };

  // Insert image
  const insertImage = () => {
    saveSelection();
    const url = prompt("Enter image URL:");
    if (url) {
      restoreSelection();
      execCommand("insertImage", url);
    }
  };

  // Get HTML content
  const getContent = () => {
    return editorRef.current ? editorRef.current.innerHTML : "";
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await getPostById(id);
        if (!user || res.data.author._id !== user._id) {
          setError("You are not authorized to edit this post.");
        } else {
          setTitle(res.data.title);
          setOriginalTitle(res.data.title);
          setOriginalContent(res.data.content);

          // Set HTML content directly in the editor
          if (editorRef.current && res.data.content) {
            editorRef.current.innerHTML = res.data.content;
          }
        }
      } catch (err) {
        setError("Failed to load post data.");
      } finally {
        setLoading(false);
      }
    };

    if (isMounted.current) {
      fetchPost();
    }
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnimate(true);
    setSaving(true);

    try {
      const content = getContent();
      await updatePost(id, { title, content }, user.token);
      setSuccess("Post updated successfully!");
      setOriginalTitle(title);
      setOriginalContent(content);
      setTimeout(() => {
        navigate(`/posts/${id}`);
      }, 1500);
    } catch (err) {
      setError("Failed to update post.");
      setSaving(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [animate]);

  // Check for unsaved changes
  const hasChanges = () => {
    const currentContent = getContent();
    return originalTitle !== title || originalContent !== currentContent;
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
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-lg font-medium"
                    placeholder="Post Title"
                    required
                  />
                </div>

                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  {/* Toolbar */}
                  <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={commands.heading1}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Heading 1"
                    >
                      <Heading1 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={commands.heading2}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Heading 2"
                    >
                      <Heading2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={commands.paragraph}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Paragraph"
                    >
                      <span className="font-bold text-sm">P</span>
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={commands.bold}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={commands.italic}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={commands.underline}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Underline"
                    >
                      <Underline className="h-4 w-4" />
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={commands.insertUnorderedList}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Bullet List"
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={commands.insertOrderedList}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Numbered List"
                    >
                      <span className="font-bold text-sm">1.</span>
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={commands.alignLeft}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Align Left"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={commands.alignCenter}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Align Center"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={commands.alignRight}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Align Right"
                    >
                      <AlignRight className="h-4 w-4" />
                    </button>
                    <div className="h-6 w-px bg-gray-300 mx-1"></div>
                    <button
                      type="button"
                      onClick={insertLink}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Insert Link"
                    >
                      <Link className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={insertImage}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Insert Image"
                    >
                      <Image className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={commands.code}
                      className="p-1.5 hover:bg-gray-200 rounded"
                      title="Code"
                    >
                      <Code className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Editor Content */}
                  <div
                    ref={editorRef}
                    className="p-4 min-h-32 max-h-96 overflow-y-auto"
                    contentEditable
                    onBlur={saveSelection}
                    onFocus={restoreSelection}
                    onKeyDown={(e) => {
                      if (e.key === "Tab") {
                        e.preventDefault();
                        execCommand("insertHTML", "&nbsp;&nbsp;&nbsp;&nbsp;");
                      }
                    }}
                    style={{
                      outline: "none",
                      lineHeight: "1.5",
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Tips:</span> Use the toolbar
                    to format your content
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
                      disabled={saving || !hasChanges()}
                      className={`flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                        saving
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : !hasChanges()
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

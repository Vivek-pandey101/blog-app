import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postAPI";
import {
  Send,
  AlertCircle,
  ArrowLeft,
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

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [animate, setAnimate] = useState(false);
  const editorRef = useRef(null);
  const isMounted = useRef(false);

  const [selection, setSelection] = useState({
    range: null,
    savedRange: null,
  });

  useEffect(() => {
    isMounted.current = true;

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

  const saveSelection = () => {
    if (window.getSelection) {
      const sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        const range = sel.getRangeAt(0);
        setSelection((prev) => ({ ...prev, savedRange: range }));
      }
    }
  };

  const restoreSelection = () => {
    if (selection.savedRange) {
      if (window.getSelection) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(selection.savedRange);
      }
    }
  };

  const focusEditor = () => {
    editorRef.current.focus();
    restoreSelection();
  };

  const execCommand = (command, value = null) => {
    focusEditor();
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

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

  const insertLink = () => {
    saveSelection();
    const url = prompt("Enter URL:");
    if (url) {
      restoreSelection();
      execCommand("createLink", url);
    }
  };

  const insertImage = () => {
    saveSelection();
    const url = prompt("Enter image URL:");
    if (url) {
      restoreSelection();
      execCommand("insertImage", url);
    }
  };

  const getContent = () => {
    return editorRef.current ? editorRef.current.innerHTML : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMounted.current) return;

    setIsSaving(true);
    setAnimate(true);

    try {
      const content = getContent();
      
      // Call the createPost API function
      await createPost({ title, content });

      if (isMounted.current) {
        navigate("/");
      }
    } catch (err) {
      if (isMounted.current) {
        setMessage(
          err.response?.data?.message || 
          err.message || 
          "Failed to create post"
        );
        setIsSaving(false);
        setAnimate(false);
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isMounted.current) {
        setAnimate(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [animate]);

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
            <div className="flex gap-2">
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
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Post Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg font-medium"
                  required
                />
              </div>

              <div className="border border-gray-300 rounded-lg overflow-hidden">
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
                  placeholder="Write your post content..."
                  style={{
                    outline: "none",
                    lineHeight: "1.5",
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Tips:</span> Use the toolbar to
                  format your content
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
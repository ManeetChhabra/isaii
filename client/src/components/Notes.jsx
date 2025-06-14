import React, { useEffect, useState } from "react";
import { api } from "../axios.config";
import ReactMarkdown from "react-markdown";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalAttachments, setModalAttachments] = useState([]);

  const fetchNotes = async () => {
    try {
      const response = await api.get("/notes", { withCredentials: true });
      setNotes(response.data);
    } catch (err) {
      setError("Failed to fetch notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !content.trim()) {
      return setError("Title and content are required.");
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      selectedFiles.forEach((file) => {
        formData.append("attachments", file); // match multer field name
      });

      await api.post("/notes", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setContent("");
      setSelectedFiles([]);
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to create note.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`, { withCredentials: true });
      fetchNotes();
    } catch {
      setError("Failed to delete note.");
    }
  };

  const startEdit = (note) => {
    setEditId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
  };
  const handleViewAttachments = (attachments = []) => {
    setModalAttachments(attachments);
    setShowModal(true);
  };

  const handleUpdate = async (id) => {
    if (!editTitle.trim() || !editContent.trim())
      return setError("Edit fields can't be empty.");
    try {
      await api.put(
        `/notes/${id}`,
        { title: editTitle, content: editContent },
        { withCredentials: true }
      );
      cancelEdit();
      fetchNotes();
    } catch {
      setError("Failed to update note.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#e0faf6] p-6">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-4xl font-bold text-center mb-10 text-[#27dec0]">
            ✍️ Your Personal Notes
          </h1>

          {/* New Note Form */}
          <form onSubmit={handleCreate} className="space-y-4 mb-10">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring focus:ring-green-300"
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border rounded-md h-28 resize-none focus:ring focus:ring-green-300"
            ></textarea>
            <input
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              className="w-full border border-gray-300 p-2 rounded-lg"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#27dec0] text-white py-3 rounded-lg hover:bg-[#20c0a8] transition"
            >
              Add Note
            </button>
          </form>

          {/* Notes Display */}
          {notes.length === 0 ? (
            <p className="text-center text-gray-500">No notes yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) =>
                editId === note._id ? (
                  <div
                    key={note._id}
                    className="p-4 border rounded-lg bg-[#bcc4c4] shadow-sm"
                  >
                    <input
                      className="w-full mb-2 p-2 border rounded-md"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full p-2 border rounded-md h-24"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex justify-between mt-3">
                      <button
                        className="bg-[#27dec0] text-white px-4 py-1 rounded hover:bg-[#20c0a8]"
                        onClick={() => handleUpdate(note._id)}
                      >
                        Save
                      </button>

                      <button
                        className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>

                      <button
                        className="bg-[#27dec0] text-white px-4 py-1 rounded hover:bg-[#20c0a8]"
                        onClick={() => handleViewAttachments(note.attachments)}
                      >
                        View Attachments
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={note._id}
                    className="p-4 border border-[#27dec0] rounded-lg bg-[#f0fffc] shadow-md transition hover:shadow-lg"
                  >
                    <h3 className="text-xl font-semibold text-[#27dec0] mb-2">
                      {note.title}
                    </h3>
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-2xl font-bold mt-4 mb-2 text-[#27dec0]"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2
                            className="text-xl font-semibold mt-3 mb-1 text-[#27dec0]"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="text-gray-700 mb-2" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li
                            className="list-disc list-inside text-gray-700"
                            {...props}
                          />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong
                            className="font-semibold text-black"
                            {...props}
                          />
                        ),
                        a: ({ node, ...props }) => (
                          <a
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                          />
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-gray-100 text-sm px-1 py-0.5 rounded"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {note.content}
                    </ReactMarkdown>

                    <div className="flex justify-between mt-4 space-x-3">
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => startEdit(note)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm text-purple-600 hover:underline"
                        onClick={() => handleViewAttachments(note.attachments)}
                      >
                        View Attachments
                      </button>
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => handleDelete(note._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6 relative">
              <h2 className="text-2xl font-bold mb-4 text-[#27dec0]">
                Attachments
              </h2>

              {modalAttachments.length === 0 ? (
                <p className="text-gray-500">No attachments found.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {modalAttachments.map((file, index) => (
                    <div key={index}>
                      {file.url.match(/\.(jpg|jpeg|png)$/i) ? (
                        <img
                          src={file.url}
                          alt={`Attachment ${index + 1}`}
                          className="w-full rounded border"
                        />
                      ) : (
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View File {index + 1}
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-gray-700 hover:text-black text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

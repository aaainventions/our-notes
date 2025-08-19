"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("Muaaz");
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null); // ID of the note being edited
  const [editText, setEditText] = useState(""); // text while editing

  const fetchNotes = async () => {
    const res = await axios.get("/api/notes");
    setNotes(res.data);
  };

  const addNote = async () => {
    if (!text.trim()) return;
    const noteText = `${author}: "${text}"`;
    await axios.post("/api/notes", { text: noteText });
    setText("");
    setAuthor("Muaaz");
    fetchNotes();
  };

  const updateNote = async (id, newText, done) => {
    await axios.put(`/api/notes/${id}`, { text: newText, done });
    setEditingId(null);
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`/api/notes/${id}`);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "pending" && !note.done) ||
      (filter === "done" && note.done);

    const matchesSearch = note.text.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Notes Dashboard</h1>

      <div style={styles.topBar}>
        <button
          onClick={() => {
            document.cookie = "loggedIn=; Max-Age=0; path=/";
            window.location.href = "/login";
          }}
          style={styles.logoutButton}
        >
          Logout
        </button>

        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Add note + author */}
      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Write a note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={styles.dropdown}
        >
          <option value="Muaaz">Muaaz</option>
          <option value="Ahmad">Ahmad</option>
          <option value="Asim">Asim</option>
        </select>
        <button onClick={addNote} style={styles.addButton}>
          Add Note
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {["all", "pending", "done"].map((f) => (
          <button
            key={f}
            style={filter === f ? styles.activeFilter : styles.filterButton}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Notes list */}
      <ul style={styles.list}>
        {filteredNotes.map((note) => (
          <li key={note._id} style={styles.listItem}>
            <div style={{ flex: 1 }}>
              {editingId === note._id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  style={styles.editInput}
                />
              ) : (
                <span
                  style={{
                    textDecoration: note.done ? "line-through" : "none",
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "#333",
                  }}
                >
                  {note.text}
                </span>
              )}
              <div style={{ fontSize: "12px", color: "#999", marginTop: "3px" }}>
                {note.date}
              </div>
            </div>
            <div style={styles.actions}>
              <button
                style={{
                  ...styles.actionButton,
                  backgroundColor: note.done ? "#ff9800" : "#4CAF50",
                }}
                onClick={() => updateNote(note._id, note.text, !note.done)}
              >
                {note.done ? "Unmark" : "Done"}
              </button>

              {editingId === note._id ? (
                <button
                  style={{ ...styles.actionButton, backgroundColor: "#2196F3" }}
                  onClick={() => updateNote(note._id, editText, note.done)}
                >
                  Save
                </button>
              ) : (
                <button
                  style={{ ...styles.actionButton, backgroundColor: "#607d8b" }}
                  onClick={() => {
                    setEditingId(note._id);
                    setEditText(note.text);
                  }}
                >
                  Edit
                </button>
              )}

              <button
                style={{ ...styles.actionButton, backgroundColor: "#f44336" }}
                onClick={() => deleteNote(note._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "700px",
    margin: "50px auto",
    padding: "25px",
    fontFamily: "'Inter', sans-serif",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  heading: { textAlign: "center", marginBottom: "25px", fontWeight: 700 },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    alignItems: "center",
    gap: "15px",
  },
  logoutButton: {
    padding: "8px 18px",
    backgroundColor: "#f44336",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    transition: "0.2s",
  },
  searchInput: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
  },
  inputContainer: {
    display: "flex",
    marginBottom: "20px",
    gap: "10px",
  },
  input: {
    flex: 2,
    padding: "10px 15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
  },
  dropdown: {
    flex: 1,
    padding: "10px 15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
  },
  addButton: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    transition: "0.2s",
  },
  filters: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginBottom: "25px",
  },
  filterButton: {
    padding: "8px 18px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    backgroundColor: "#f0f0f0",
    cursor: "pointer",
    transition: "0.2s",
  },
  activeFilter: {
    padding: "8px 18px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
  },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 20px",
    marginBottom: "12px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  actions: { display: "flex", gap: "10px" },
  actionButton: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: 500,
    cursor: "pointer",
    transition: "0.2s",
  },
  editInput: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  },
};

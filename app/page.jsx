"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all"); // all, pending, done
  const [search, setSearch] = useState("");   // new search state

  // Fetch notes from API
  const fetchNotes = async () => {
    const res = await axios.get("/api/notes");
    setNotes(res.data);
  };

  const addNote = async () => {
    if (!text.trim()) return;
    await axios.post("/api/notes", { text });
    setText("");
    fetchNotes();
  };

  const updateNote = async (id, newText, done) => {
    await axios.put(`/api/notes/${id}`, { text: newText, done });
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`/api/notes/${id}`);
    fetchNotes();
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Apply filters and search
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
      <h1 style={styles.heading}>Notes App</h1>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Write a note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={styles.input}
        />
        <button onClick={addNote} style={styles.addButton}>
          Add
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px",
            width: "60%",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <button
          style={filter === "all" ? styles.activeFilter : styles.filterButton}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          style={filter === "pending" ? styles.activeFilter : styles.filterButton}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          style={filter === "done" ? styles.activeFilter : styles.filterButton}
          onClick={() => setFilter("done")}
        >
          Done
        </button>
      </div>

      <ul style={styles.list}>
        {filteredNotes.map((note) => (
          <li key={note._id} style={styles.listItem}>
            <span
              style={{
                textDecoration: note.done ? "line-through" : "none",
                fontWeight: "bold",
              }}
            >
              {note.text} ({note.date})
            </span>
            <div>
              <button
                style={styles.actionButton}
                onClick={() => updateNote(note._id, note.text, !note.done)}
              >
                {note.done ? "Unmark" : "Done"}
              </button>
              <button
                style={styles.actionButton}
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

// Inline styling (same as before)
const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f7f7f7",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  heading: { textAlign: "center", marginBottom: "20px" },
  inputContainer: { display: "flex", marginBottom: "20px" },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "4px 0 0 4px",
    border: "1px solid #ccc",
    outline: "none",
  },
  addButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "0 4px 4px 0",
    backgroundColor: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  },
  filters: { display: "flex", justifyContent: "center", marginBottom: "20px" },
  filterButton: {
    padding: "8px 16px",
    margin: "0 5px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
  },
  activeFilter: {
    padding: "8px 16px",
    margin: "0 5px",
    border: "1px solid #4CAF50",
    backgroundColor: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
  },
  list: { listStyle: "none", padding: 0 },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    marginBottom: "8px",
    borderRadius: "4px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  actionButton: {
    marginLeft: "5px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#2196F3",
    color: "#fff",
  },
};

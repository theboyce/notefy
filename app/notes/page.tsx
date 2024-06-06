"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import Link from "next/link";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const notesCollectionRef = collection(db, "notes"); // from the db, get 'notes'
  // getting all the notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      //   real time fetching of the data
      onSnapshot(
        query(notesCollectionRef, orderBy("createdAt", "desc")), // sort in descending order
        (snapshot) => {
          const notesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotes(notesList);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching notes: ", err);
          // setError(err);
          console.log(err);
          setLoading(false);
        }
      );
    } catch (err) {
      // setError(err);
      console.log(err);
      setLoading(false);
    }
  };

  //   adding a new note
  const addNote = async () => {
    try {
      setLoading(true);
      await addDoc(notesCollectionRef, {
        title,
        content,
        createdAt: serverTimestamp(),
      });
      setTitle("");
      setContent("");
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //   deleting a note
  const deleteNote = async (noteId: string) => {
    try {
      const noteDocRef = doc(db, "notes", noteId);
      await deleteDoc(noteDocRef);
      console.log(`Document with ID ${noteId} deleted successfully`);
    } catch (e) {
      console.error("Error deleting document: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // addNote();
    fetchNotes();
    // deleteNote("");
  }, []);

  return (
    <div>
      <h1>Notes</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
        className="text-black"
      />
      <br />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter content"
        className="text-black"
      ></textarea>
      <br />
      <button onClick={addNote}>Add Note</button>
      {/* output notes here - use a diff component */}
      {loading ? (
        <div>Loading...</div>
      ) : !notes.length ? (
        <div>No notes found</div>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="bg-slate-800">
              {/* go [noteId] in the catch-all routes */}
              <Link href={`/notes/${note.id}`}>
                <p>ID: {note.id}</p>
                <p>Title: {note.title}</p>
                <p>Content: {note.content}</p>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notes;

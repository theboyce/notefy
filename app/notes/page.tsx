"use client";

import { useCallback, useEffect, useState } from "react";
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
import { auth, db } from "../firebase";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import ProtectedRoute from "../ProtectedRoute";
import { toast } from "sonner";

// structure of each note
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: any; // Adjust type as needed
}

const Notes = () => {
  const router = useRouter();

  // destructure what we need from the firebase hook
  const [user] = useAuthState(auth);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // router.push("/");
      console.log("User signed out");
    } catch (error) {
      console.log(error);
    }
  };

  // handle current user state
  const authChangeHandler = () => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
    });
  };

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
          })) as Note[];
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
    if (!title || !content) {
      toast.error("Please complete all fields");
      return;
    }

    try {
      setLoading(true);
      await addDoc(notesCollectionRef, {
        uid: user?.uid,
        title,
        content,
        createdAt: serverTimestamp(),
      });
      toast.success("Note added");
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
      toast.success(`Note ${noteId} deleted!`);
    } catch (error) {
      console.log("Error deleting document: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchNotes();
    }
  }, []);

  return (
    <ProtectedRoute>
      <h1>Display Notes Page</h1>

      {/* add note */}
      <form action={addNote}>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          className="text-black border-2 border-gray-200 p-2"
        />
        <br />
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter content"
          className="text-black border-2 border-gray-200 p-2"
        ></textarea>
        <br />
        <button
          type="submit"
          aria-disabled={loading}
          className="bg-gray-700 text-white"
        >
          Add Note
        </button>
      </form>

      {/* TODO output notes here - use a diff component */}
      {loading ? (
        <div>Loading...</div>
      ) : !notes.length ? (
        <div>No notes found</div>
      ) : (
        <ul className="space-x-2 space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="bg-blue-800 text-white inline-block p-2"
            >
              {/* go [noteId] in the catch-all routes */}
              <Link href={`/notes/${note.id}`}>
                <p>Title: {note.title}</p>
                <p>Content: {note.content}</p>
              </Link>
              <button
                onClick={() => deleteNote(note.id)}
                className="bg-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* logout */}
      <button onClick={handleSignOut} className="bg-red-400">
        sign out
      </button>
    </ProtectedRoute>
  );
};

export default Notes;

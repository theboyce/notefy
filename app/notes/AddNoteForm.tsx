"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

export default function AddNoteForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [user] = useAuthState(auth);

  const notesCollectionRef = collection(db, "notes");

  // add a new note
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
      router.push("/notes/");
      //   fetchNotes();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-pink-200">
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
      <button onClick={addNote} className="bg-gray-700 text-white">
        Add Note
      </button>
    </div>
  );
}

import Link from "next/link";
import { db } from "../firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useState } from "react";

// structure of each note
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: any;
}

interface AllNotesProps {
  notes: Note[];
}

// component to output the notes
export default function AllNotes({ notes }: AllNotesProps) {
  const [loading, setLoading] = useState(false);

  const notesCollectionRef = collection(db, "notes");

  //   deleting a note
  const deleteNote = async (noteId: string) => {
    try {
      const noteDocRef = doc(notesCollectionRef, noteId);
      await deleteDoc(noteDocRef);
      toast.success(`Note ${noteId} deleted!`);
    } catch (error) {
      console.log("Error deleting document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ul className="space-x-2 space-y-2">
      {notes?.map((note) => (
        <li key={note.id} className="bg-blue-800 text-white inline-block p-2">
          {/* go [noteId] in the catch-all routes */}
          <Link href={`/notes/${note.id}`}>
            <p>Title: {note.title}</p>
            <p>Content: {note.content}</p>
          </Link>
          <button onClick={() => deleteNote(note.id)} className="bg-red-400">
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

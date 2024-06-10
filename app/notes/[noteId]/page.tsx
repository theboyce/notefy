"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { db } from "@/app/firebase";
import {
  doc,
  collection,
  deleteDoc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { toast } from "sonner";
import dynamic from "next/dynamic";

// dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Header from "@/app/components/header";

interface Note {
  id: string;
  title: string;
  content: string;
  deleted: boolean;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function NoteDetails({ params }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const noteId = pathname.split("/")[2]; // get the nodeId from the url (since it might be undefined in the params)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noteDetails, setNoteDetails] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const notesCollectionRef = collection(db, "notes");

  // Function to fetch a single note by ID
  const getNoteById = async (noteId: string) => {
    try {
      setLoading(true);
      const noteDocRef = doc(db, "notes", noteId);
      const docSnap = await getDoc(noteDocRef);
      if (docSnap.exists()) {
        const noteData = docSnap.data() as Note;
        setNoteDetails(noteData);
        setEditedTitle(noteData.title);
        setEditedContent(noteData.content);
      } else {
        console.log("No such document!");
        setNoteDetails(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching document: ", error);
      setError("Failed to fetch document");
      setLoading(false);
    }
  };

  // Function to update a note
  const editNote = async (noteId: string) => {
    try {
      setLoading(true);
      const noteDocRef = doc(db, "notes", noteId);
      await updateDoc(noteDocRef, {
        title: editedTitle,
        content: editedContent,
      });
      // fetch after updating the note
      await getNoteById(noteId);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating document: ", error);
      setError("Failed to update document");
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a note
  const deleteNote = async (noteId: string) => {
    // do nothing if we do not confirm delete
    if (!confirm("Are you sure you want to delete this note")) return;

    try {
      setLoading(true);
      const noteDocRef = doc(notesCollectionRef, noteId);
      await deleteDoc(noteDocRef);
      router.back();
      toast.success(`Note ${noteId} deleted!`);
    } catch (error) {
      console.log("Error deleting document: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a note (move to trash)
  const moveToTrash = async (noteId: string) => {
    try {
      setLoading(true);
      const noteDocRef = doc(notesCollectionRef, noteId);
      await updateDoc(noteDocRef, { deleted: true }); // Mark the note as deleted
      router.back();
      toast.success(`Note ${noteId} moved to trash!`);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to move note to trash");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the note with the specified ID when the component mounts
  useEffect(() => {
    if (params.noteId) {
      getNoteById(params.noteId);
    }
  }, [params.noteId, noteId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col h-full">
      {/* heading */}
      <Header headerType="editNote" />

      {/* content */}
      {noteDetails ? (
        <>
          {/* display edit mode */}
          {editMode ? (
            <div>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                placeholder="Enter title"
                className="text-black"
              />
              <br />
              {/* ReactQuill for rich text editing */}
              <ReactQuill
                value={editedContent}
                onChange={setEditedContent}
                placeholder="Enter content"
                className="text-black"
              />
              <br />
              <button onClick={() => editNote(noteId)}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          ) : (
            // display the note details
            <div className="bg-red-200 flex-1">
              <h3 className="text-lg font-bold">{noteDetails.title}</h3>
              <div
                dangerouslySetInnerHTML={{ __html: noteDetails.content }}
                className="text-lg"
              ></div>
              {/* buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => router.push("/notes")}
                  className="bg-green-400"
                >
                  Done
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-400"
                >
                  Edit
                </button>
                <button
                  onClick={() => moveToTrash(noteId)}
                  className="bg-yellow-400"
                >
                  Move to trash
                </button>
                <button
                  onClick={() => deleteNote(noteId)}
                  className="bg-red-400"
                >
                  Delete permanently
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>No details available for this note.</p>
      )}
    </div>
  );
}

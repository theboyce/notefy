"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { db } from "@/app/firebase";
import {
  doc,
  collection,
  deleteDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { toast } from "sonner";
import dynamic from "next/dynamic";

// dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import Header from "@/app/components/header";
import { CustomToast } from "../addnote/AddNoteForm";

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
      toast(
        <CustomToast
          message="Note saved"
          title={"Note successfully updated"}
          type="success"
        />,
        {
          position: "top-center",
          style: {
            background: "white",
            color: "green",
            border: "2px solid #75e0a7",
          },
          duration: 3000,
        }
      );
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
      toast(
        <CustomToast
          message="Note deleted"
          title={`Note ${noteId} deleted!`}
          type="error"
        />,
        {
          position: "top-center",
          style: {
            background: "white",
            color: "#D92D20",
            border: "2px solid #D92D20",
          },
          duration: 3000,
        }
      );
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
      await updateDoc(noteDocRef, { deleted: true }); // mark the note as deleted
      router.back();
      // toast.success(`Note ${noteId} moved to trash!`);
      toast(
        <CustomToast
          message="Moved to trash"
          title={`Note ${noteId} moved to trash!`}
          // content={content}
          type="success"
        />,
        {
          position: "top-center",
          style: {
            background: "white",
            color: "green",
            border: "2px solid #75e0a7",
          },
          duration: 3000,
        }
      );
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
      <Header headerType={editMode ? "editNote" : "noteDetails"} />

      {/* content */}
      {noteDetails ? (
        <>
          {/* display edit mode */}
          {editMode ? (
            <div className="h-full flex flex-col pt-4">
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  placeholder="Enter title"
                  className="text-black"
                />
                {/* ReactQuill for rich text editing */}
                <ReactQuill
                  value={editedContent}
                  onChange={setEditedContent}
                  placeholder="Enter content"
                  className="text-black"
                />
              </div>
              <div className="pb-12 flex gap-2 justify-center">
                <button
                  onClick={() => editNote(noteId)}
                  className="py-2 px-4 rounded-md text-white bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="py-2 px-4 rounded-md text-darKBlue border border-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // display the note details
            <div className="flex-1 flex flex-col pt-4">
              <div className="flex-1 overflow-auto">
                <h3 className="text-2xl font-bold underline">
                  {noteDetails.title}
                </h3>
                <div
                  dangerouslySetInnerHTML={{ __html: noteDetails.content }}
                  className="text-lg"
                ></div>
              </div>

              {/* buttons */}
              <div className="flex justify-center gap-2 pb-12">
                <button
                  onClick={() => router.back()}
                  className="py-2 px-4 rounded-md text-white bg-green-700"
                >
                  Done
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  className="py-2 px-4 rounded-md text-white bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => moveToTrash(noteId)}
                  className="py-2 px-4 rounded-md text-white bg-yellow-500"
                >
                  Move to trash
                </button>
                <button
                  onClick={() => deleteNote(noteId)}
                  className="py-2 px-4 rounded-md text-white bg-red-600"
                >
                  Delete
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

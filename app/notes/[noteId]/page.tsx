"use client";

import { db } from "@/app/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

interface Note {
  id?: string;
  title: string;
  content: string;
  createdAt?: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function NoteDetails({ params }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noteDetails, setNoteDetails] = useState<Note | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  // fetch a single note by id with onSnapshot for real-time update
  const getNoteById = (noteId: string) => {
    try {
      setLoading(true);
      const noteDocRef = doc(db, "notes", noteId); // query the note with the given id

      onSnapshot(
        noteDocRef,
        (doc) => {
          if (doc.exists()) {
            const noteData = doc.data() as Note; // type the Note
            setNoteDetails({
              id: doc.id,
              ...noteData,
            });
            // set the content to be edited as the current note content
            setEditedTitle(noteData.title);
            setEditedContent(noteData.content);
          } else {
            console.log("No such document!");
            setNoteDetails(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching document: ", error);
          setError("Failed to fetch document");
          setLoading(false);
        }
      );
    } catch (e) {
      console.error("Error fetching document: ", e);
      setError("Failed to fetch document");
      setLoading(false);
    }
  };

  // edit a note by id
  const editNote = async (noteId: string) => {
    try {
      setLoading(true);
      const noteDocRef = doc(db, "notes", noteId); // get the note with by id (current note)
      // update the title and content with the text passed when in edit more
      await updateDoc(noteDocRef, {
        title: editedTitle,
        content: editedContent,
      });
      setEditMode(false);
    } catch (e) {
      console.error("Error updating document: ", e);
      setError("Failed to update document");
    } finally {
      setLoading(false);
    }
  };

  // fetch the note with the params id when the component first mounts
  useEffect(() => {
    if (params.noteId) {
      getNoteById(params.noteId);
    }
  }, [params.noteId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* heading */}
      {editMode ? (
        <h3 className="font-bold text-2xl">Edit Note</h3>
      ) : (
        <h3 className="font-bold text-2xl">Note details</h3>
      )}

      {/* content */}
      {noteDetails ? (
        <>
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
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                placeholder="Enter content"
                className="text-black"
              ></textarea>
              <br />
              <button onClick={() => editNote(noteDetails.id!)}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          ) : (
            // the current note
            <>
              <h3 className="text-lg font-bold">{noteDetails.title}</h3>
              <p className="text-lg">{noteDetails.content}</p>
              {noteDetails.createdAt && (
                <p className="text-sm text-gray-500">
                  Created at:{" "}
                  {new Date(
                    noteDetails.createdAt.seconds * 1000
                  ).toLocaleString()}
                </p>
              )}
              <button onClick={() => setEditMode(true)}>Edit</button>
            </>
          )}
        </>
      ) : (
        <p>No details available for this note.</p>
      )}
    </div>
  );
}

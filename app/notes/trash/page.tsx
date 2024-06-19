"use client";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Header from "@/app/components/header";
import { CustomToast } from "../addnote/AddNoteForm";
import NoNotes from "../NoNotes";

// structure of each note
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: any;
  deleted?: boolean;
}

export default function Trash() {
  const [user] = useAuthState(auth);

  const [loading, setLoading] = useState(false);
  const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);

  const notesCollectionRef = collection(db, "notes");

  const fetchDeletedNotes = async () => {
    if (user) {
      const notesQuery = query(
        notesCollectionRef,
        where("uid", "==", user.uid), // only query notes for this user
        where("deleted", "==", true), // only get notes which are deleted
        orderBy("createdAt", "desc")
      );

      try {
        setLoading(true);
        // onSnapshot for real-time updates
        onSnapshot(notesQuery, (querySnapshot) => {
          const notesList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Note[];
          setDeletedNotes(notesList);
          setLoading(false);
        });
      } catch (error) {
        toast.error("Error fetching deleted notes");
        setLoading(false);
      }
    }
  };

  const restoreNote = async (noteId: string) => {
    try {
      setLoading(true);
      const noteDocRef = doc(db, "notes", noteId);
      await updateDoc(noteDocRef, {
        deleted: false,
      });
      toast(
        <CustomToast
          message="Note restored"
          title={"Note restored successfully"}
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
      toast.error("Error restoring note");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchDeletedNotes();
    }
  }, [user]);

  return (
    <div className="space-y-4">
      <Header headerType="greeting" />

      <ul
        className={`grid grid-cols-1 sm:grid-cols-3 gap-2 justify-center items-center`}
      >
        {loading ? (
          <div>Loading...</div>
        ) : deletedNotes?.length === 0 ? (
          <div>There&apos;s nothing here...</div>
        ) : (
          deletedNotes?.map((note) => (
            // each card
            <li
              key={note.id}
              className="border border-gray-300 text-darkGray inline-block p-3 h-[160px] rounded-md bg-white hover:bg-gray-100 overflow-hidden space-y-2"
            >
              {/* go [noteId] in the catch-all routes */}
              <Link href={`/notes/${note.id}`} className="flex flex-col">
                <p className="font-bold text-lg pb-2 border-b border-gray-200">
                  {note.title}
                </p>

                {/* retain the rich text formatting */}
                <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                  <div
                    dangerouslySetInnerHTML={{ __html: note.content }}
                    className="truncate text-blueGray h-[50px] overflow-hidden flex-1"
                  ></div>
                  <div className="h-2 w-4 bg-red-500 rounded-full">&nbsp;</div>
                </div>
              </Link>
              <button
                onClick={() => restoreNote(note.id)}
                className="p-2 text-sm float-right rounded-md text-white bg-green-700"
              >
                Restore
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

// {deletedNotes?.map((note) => (
//   // each card
//   <li
//     key={note.id}
//     className="border border-gray-300 text-darkGray inline-block p-3 h-[160px] rounded-md bg-white hover:bg-gray-100 overflow-hidden space-y-2"
//   >
//     {/* go [noteId] in the catch-all routes */}
//     <Link href={`/notes/${note.id}`} className="flex flex-col">
//       <p className="font-bold text-lg pb-2 border-b border-gray-200">
//         {note.title}
//       </p>

//       {/* retain the rich text formatting */}
//       <div className="flex justify-between items-center border-t border-gray-200 pt-2">
//         <div
//           dangerouslySetInnerHTML={{ __html: note.content }}
//           className="truncate text-blueGray h-[50px] overflow-hidden flex-1"
//         ></div>
//         <div className="h-2 w-4 bg-red-500 rounded-full">&nbsp;</div>
//       </div>
//     </Link>
//     <button
//       onClick={() => restoreNote(note.id)}
//       className="p-2 text-sm float-right rounded-md text-white bg-green-700"
//     >
//       Restore
//     </button>
//   </li>
// ))}

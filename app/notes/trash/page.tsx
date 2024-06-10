"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/app/firebase";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import Header from "@/app/components/header";

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

  useEffect(() => {
    if (user && !loading) {
      fetchDeletedNotes();
    }
  }, [user]);

  return (
    <div className="space-y-4">
      <Header headerType="greeting" />

      <ul>
        {deletedNotes?.map((note) => (
          // each card
          <li
            key={note.id}
            className={`border border-gray-300 text-darkGray inline-block p-3 h-[160px] rounded-md bg-white hover:bg-gray-100 overflow-hidden`}
          >
            {/* go [noteId] in the catch-all routes */}
            <Link
              href={`/notes/${note.id}`}
              className="flex flex-col justify-between h-full"
            >
              <p className="font-bold text-lg pb-2 border-b border-gray-200">
                {note.title}
              </p>

              {/* retain the rich text formatting */}
              <div
                dangerouslySetInnerHTML={{ __html: note.content }}
                className="truncate text-blueGray"
              ></div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                <p className="text-gray-500 text-sm">
                  {/* {formatCreatedAt(note.createdAt)} */}
                </p>
                <div className="h-2 w-4 bg-green-500 rounded-full">&nbsp;</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

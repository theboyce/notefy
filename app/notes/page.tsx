"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import AllNotes from "./AllNotes";
import ProtectedRoute from "../ProtectedRoute";
import NoNotes from "./NoNotes";
import Header from "../components/header";

import { toast } from "sonner";
import { TbArrowsUpDown } from "react-icons/tb";
import { IoListSharp } from "react-icons/io5";
import { BiSolidGridAlt } from "react-icons/bi";
import { IoSearch } from "react-icons/io5";

// structure of each note
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: any;
}

export default function Notes() {
  const router = useRouter();

  // destructure what we need from the firebase hook
  const [user] = useAuthState(auth);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // from the db, get 'notes' collection
  const notesCollectionRef = collection(db, "notes");

  const fetchNotes = async () => {
    if (user) {
      const notesQuery = query(
        notesCollectionRef,
        where("uid", "==", user.uid), // only query notes for this user
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
          setNotes(notesList);
          setLoading(false);
        });
      } catch (error) {
        toast.error("Error fetching notes");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user && !loading) {
      fetchNotes();
    }
  }, [user]);

  // search functionality
  const filteredNotes = notes?.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="h-full space-y-4 flex flex-col">
        <Header />

        {/* search and display style */}
        <div className="flex justify-between items-center">
          {/* search note */}
          <div className="flex-1">
            {notes.length > 0 ? (
              <div className="p-2 flex gap-1 items-center justify-center border-2 border-gray-200 w-1/4 rounded-md">
                <input
                  type="text"
                  placeholder="Search notes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="outline-none w-full bg-transparent"
                />
                <span className="text-primary">
                  <IoSearch size={20} />
                </span>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="flex gap-2">
            <span className="bg-secondary rounded-sm text-primary p-2">
              <TbArrowsUpDown size={16} />
            </span>
            <span className="bg-secondary rounded-sm text-primary p-2">
              <IoListSharp size={16} />
            </span>
            <span className="bg-secondary rounded-sm text-primary p-2">
              <BiSolidGridAlt size={16} />
            </span>
          </div>
        </div>

        {/* add note */}
        {/* <AddNoteForm /> */}

        <div className="flex-1">
          {loading ? (
            <div>Loading...</div>
          ) : notes?.length === 0 ? (
            <NoNotes />
          ) : (
            <AllNotes notes={filteredNotes} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

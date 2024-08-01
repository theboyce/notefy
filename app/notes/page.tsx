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
  deleted?: boolean;
}

export default function Notes() {
  const router = useRouter();

  // destructure what we need from the firebase hook
  const [user] = useAuthState(auth);

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("grid");

  // from the db, get 'notes' collection
  const notesCollectionRef = collection(db, "notes");

  const fetchNotes = async () => {
    if (user) {
      const notesQuery = query(
        notesCollectionRef,
        where("uid", "==", user.uid), // only query notes for this user
        where("deleted", "==", false), // only get notes which are deleted
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
        <Header headerType="greeting" />

        {/* search and display style */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0">
          {/* search note */}
          <div className="flex-1">
            {notes.length > 0 ? (
              <div className="p-2 flex gap-1 items-center justify-center border-2 border-gray-200 w-full sm:w-1/4 rounded-md">
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

          <div className="flex gap-1 sm:gap-2">
            <button className="bg-gray-200 rounded-sm text-primary p-2">
              <TbArrowsUpDown size={16} />
            </button>
            {/* list */}
            <button
              className={`${view === "list" ? "bg-secondary" : "bg-gray-200"} rounded-sm text-primary p-2`}
              onClick={() => setView("list")}
            >
              <IoListSharp size={16} />
            </button>
            {/* grid */}
            <button
              className={`${view === "grid" ? "bg-secondary" : "bg-gray-200"} rounded-sm text-primary p-2`}
              onClick={() => setView("grid")}
            >
              <BiSolidGridAlt size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          {loading ? (
            <div>Loading...</div>
          ) : notes?.length === 0 ? (
            <NoNotes />
          ) : (
            <AllNotes notes={filteredNotes} view={view} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

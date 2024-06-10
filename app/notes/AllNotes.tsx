import Link from "next/link";
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
  view: string;
}

// component to output the notes
export default function AllNotes({ notes, view }: AllNotesProps) {
  const [loading, setLoading] = useState(false);

  const formatCreatedAt = (createdAt: {
    seconds: number;
    nanoseconds: number;
  }) => {
    const date = new Date(createdAt?.seconds * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // Format date according to browser locale
  };

  return (
    <ul
      className={`space-x-2 space-y-2 ${view === "grid" ? "grid grid-cols-1 sm:grid-cols-3 justify-center items-center" : "bg-blue-400 flex flex-col"}`}
    >
      {notes?.map((note) => (
        // each card
        <li
          key={note.id}
          className={`border border-gray-300 text-darkGray inline-block p-3 h-[160px] rounded-md bg-white hover:bg-gray-100 overflow-hidden ${view === "list" ? "" : ""}`}
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
                {formatCreatedAt(note.createdAt)}
              </p>
              <div className="h-2 w-4 bg-green-500 rounded-full">&nbsp;</div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

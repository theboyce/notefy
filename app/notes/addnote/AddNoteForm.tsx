"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import dynamic from "next/dynamic";
import { toast } from "sonner";

// dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export const CustomToast = ({ message, title, content, type }: any) => {
  return (
    <div className="flex items-start justify-center gap-2">
      {type === "success" ? (
        <Image
          src={"/images/success-toast-icon.svg"}
          alt="success icon"
          width={36}
          height={36}
        />
      ) : (
        <Image
          src={"/images/error-toast-icon.svg"}
          alt="success icon"
          width={36}
          height={36}
        />
      )}

      <div className="flex flex-col">
        <p className="font-semibold">{message}</p>
        <span>{title}</span>
      </div>
    </div>
  );
};

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
      toast(
        <CustomToast
          message="Invalid Input"
          title={"Please complete all fields"}
          // content={content}
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
      return;
    }

    try {
      setLoading(true);

      // simulate unable to add
      // throw new Error("Failed to add note");

      await addDoc(notesCollectionRef, {
        uid: user?.uid,
        title,
        content,
        deleted: false, // set deleted to false by default
        createdAt: serverTimestamp(),
      });
      toast(
        <CustomToast
          message="Note saved"
          title={title}
          content={content}
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

      setTitle("");
      setContent("");
      router.push("/notes");
    } catch (error) {
      toast(
        <CustomToast
          type="error"
          message="Unable to add note"
          title={title}
          content={content}
        />,
        {
          position: "top-center",
          style: {
            background: "white",
            color: "#D92D20",
          },
          duration: 3000,
        }
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-md">
      <label htmlFor="title" className="text-darkGray">
        Note title
      </label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter note title"
        className="text-darkGray border-2 bg-transparent border-gray-200 p-2 outline-none rounded-md placeholder:italic placeholder:text-sm"
      />
      <label htmlFor="content" className="text-darkGray">
        Content
      </label>
      {/* rich text formatting */}
      <div className="">
        <ReactQuill
          id="content"
          value={content}
          onChange={setContent}
          placeholder="Enter content"
          className="rounded-md"
          theme="snow"
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: ["Poppins"] }],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "video"],
              ["clean"],
            ],
          }}
        />
      </div>
      {/* buttons */}
      <div className="flex items-end justify-end gap-2 mt-4">
        <button
          onClick={() => router.push("/notes")}
          className="py-2 px-4 rounded-md text-darkGray bg-transparent border border-gray-400"
        >
          Cancel
        </button>
        <button
          onClick={addNote}
          className="py-2 px-4 rounded-md text-white bg-primary"
        >
          Save Note
        </button>
      </div>
    </div>
  );
}

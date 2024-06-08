"use server";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { revalidatePath } from "next/cache";

const notesCollectionRef = collection(db, "notes"); // from the db, get 'notes'

// server actions
export const addNote = async (prev: any, newNoteData: FormData) => {
  const newNote = {
    title: newNoteData.get("title"),
    content: newNoteData.get("content"),
  };

  // call our db to insert the newNote
  try {
    await addDoc(notesCollectionRef, newNote);

    // revalidate the data on the notes path
    revalidatePath("/notes");

    return {
      message: "note added",
    };
  } catch (error) {
    console.log(error);
    return {
      message: "note not added",
    };
  } finally {
  }
};

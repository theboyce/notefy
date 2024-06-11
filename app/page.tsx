"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { collection, doc, setDoc } from "firebase/firestore";

export default function Home() {
  const router = useRouter();

  // after the user logs in, handle the user here
  const handleGoogleSignIn = async () => {
    const googleProvider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, googleProvider); // trigger google auth modal
      const user = result.user;

      // add user to the users collection
      const userDocRef = doc(collection(db, "users"), user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
        { merge: true }
      );

      router.push("/notes");
    } catch (error) {
      console.log(error);
    }
  };

  // when the auth state changes
  const authChangeHandler = () => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
    });
  };

  return (
    <main className="h-screen bg-white flex flex-col px-8 py-6">
      <div className="font-bold">Notefy</div>
      <div className="flex flex-1 flex-col justify-center items-center gap-4">
        <h2 className="font-bold text-[3rem] text-primary text-center">
          Thoughts and Tunes Together
        </h2>
        <p className="text-blueGray">Keep your notes and playlists in sync</p>
        <button
          onClick={handleGoogleSignIn}
          className="bg-white  border border-darkBlue hover:bg-secondary hover:border hover:border-primary text-darkGray py-4 px-6 rounded-md flex items-center gap-2"
        >
          <FcGoogle />
          Continue with Google
        </button>
      </div>
    </main>
  );
}

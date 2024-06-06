"use client";

import {
  GoogleAuthProvider,
  signOut,
  signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function Home() {
  const router = useRouter();

  // after the user logs in, handle the user here
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/notes");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="h-screen bg-white flex flex-col px-8 py-6">
      <div className="font-bold">Notefy</div>
      <div className="flex flex-1 flex-col justify-center items-center gap-4">
      <h2 className="font-bold text-[3rem] text-primary">Thoughts and Tunes Together</h2>
      <p className="text-blueGray">Keep your notes and playlists in sync</p>
      <button onClick={handleGoogleSignIn} className="bg-white  border border-darkBlue hover:bg-secondary hover:border hover:border-primary text-darkGray py-4 px-6 rounded-md flex items-center gap-2">
      <FcGoogle/>
Continue with Google
      </button>
      </div>
    </main>
  );
}

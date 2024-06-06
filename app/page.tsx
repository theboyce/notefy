"use client";

import {
  GoogleAuthProvider,
  signOut,
  signInWithRedirect,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { useRouter } from "next/navigation";

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
    <main>
      <div>hey firebase</div>
      <button onClick={handleGoogleSignIn} className="bg-blue-400">
        continue with google
      </button>
      <p>hey</p>
    </main>
  );
}

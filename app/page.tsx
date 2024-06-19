"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  FacebookAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

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

  const handleTwitterSignIn = async () => {
    const twitterProvider = new TwitterAuthProvider();

    try {
      const result = await signInWithPopup(auth, twitterProvider); // trigger google auth modal
      const user = result.user;
      // console.log(user);

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

  const handleFacebookSignIn = async () => {
    const facebookProvider = new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(auth, facebookProvider); // trigger modal
      const user = result.user;
      console.log(user);

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

  return (
    <main className="h-screen bg-white flex flex-col px-8 py-6">
      <div className="font-bold">Notefy</div>
      <div className="flex flex-1 flex-col justify-center items-center gap-4">
        <h2 className="font-bold text-[3rem] text-primary text-center">
          Thoughts and Tunes Together
        </h2>
        <p className="text-blueGray">Keep your notes and playlists in sync</p>
        <div className="flex gap-2">
          <button
            onClick={handleTwitterSignIn}
            className="bg-transparent border border-darkBlue hover:bg-secondary hover:border hover:border-primary text-darkGray py-3 px-8 rounded-md flex items-center gap-2"
          >
            <FaTwitter size={24} color="#1DA1F2" />
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="bg-transparent border border-darkBlue hover:bg-secondary hover:border hover:border-primary text-darkGray py-3 px-8 rounded-md flex items-center gap-2"
          >
            <FcGoogle size={24} />
          </button>
          <button
            onClick={handleFacebookSignIn}
            className="bg-transparent border border-darkBlue hover:bg-secondary hover:border hover:border-primary text-darkGray py-3 px-8 rounded-md flex items-center gap-2"
          >
            <FaFacebook size={24} color="#1877F2" />
          </button>
        </div>
      </div>
    </main>
  );
}

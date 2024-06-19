"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { useRouter } from "next/navigation";
import { collection, doc, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleEmailPasswordSignIn = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(collection(db, "users"), user.uid);
      await setDoc(
        userDocRef,
        {
          uid: user.uid,
          email: user.email,
        },
        { merge: true }
      );

      toast.success("Sign-in successful!");
      router.push("/notes");
    } catch (error: unknown) {
      if (error.message === "Firebase: Error (auth/invalid-credential).") {
        toast.error("Invalid credentials");
      } else {
        toast.error("An internal error occured");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-screen bg-white flex flex-col p-4 sm:px-8 py-6">
      <div className="w-[142px] h-[32px] relative">
        <Image src={"/images/logo.svg"} fill alt="Notefy logo" />
      </div>
      <div className="flex flex-1 flex-col sm:justify-center items-center gap-4">
        <div>
          <h2 className="font-bold text-[3rem] text-primary text-center">
            Thoughts and Tunes <br />
            Together
          </h2>
          <p className="text-blueGray text-center">
            Keep your notes and playlists in sync
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-center text-[1.5rem]">
            Log in to your account
          </h3>
          <p className="text-blueGray text-center">
            Welcome back! Please Enter your details
          </p>
        </div>

        {/* input fields */}
        <form
          onSubmit={handleEmailPasswordSignIn}
          className="sm:w-[300px] space-y-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border border-gray-300 rounded-md p-2 w-full outline-none"
            required
          />
          <input
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent border border-gray-300 rounded-md p-2 w-full outline-none"
            required
          />
          <button
            type="submit"
            className="bg-primary w-full text-white p-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>

        {/* buttons */}
        <div className="flex gap-2 w-full sm:w-[300px]">
          <button
            onClick={handleTwitterSignIn}
            className="bg-transparent border border-darkBlue hover:bg-secondary hover:border hover:border-primary text-darkGray py-2 flex flex-1 justify-center rounded-md"
          >
            <FaTwitter size={20} color="#1DA1F2" />
          </button>
          <button
            onClick={handleGoogleSignIn}
            className="bg-transparent border border-darkBlue hover:bg-secondary hover:border hover:border-primary text-darkGray py-2 flex flex-1 justify-center rounded-md"
          >
            <FcGoogle size={20} />
          </button>
          <button
            onClick={handleFacebookSignIn}
            className="bg-transparent border border-darkBlue hover:bg-secondary hover:border hover:border-primary text-darkGray py-2 flex flex-1 justify-center rounded-md"
          >
            <FaFacebook size={20} color="#1877F2" />
          </button>
        </div>
        <p>
          Don&apos;t have an account?{" "}
          <button className="text-primary">
            <Link href={"/signup"}>Sign Up</Link>
          </button>
        </p>
      </div>
    </main>
  );
}

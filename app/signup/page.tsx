"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import * as yup from "yup";
import { IoIosCheckmarkCircle } from "react-icons/io";

// validation schema
const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain a special character"
    ),
});

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleSignUp = async (data: any) => {
    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = result.user;
      toast.success("Sign-up successful!");

      const userDocRef = doc(collection(db, "users"), user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        username: data.username,
      });
      reset();
      router.push("/notes");
    } catch (error) {
      console.log(error);
      toast.error("Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordValue = watch("password", "");
  const usernameValue = watch("username", "");

  const isPasswordLongEnough = passwordValue.length >= 8;
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);

  return (
    <main className="h-screen bg-white flex flex-col p-4 sm:px-8 py-6">
      <div className="w-[142px] h-[32px] relative">
        <Image src={"/images/logo.svg"} fill alt="Notefy logo" />
      </div>
      <div className="flex flex-1 flex-col sm:justify-center items-center gap-4">
        <h2 className="font-bold text-[3rem] text-primary text-center">
          Thoughts and Tunes <br />
          Together
        </h2>

        <div>
          <h3 className="font-semibold text-center text-[1.5rem]">
            Create an account
          </h3>
          <p className="text-blueGray text-center">
            Create a safe space for your notes.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="sm:w-[300px] space-y-4"
        >
          <div>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              {...register("username")}
              className="bg-transparent border border-gray-300 rounded-md p-2 w-full outline-none"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email")}
              className="bg-transparent border border-gray-300 rounded-md p-2 w-full outline-none"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-around border border-gray-300 rounded-md">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Create a secure password"
                {...register("password")}
                className="bg-transparent p-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 text-sm"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="text-sm space-y-1 pt-2">
              <p
                className={`flex gap-1 items-center ${isPasswordLongEnough ? "text-primary" : "text-gray-400"}`}
              >
                <IoIosCheckmarkCircle size={20} />
                Must be at least 8 characters
              </p>
              <p
                className={`flex gap-1 items-center ${hasSpecialCharacter ? "text-primary" : "text-gray-400"}`}
              >
                <IoIosCheckmarkCircle size={20} />
                Must contain at least one special character
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-primary w-full text-white p-2 rounded-md"
            disabled={loading || !isValid}
          >
            {loading ? "Loading..." : "Get started"}
          </button>
        </form>

        <p>
          Already have an account?{" "}
          <button className="text-primary">
            <Link href={"/"}>Login</Link>
          </button>
        </p>
      </div>
    </main>
  );
}

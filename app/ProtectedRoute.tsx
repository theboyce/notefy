"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  //   console.log("user proptected" + user);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!loading) {
        if (!user) {
          // redirect to the home page if the user is not authenticated
          router.push("/");
        }
      }
    };

    checkAuthentication();
  }, [loading, user, router]);

  return <>{children}</>;
};

export default ProtectedRoute;

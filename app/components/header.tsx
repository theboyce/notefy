"use client";

import { useRouter } from "next/navigation";
import { SlNote } from "react-icons/sl";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface HeaderProps {
  headerType: "greeting" | "editNote" | "addNote"; // only accept these types
}

export default function Header({ headerType }: HeaderProps) {
  const router = useRouter();
  const [user] = useAuthState(auth);

  // dynamically render the header's content
  const renderContent = () => {
    switch (headerType) {
      case "greeting":
        return (
          <section className="flex justify-between items-center">
            <div className="space-y-2">
              <span className="text-2xl font-medium">
                Hello, {user?.displayName}
              </span>
              <p className="text-gray-500">What&apos;s on your mind today?</p>
            </div>
            <button
              className="bg-primary text-white p-2 rounded-md"
              onClick={() => router.push("/notes/addnote/")}
            >
              <SlNote size={16} color="#fff" />
            </button>
          </section>
        );
      case "editNote":
        return (
          <section className="space-y-2">
            <span className="text-2xl font-medium">Edit Note</span>
            <p className="text-gray-500">What&apos;s on your mind today?</p>
          </section>
        );
      case "addNote":
        return (
          <section className="space-y-2">
            <span className="text-2xl font-medium">Add Note</span>
            <p className="text-gray-500">What&apos;s on your mind today?</p>
          </section>
        );
      default:
        return null;
    }
  };

  return <section className="w-full">{renderContent()}</section>;
}

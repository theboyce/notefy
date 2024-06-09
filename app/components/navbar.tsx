"use client";

import Link from "next/link";
import Image from "next/image";

import { FaPlus } from "react-icons/fa6";
import { PiNotebookBold } from "react-icons/pi";
import { TbTrash } from "react-icons/tb";
import { PiMusicNotesPlusBold } from "react-icons/pi";
import { TbSettings } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

export default function Navbar() {
  const [user] = useAuthState(auth);

  console.log(user?.email);
  console.log(user?.displayName);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // router.push("/");
      toast.success("User signed out");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen min-w-[20%] static flex flex-col justify-between bg-white px-4 py-8">
      <div className="flex flex-col gap-12">
        <Image
          src={"images/logo.svg"}
          width={142}
          height={32}
          alt="Notefy logo"
        />
        {/* navbar links */}
        <div className="flex flex-col gap-2">
          <Link
            href={"/notes"}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-sm"
          >
            <span>
              <FaPlus size={18} />
            </span>{" "}
            Create Note
          </Link>
          <Link
            href={"/notes"}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-sm"
          >
            <span>
              <PiNotebookBold size={18} />
            </span>
            All Notes
          </Link>
          <Link
            href={"/notes"}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-sm"
          >
            <span>
              <TbTrash size={18} />
            </span>
            Trash
          </Link>
          <Link
            href={"/notes"}
            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-sm"
          >
            <span>
              <PiMusicNotesPlusBold size={18} />
            </span>
            Add Playlist{" "}
          </Link>
        </div>
      </div>
      {/* buttom navigation and user details */}
      <div className="flex flex-col gap-2">
        <Link
          href={"/notes"}
          className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-sm"
        >
          <span>
            <TbSettings size={18} />
          </span>
          Settings
        </Link>

        {/* user details with logout */}
        <div className="flex items-center justify-between py-6 border-t">
          <div className="flex items-center gap-2">
            <div className="h-[40px] w-[40px] bg-black rounded-full"></div>
            <div className="flex flex-col gap-1">
              <p className="text-[16px] font-regular">{user?.displayName}</p>
              <p className="text-[14px] font-light truncate">
                kwabenaadofo330@gmail.com
              </p>
            </div>
          </div>
          <button onClick={handleSignOut}>
            <LuLogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

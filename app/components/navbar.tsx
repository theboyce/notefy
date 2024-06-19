"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

import { toast } from "sonner";
import { FaPlus } from "react-icons/fa6";
import { PiNotebookBold } from "react-icons/pi";
import { TbTrash } from "react-icons/tb";
import { PiMusicNotesPlusBold } from "react-icons/pi";
import { TbSettings } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
      toast.success("Sign out success");
    } catch (error) {
      console.log(error);
    }
  };

  const navItems = [
    {
      icon: <FaPlus size={18} />,
      name: "Create Note",
      url: "/notes/addnote",
    },
    {
      icon: <PiNotebookBold size={18} />,
      name: "All Notes",
      url: "/notes",
    },
    {
      icon: <TbTrash size={18} />,
      name: "Trash",
      url: "/notes/trash",
    },
    {
      icon: <PiMusicNotesPlusBold size={18} />,
      name: "Add Playlist",
      url: "/notes/addplaylist",
    },
  ];

  return (
    <div className="h-screen min-w-[20%] hidden sm:flex flex-col justify-between bg-white px-4 py-8">
      <div className="flex flex-col gap-12">
        <Link href={"/"}>
          <div className="relative w-[142px] h-[32px]">
            <Image src={"/images/logo.svg"} fill alt="Notefy logo" />
          </div>
        </Link>
        {/* navbar links */}
        <div className="flex flex-col gap-2">
          {navItems.map((item, i) => (
            <Link
              key={i}
              href={item.url}
              className={`flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-sm ${item.url === pathname ? "bg-secondary text-primary" : ""}`}
            >
              <span>{item.icon}</span> {item.name}
            </Link>
          ))}
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
          <div className="flex flex-col gap-1">
            <span className="text-[14px] font-regular">
              {user?.displayName || "User"}
            </span>
            <span className="text-[12px] font-light">{user?.email}</span>
          </div>
          <button onClick={handleSignOut}>
            <LuLogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

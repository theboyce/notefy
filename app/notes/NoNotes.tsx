import Image from "next/image";
import Link from "next/link";
import { FaPlus } from "react-icons/fa6";

export default function NoNotes() {
  return (
    <div className="h-full flex flex-col justify-center items-center gap-2">
      <Image
        alt="No note icon"
        height={184}
        width={144}
        src={"/images/no-note-icon.svg"}
      />

      <h2 className="text-xl font-semibold">No notes yet!</h2>
      <p className="text-center font-normal">
        Embrace your empty canvas. It is the <br /> beginning of your great
        stories
      </p>

      <Link
        href={"/notes/addnote/"}
        className="bg-primary flex items-center gap-1 text-white py-2 px-4 rounded-md"
      >
        <FaPlus size={16} />
        Add a note
      </Link>
    </div>
  );
}

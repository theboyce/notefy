"use client";

import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Link from "next/link";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import ProtectedRoute from "../ProtectedRoute";
import { toast } from "sonner";

// structure of each note
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt?: any; // Adjust type as needed
}

const Notes = () => {
  const router = useRouter();

  // destructure what we need from the firebase hook
  const [user] = useAuthState(auth);
  // const { displayName, email, uid } = user;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // router.push("/");
      console.log("User signed out");
    } catch (error) {
      console.log(error);
    }
  };

  // handle current user state
  const authChangeHandler = () => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
    });
  };

  const notesCollectionRef = collection(db, "notes"); // from the db, get 'notes'

  // getting all the notes
  const fetchNotes = async () => {
    try {
      setLoading(true);
      //   real time fetching of the data
      onSnapshot(
        query(notesCollectionRef, orderBy("createdAt", "desc")), // sort in descending order
        (snapshot) => {
          const notesList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Note[];
          setNotes(notesList);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching notes: ", err);
          // setError(err);
          console.log(err);
          setLoading(false);
        }
      );
    } catch (err) {
      // setError(err);
      console.log(err);
      setLoading(false);
    }
  };

  //   adding a new note
  const addNote = async () => {
    if (!title || !content) {
      toast.error("Please complete all fields");
      return;
    }

    try {
      setLoading(true);
      await addDoc(notesCollectionRef, {
        title,
        content,
        createdAt: serverTimestamp(),
      });
      toast.success("Note added");
      setTitle("");
      setContent("");
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //   deleting a note
  const deleteNote = async (noteId: string) => {
    try {
      const noteDocRef = doc(db, "notes", noteId);
      await deleteDoc(noteDocRef);
      toast.success(`Note ${noteId} deleted!`);
    } catch (error) {
      console.log("Error deleting document: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      fetchNotes();
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1>Display Notes Page</h1>

        {/* add note */}
        <form action={addNote}>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="text-black border-2 border-gray-200 p-2"
          />
          <br />
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content"
            className="text-black border-2 border-gray-200 p-2"
          ></textarea>
          <br />
          <button
            type="submit"
            aria-disabled={loading}
            className="bg-gray-700 text-white"
          >
            Add Note
          </button>
        </form>

        {/* TODO output notes here - use a diff component */}
        {loading ? (
          <div>Loading...</div>
        ) : !notes.length ? (
          <div>No notes found</div>
        ) : (
          <ul className="space-x-2 space-y-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="bg-blue-800 text-white inline-block p-2"
              >
                {/* go [noteId] in the catch-all routes */}
                <Link href={`/notes/${note.id}`}>
                  <p>Title: {note.title}</p>
                  <p>Content: {note.content}</p>
                </Link>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="bg-red-400"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* delete after */}
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
          velit placeat aliquid sed reiciendis distinctio nam ipsam impedit
          eaque vel, fugit soluta, obcaecati labore animi magnam non temporibus
          asperiores tempora voluptatem minus aperiam alias? Harum consequatur
          non, at impedit vero, ut animi veritatis ducimus quisquam praesentium
          numquam! Ullam assumenda quaerat minus odio magnam explicabo amet
          eaque quo. Animi eum numquam repellendus dolore iste. Autem
          perspiciatis nisi error temporibus. Minima nesciunt veritatis quae qui
          quam quasi explicabo labore aliquid maxime! Nesciunt quaerat voluptas
          ab temporibus. Similique suscipit, fugiat autem voluptate omnis magni
          itaque tenetur nulla excepturi cumque perspiciatis blanditiis eos vel
          beatae nisi repellendus enim, commodi mollitia quidem optio sunt eius
          consectetur. Veniam, velit voluptates! Aliquid illum quisquam ex
          inventore eius qui earum voluptate sint id, corrupti reprehenderit
          voluptates voluptatum veniam aspernatur deserunt dolores dignissimos
          quod molestias? Ratione beatae adipisci quia laudantium aliquid quas
          eius consequatur, quod sit excepturi tenetur nam doloremque soluta,
          magnam molestias dignissimos aut qui? Natus quod atque adipisci fugit
          culpa enim, aperiam consequatur, quae incidunt corrupti eos provident
          officia itaque similique repudiandae illo error ad facere velit!
          Placeat amet quae autem quisquam nobis aliquid omnis voluptatibus
          maxime, veritatis consequuntur at libero inventore labore voluptatem
          ducimus nihil ex eveniet iure aperiam? Dignissimos harum et natus
          distinctio reprehenderit adipisci laborum libero possimus nemo, eaque
          repudiandae odio optio architecto, iusto facilis sapiente at?
          Laudantium, amet quas, dolor assumenda eveniet nulla commodi sunt
          doloremque deserunt eligendi, neque in quis pariatur voluptatibus
          minus! Quaerat, corrupti sit pariatur veritatis omnis, nulla
          aspernatur aliquam dolores adipisci tempore eveniet sequi. Nulla
          accusantium recusandae, nemo doloribus repellendus libero sequi
          laborum! Dignissimos recusandae rem voluptas! Fuga commodi accusamus
          aperiam at perspiciatis unde possimus obcaecati! Quia possimus quaerat
          itaque? Maxime libero natus omnis recusandae, aliquam ipsa
          voluptatibus in totam autem harum unde minus, tenetur ex excepturi
          quasi suscipit culpa ut perferendis accusamus, quas adipisci modi esse
          praesentium laudantium! Possimus, molestiae libero quidem beatae earum
          tempora blanditiis quibusdam minima voluptates sit saepe alias enim
          nesciunt ullam, dolorem veritatis laudantium ratione? Ipsa eum
          possimus maxime quidem quae autem, ex rem ipsam repellat, quisquam
          ducimus perferendis sunt facere quasi optio, veniam error tempore
          eaque! Veritatis libero quis fuga doloribus. Doloribus sed vitae ex
          beatae ab harum blanditiis, consequatur deserunt laudantium earum
          placeat sint voluptatibus. Laborum porro nesciunt, ea velit aperiam
          delectus recusandae et beatae nulla, labore provident magnam corporis
          nemo pariatur ipsam laboriosam fuga. Dignissimos sapiente deserunt
          voluptates et iste similique sed laboriosam maiores, odit nobis veniam
          itaque nam explicabo adipisci ad quos impedit provident illo dolores
          ut. Blanditiis non fuga, at hic facilis, architecto rerum qui
          consequuntur voluptas iure facere, exercitationem sequi perspiciatis
          maxime doloremque quo molestias possimus quod optio alias aliquam.
          Tempora repellendus doloribus explicabo dolorum aliquam? Blanditiis
          natus deleniti, molestiae recusandae voluptatum ullam inventore
          provident molestias ab dolores illo dolorum quibusdam numquam
          cupiditate aperiam aliquam explicabo veritatis ea est eius,
          voluptatem, ipsam repudiandae ipsa quis. Quaerat mollitia dolor
          similique iste ipsa tempore dolorem, dignissimos incidunt nemo
          repellendus odit vel voluptas consequuntur distinctio hic vitae
          doloremque ipsam debitis culpa eius? Dolorum perferendis, esse
          asperiores recusandae eveniet maiores distinctio neque autem earum
          molestias nesciunt eligendi? Atque et in obcaecati illum debitis
          assumenda culpa aperiam repellendus architecto, ipsam quia voluptatum,
          vel dolor fugit officia magnam voluptatem harum laborum? Neque beatae,
          odio recusandae adipisci excepturi ipsam? Porro non quae ea assumenda
          at fugit quos ducimus laudantium quod commodi earum facilis enim
          nesciunt, dolorum nam aperiam deserunt asperiores nihil voluptas eius
          minus qui sed totam. Blanditiis iure unde nostrum veniam eaque nam
          quia est minima sunt nisi vitae laudantium doloremque pariatur quam
          eum iusto, veritatis ea quas possimus eius harum. Maiores mollitia
          nemo asperiores possimus dicta id, corporis, quo nostrum animi tempore
          fuga dolores explicabo adipisci saepe ducimus velit alias dolorum enim
          dolore quod ex architecto. Non laboriosam sequi nam inventore
          praesentium harum at rerum sunt maiores laborum maxime ullam, amet
          placeat expedita quidem itaque id repellendus est deleniti. Nulla
          repellendus laborum ex, doloribus, ipsum ipsa at possimus quaerat
          molestiae, ducimus eveniet amet aut nihil accusamus dicta? Cupiditate
          veritatis corrupti nihil repellendus laborum, vitae sapiente sit!
          Perferendis modi explicabo quam libero laudantium quae nemo, illum
          nulla harum doloremque atque! Soluta eveniet totam error nihil quasi
          temporibus reiciendis eaque, officiis deserunt dicta aliquid tempora!
        </div>

        {/* logout */}
        <button onClick={handleSignOut} className="bg-red-400">
          sign out
        </button>
      </div>
    </ProtectedRoute>
  );
};

export default Notes;

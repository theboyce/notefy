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
        uid: user?.uid,
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

        {/* delete */}
        <div>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Beatae
          necessitatibus omnis provident nesciunt fugit recusandae! Libero
          dolores consequuntur expedita esse tempore atque laborum non ex
          officia. Impedit quos at adipisci porro numquam ad modi iusto nobis
          commodi quidem? Delectus voluptates eum quo ipsa earum vel ab, atque
          impedit facilis tenetur est distinctio explicabo et, odit voluptas
          alias aperiam nemo unde reiciendis doloribus asperiores cumque. Sunt
          doloremque, dolor laudantium culpa dolore eius saepe excepturi
          deserunt eos quaerat dignissimos repudiandae amet asperiores?
          Reiciendis velit dolor, inventore molestiae adipisci vero nobis rerum
          deleniti optio labore totam, officiis tempora dolorem incidunt nisi
          error numquam earum facilis accusantium iusto maiores quidem officia.
          Reiciendis error, veniam nam illo quibusdam adipisci unde minus quasi
          iste. Voluptatum vitae obcaecati magnam illum dignissimos maxime porro
          ab iste doloremque quia ratione doloribus ea a in, et, architecto
          cumque perferendis? Dolorem velit fugit placeat libero omnis porro
          perspiciatis officiis. Quos labore dolorum alias itaque debitis
          repudiandae ducimus quia error deserunt dignissimos iure, asperiores
          adipisci rem atque ut, cum voluptas architecto tempora optio
          accusamus. Nemo sapiente dignissimos, saepe atque odio, fugiat
          temporibus iste dolore eligendi optio perferendis itaque eveniet
          suscipit enim voluptas, veniam quia. Iste voluptates eos odio, totam
          obcaecati autem rerum quisquam harum aperiam quod minus tenetur ex at?
          Ut incidunt unde molestias exercitationem ea voluptate ipsam illum
          commodi assumenda accusamus ducimus recusandae consequatur aut harum,
          impedit voluptas corporis natus totam nisi reprehenderit cumque
          blanditiis? Molestiae esse repellat nisi sit quod tempora mollitia rem
          exercitationem facere! Quidem odio sunt nisi, ab ratione suscipit
          debitis hic eius, assumenda harum voluptates vero autem aliquid
          molestiae alias, itaque veniam quam quibusdam optio nemo voluptatum.
          Optio dolor neque incidunt ipsum nulla delectus at eligendi unde minus
          quidem possimus suscipit, explicabo molestiae exercitationem
          doloremque deleniti totam tempora excepturi! Cupiditate, similique
          laborum? Laboriosam, vitae unde? Dolorem perferendis eum voluptatibus
          aliquid ipsum voluptates recusandae a laboriosam blanditiis, placeat,
          quis laborum incidunt sapiente molestiae voluptate rerum! Sequi quos
          laborum voluptatem ea quisquam id voluptates, provident debitis aut,
          eveniet fugit. Praesentium officiis tempore, quis facere non
          aspernatur necessitatibus. Tempora veniam expedita hic, minima
          provident dolorum sapiente magnam necessitatibus, harum laboriosam
          quia aliquid architecto consequatur nostrum ratione in quo voluptatum,
          accusantium adipisci rem? Cumque, itaque omnis iusto earum vitae iure
          minima debitis recusandae explicabo mollitia? Impedit odit aut
          perspiciatis, neque quia blanditiis ut quo autem facere veniam modi
          eaque obcaecati amet ex labore minima, sapiente est cumque fugit
          necessitatibus? Libero inventore repellendus itaque excepturi illo
          nostrum debitis maxime fuga, ducimus officiis illum magnam doloribus
          blanditiis. Perspiciatis, illum. Quis repellat earum mollitia optio
          natus, voluptatibus ab, culpa tempore explicabo ratione corporis nulla
          saepe in suscipit dolorem commodi incidunt? Beatae culpa dolores
          ducimus sequi possimus ex praesentium voluptatum esse minima sunt
          reprehenderit corporis sit, amet architecto deleniti odit assumenda
          impedit. Quasi, labore perspiciatis est quidem veritatis magni
          sapiente aperiam laudantium sunt, commodi obcaecati? Voluptas sint hic
          minus necessitatibus accusantium ratione officia iusto inventore animi
          ducimus laborum neque praesentium, nihil doloribus magnam veritatis
          repellat eius. Nisi cum praesentium ratione nostrum unde quos mollitia
          est sint doloremque excepturi placeat, quaerat laudantium recusandae
          veniam minus ab labore quas molestiae voluptas quisquam provident
          eveniet, accusantium, id impedit. Quia iusto soluta corporis! Laborum,
          voluptate porro eum quaerat ullam sint obcaecati voluptates fugit
          accusamus magnam quo modi ratione officia dicta et distinctio at
          numquam delectus. Obcaecati ipsam nam quasi vel atque. Ab nisi,
          repellat optio eveniet possimus qui modi nam excepturi, quo laborum,
          et minima. Fugiat, maiores? Totam eius, obcaecati, numquam ea placeat
          aliquam illo nam aspernatur, quae sit laborum alias molestiae quasi
          neque. Nisi ab, sit laudantium eum incidunt voluptatum nulla ratione,
          fuga temporibus voluptas quos officia! Id praesentium vero autem
          repellat, odit dolore fugiat sit illum aliquam nulla doloribus iusto.
          Vel necessitatibus suscipit totam culpa tempore reiciendis. Ab optio
          inventore non natus aut sint quas quos, corporis voluptatum minus
          dolore expedita vero recusandae deserunt ad asperiores ipsam atque
          autem. Quia, quaerat ducimus. Magni quas veritatis, adipisci similique
          dignissimos facilis maxime tenetur harum explicabo natus deserunt
          quia, nisi vel consectetur, suscipit ipsum cupiditate sint excepturi
          minima soluta velit officiis! Maxime, vero harum sunt sequi quo illum
          fugiat autem quidem. Rerum quisquam eius temporibus amet tenetur
          aspernatur? Corrupti dolore et veritatis itaque. Voluptatum pariatur
          placeat, porro et reiciendis quasi.
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

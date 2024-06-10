import Header from "@/app/components/header";
import AddNoteForm from "./AddNoteForm";

export default function page() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Header headerType="addNote" />

      <section className="flex-1 w-full sm:w-[80%]">
        <AddNoteForm />
      </section>
    </div>
  );
}

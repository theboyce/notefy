import { Toaster } from "sonner";
import Navbar from "../components/navbar";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex bg-gray-100 gap-4 h-screen overflow-hidden">
      {/* Include shared UI here e.g. a header or sidebar */}
      <Navbar />

      {/* initialize toast here */}
      <Toaster />

      <div className="flex-1 p-4 sm:p-8">{children}</div>
    </section>
  );
}

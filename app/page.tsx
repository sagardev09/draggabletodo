import Image from "next/image";
import KanbanBoard from "./components/KanbanBoard";

export default function Home() {
  return (
    <main className="bg-black text-white h-[100vh] w-[100vw]">
      <KanbanBoard />
    </main>
  );
}

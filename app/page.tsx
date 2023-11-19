import Image from "next/image";
import KanbanBoard from "./components/KanbanBoard";
import ThemeToggle from "./components/Theme";

export default function Home() {
  return (
    <main className=" h-[100vh] w-[100vw]">
      <div className="fixed left-[50px] top-[50px] flex gap-10 items-center">
        <h1 className="text-white text-2xl font-medium uppercase tracking-wider logoname">
          TaskWave
        </h1>
        <ThemeToggle />
      </div>
      <KanbanBoard />
    </main>
  );
}

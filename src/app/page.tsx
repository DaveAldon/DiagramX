"use client";

import DiagramFrame from "@components/DiagramFrame";

export default function Home() {
  return (
    <main className="font-mono">
      <div className="flex flex-col min-h-screen">
        <div className="flex h-16 items-center justify-between bg-green-300">
          <h1 className="">React Flow</h1>
        </div>
        <div
          style={{
            height: "calc(100vh - 4rem)",
            width: "100vw",
          }}
        >
          <DiagramFrame />
        </div>
      </div>
    </main>
  );
}

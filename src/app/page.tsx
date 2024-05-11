"use client";

import { Toaster } from "@/components/Toast/toaster";
import DiagramFrame from "@components/DiagramFrame";

export default function Home() {
  return (
    <main className="font-mono">
      <div className="flex flex-col min-h-screen">
        <div className="hidden h-16 items-center justify-between bg-green-300">
          <h1 className="">Header</h1>
        </div>
        <div
          style={{
            height: "calc(100vh)",
            width: "100vw",
          }}
        >
          <DiagramFrame />
          <Toaster />
        </div>
      </div>
    </main>
  );
}

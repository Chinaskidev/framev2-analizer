"use client";

import dynamic from "next/dynamic";

const Analizador = dynamic(() => import("../app/components/frame"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      <Analizador />
    </main>
  );
}
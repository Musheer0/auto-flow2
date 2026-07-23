"use client";

import Aurora from "@/components/Aurora";

export default function Page() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Aurora Background */}
      <div className="absolute inset-0">
        <Aurora
          colorStops={["#7cff67", "#B497CF", "#5227FF"]}
          blend={0.6}
          amplitude={1.2}
          speed={0.8}
        />
      </div>

      {/* Dark fade so only edges glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.75)_75%,#000_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">
            Generating...
          </h1>
          <p className="mt-3 text-zinc-400">
            AI is cooking something.
          </p>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";

export default function LookbookPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Back button */}
      <Link
        href="/"
        className="absolute top-5 left-5 text-[11px] font-bold tracking-[0.15em] text-black border border-gray-200 rounded-[6px] px-3 py-1.5 hover:bg-[#E0E0E0] hover:border-black transition-all duration-200"
      >
        ← BACK
      </Link>

      {/* Placeholder content */}
      <div className="flex flex-col items-center gap-4 text-center max-w-xs">
        {/* Grid icon placeholder */}
        <div className="grid grid-cols-3 gap-1.5 opacity-20 mb-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="w-14 h-14 bg-black rounded-[4px]" />
          ))}
        </div>

        <h1 className="font-bold text-[15px] tracking-[0.2em] text-black uppercase">
          Lookbook
        </h1>
        <p className="text-[11px] text-[#494949] tracking-[0.05em] leading-relaxed">
          No lookbook yet.
          <br />
          Check back soon.
        </p>
      </div>

      {/* Footer */}
      <p className="absolute bottom-5 text-[9px] text-gray-400 tracking-widest">
        © MRIZO CORNER EST. 2026
      </p>
    </main>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, getLookbookImageUrl } from "@/lib/supabase";
import { LookbookImage } from "@/lib/types";
import LookbookSkeleton from "@/components/LookbookSkeleton";

export default function LookbookPage() {
  const [images, setImages] = useState<LookbookImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchImages() {
      try {
        const { data, error } = await supabase
          .from("lookbook_images")
          .select("id, storage_path, alt_text, display_order, created_at")
          .eq("is_visible", true)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (error) throw error;
        setImages(data ?? []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 py-3 flex items-center gap-4">
        <Link
          href="/"
          className="text-[11px] font-bold tracking-[0.15em] text-black border border-gray-200 rounded-[6px] px-3 py-1.5 hover:bg-[#E0E0E0] hover:border-black transition-all duration-200"
        >
          ← BACK
        </Link>
        <h1 className="font-bold text-[13px] tracking-[0.3em] text-black uppercase">
          Lookbook
        </h1>
      </div>

      {/* Masonry Grid */}
      <div className="px-3 py-4">
        <div
          className="columns-2 md:columns-3 gap-3 space-y-0"
          style={{ columnFill: "balance" }}
        >
          {loading ? (
            <LookbookSkeleton />
          ) : error ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center px-6">
              <p className="text-[12px] text-gray-400 tracking-wider">
                Something went wrong. Try again later.
              </p>
            </div>
          ) : images.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center px-6">
              {/* Ghost grid hint */}
              <div className="grid grid-cols-3 gap-1.5 opacity-10 mb-5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-12 h-12 bg-black rounded-[4px]" />
                ))}
              </div>
              <p className="font-bold text-[13px] tracking-[0.2em] text-black uppercase mb-1">
                No lookbook yet
              </p>
              <p className="text-[11px] text-[#494949] tracking-wider">
                Check back soon.
              </p>
            </div>
          ) : (
            images.map((img, i) => (
              <LookbookCard
                key={img.id}
                src={getLookbookImageUrl(img.storage_path)}
                alt={img.alt_text ?? "MRIZO CORNER lookbook photo"}
                index={i}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-[9px] text-gray-400 tracking-widest py-6">
        © MRIZO CORNER EST. 2026
      </p>
    </main>
  );
}

// Individual card — fade in + hover zoom
function LookbookCard({
  src,
  alt,
  index,
}: {
  src: string;
  alt: string;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="break-inside-avoid mb-3 rounded-[8px] overflow-hidden bg-gray-100 cursor-pointer group relative"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.4s ease ${index * 60}ms, transform 0.4s ease ${index * 60}ms`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={400}
        height={600}
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
        onLoad={() => setLoaded(true)}
        unoptimized
      />
    </div>
  );
}

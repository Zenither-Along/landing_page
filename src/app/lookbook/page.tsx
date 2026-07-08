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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const { data, error } = await supabase
          .from("lookbook_images")
          .select("id, storage_path, alt_text, is_visible, display_order, file_size_bytes, created_at")
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
      {previewUrl && <PublicImagePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />}
      
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
                onClick={() => setPreviewUrl(getLookbookImageUrl(img.storage_path))}
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
  onClick,
}: {
  src: string;
  alt: string;
  index: number;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className="break-inside-avoid mb-3 rounded-[8px] overflow-hidden bg-gray-100 cursor-zoom-in group relative"
      style={{
        opacity: loaded ? 1 : 0,
        transform: loaded ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.4s ease ${index * 60}ms, transform 0.4s ease ${index * 60}ms`,
      }}
      onClick={onClick}
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

// ─── Public Image Preview Modal ──────────────────────────────────────────────
function PublicImagePreviewModal({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const whatsappMessage = encodeURIComponent(`Hi MRIZO CORNER, I'm interested in ordering this product:\n\n${url}`);
  const whatsappUrl = `https://wa.me/919101547103?text=${whatsappMessage}`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>

      {/* Image Container */}
      <div
        className="relative max-w-full md:max-w-4xl max-h-[75vh] md:max-h-[80vh] rounded-[12px] overflow-hidden shadow-2xl flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Preview" className="block max-w-full max-h-[75vh] md:max-h-[80vh] w-auto h-auto object-contain" />
      </div>

      {/* WhatsApp Order Button */}
      <div 
        className="mt-6 md:mt-8 w-full max-w-[400px] flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold tracking-widest text-[13px] uppercase py-3.5 px-6 rounded-full shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}

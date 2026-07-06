"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase, getLookbookImageUrl } from "@/lib/supabase";
import { LookbookImage } from "@/lib/types";

// ─── Icons ────────────────────────────────────────────────────────────────────
function UploadIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  );
}
function EyeIcon({ off = false }: { off?: boolean }) {
  return off ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function DotsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
    </svg>
  );
}
function ImagesStatIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  );
}
function ChevronIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>;
}
function SortIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    "\n" +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

// ─── Upload Toast ─────────────────────────────────────────────────────────────
function UploadToast({ show }: { show: boolean }) {
  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <div className="bg-black text-white text-[12px] font-medium tracking-wide px-5 py-3 rounded-[10px] shadow-2xl flex items-center gap-3">
        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        Uploading image…
      </div>
    </div>
  );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 md:px-5 py-3 border-b border-gray-50 last:border-0">
      <div className="w-14 h-14 rounded-[8px] bg-gray-100 animate-pulse shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="h-3 w-40 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-2.5 w-24 bg-gray-50 rounded-full animate-pulse" />
        <div className="h-4 w-14 bg-gray-100 rounded-full animate-pulse" />
      </div>
      <div className="h-7 w-16 bg-gray-100 rounded-[6px] animate-pulse hidden md:block" />
    </div>
  );
}

// ─── Delete Menu ──────────────────────────────────────────────────────────────
function DeleteMenu({ onDelete }: { onDelete: () => void }) {
  return (
    <div
      className="absolute right-0 top-full mt-1 z-50 bg-white border border-gray-100 rounded-[12px] shadow-2xl w-44"
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.14)" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-2.5 border-b border-gray-50">
        <p className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Actions</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="w-full flex items-center gap-2.5 px-4 py-3.5 text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-[13px] font-medium rounded-b-[12px]"
      >
        <TrashIcon />
        Delete Image
      </button>
    </div>
  );
}

// ─── Image Preview Modal ─────────────────────────────────────────────────────
function ImagePreviewModal({ url, onClose }: { url: string; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
      </button>
      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] rounded-[12px] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="Preview" className="block max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain" />
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<LookbookImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [sortNewest, setSortNewest] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  async function fetchImages() {
    const { data } = await supabase
      .from("lookbook_images")
      .select("id, storage_path, alt_text, is_visible, display_order, file_size_bytes, created_at")
      .order("created_at", { ascending: false });
    setImages((data as LookbookImage[]) ?? []);
    setLoading(false);
  }
  useEffect(() => { fetchImages(); }, []);

  function closeAllMenus() {
    setOpenMenuId(null);
    setSortOpen(false);
    setAdminMenuOpen(false);
  }

  const sorted = [...images].sort((a, b) =>
    sortNewest
      ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const totalVisible = images.filter((i) => i.is_visible).length;
  const totalHidden = images.filter((i) => !i.is_visible).length;
  const totalBytes = images.reduce((acc, i) => acc + (i.file_size_bytes ?? 0), 0);
  const storageUsedPct = Math.min((totalBytes / (1 * 1024 * 1024 * 1024)) * 100, 100);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: storageErr } = await supabase.storage
      .from("lookbook")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });
    if (storageErr) {
      setUploadError(`Upload failed: ${storageErr.message}`);
      setUploading(false);
      return;
    }
    const { error: dbErr } = await supabase.from("lookbook_images").insert({
      storage_path: fileName,
      alt_text: file.name.replace(/\.\w+$/, ""),
      is_visible: true,
      display_order: images.length,
      file_size_bytes: file.size,
    });
    if (dbErr) setUploadError(`DB error: ${dbErr.message}`);
    else await fetchImages();
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function toggleVisibility(img: LookbookImage) {
    await supabase.from("lookbook_images").update({ is_visible: !img.is_visible }).eq("id", img.id);
    setImages((prev) => prev.map((i) => i.id === img.id ? { ...i, is_visible: !img.is_visible } : i));
  }

  async function deleteImage(img: LookbookImage) {
    setOpenMenuId(null);
    if (!confirm("Delete this image permanently?")) return;
    await supabase.storage.from("lookbook").remove([img.storage_path]);
    await supabase.from("lookbook_images").delete().eq("id", img.id);
    setImages((prev) => prev.filter((i) => i.id !== img.id));
  }

  async function handleLogout() {
    setAdminMenuOpen(false);
    await supabase.auth.signOut();
    router.push("/mrizo-studio-x7");
  }

  return (
    <div className="min-h-screen bg-[#f8f8f8]" onClick={closeAllMenus}>
      <UploadToast show={uploading} />
      {previewUrl && <ImagePreviewModal url={previewUrl} onClose={() => setPreviewUrl(null)} />}

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-8 h-14 flex items-center justify-between">
        <div className="relative w-[110px] h-8">
          <Image src="/mrizo_corner_logo.svg" alt="MRIZO CORNER" fill className="object-contain object-left" priority />
        </div>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setAdminMenuOpen((p) => !p)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-black text-white text-[12px] font-bold flex items-center justify-center select-none">A</div>
            <span className="hidden md:block text-[13px] font-medium">Admin</span>
            <span className="hidden md:block"><ChevronIcon /></span>
          </button>
          {adminMenuOpen && (
            <div className="absolute right-0 top-11 z-50 bg-white border border-gray-100 rounded-[10px] shadow-xl py-1.5 w-36 text-[13px]">
              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium rounded-[10px]">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6">
        {/* ── Title + Upload ── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-black leading-tight">Lookbook</h1>
            <p className="text-[13px] text-gray-400 mt-0.5">Manage your lookbook images.</p>
          </div>
          <label className={`flex items-center gap-2 bg-black text-white text-[12px] font-bold tracking-widest px-4 py-2.5 rounded-[8px] whitespace-nowrap transition-opacity cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : "hover:bg-black/80"}`}>
            <UploadIcon />
            Upload Images
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
        {uploadError && (
          <p className="text-red-500 text-[12px] bg-red-50 border border-red-100 rounded-[8px] px-3 py-2 -mt-3">{uploadError}</p>
        )}

        {/* ── Stats Card ── */}
        <div className="bg-white border border-gray-100 rounded-[12px] px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 md:border-r border-gray-100 md:pr-4">
            <ImagesStatIcon />
            <span className="text-[28px] font-bold leading-none mt-1">{images.length}</span>
            <span className="text-[12px] text-gray-400">Total Images</span>
          </div>
          <div className="flex flex-col gap-1 md:border-r border-gray-100 md:pr-4">
            <EyeIcon />
            <span className="text-[28px] font-bold leading-none mt-1">{totalVisible}</span>
            <span className="text-[12px] text-gray-400">Visible</span>
          </div>
          <div className="flex flex-col gap-1 md:border-r border-gray-100 md:pr-4">
            <EyeIcon off />
            <span className="text-[28px] font-bold leading-none mt-1">{totalHidden}</span>
            <span className="text-[12px] text-gray-400">Hidden</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[11px] text-gray-400 font-medium">Storage Used</span>
            <span className="text-[20px] font-bold leading-none">
              {formatBytes(totalBytes)} <span className="text-[12px] text-gray-400 font-normal">/ 1 GB</span>
            </span>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-black rounded-full transition-all duration-700" style={{ width: `${storageUsedPct.toFixed(1)}%` }} />
            </div>
            <span className="text-[10px] text-gray-400">{storageUsedPct.toFixed(1)}% used</span>
          </div>
        </div>

        {/* ── Images List ── */}
        {/* overflow-visible intentionally so dropdown menus aren't clipped */}
        <div className="bg-white border border-gray-100 rounded-[12px]">
          <div className="flex items-center justify-between px-4 md:px-5 py-4 border-b border-gray-100 rounded-t-[12px]">
            <span className="font-bold text-[15px]">All Images</span>
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSortOpen((p) => !p)}
                className="flex items-center gap-1.5 text-[12px] text-gray-500 border border-gray-200 rounded-[6px] px-3 py-1.5 hover:border-gray-400 transition-colors cursor-pointer select-none"
              >
                <SortIcon />
                {sortNewest ? "Newest First" : "Oldest First"}
                <ChevronIcon />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-10 z-50 bg-white border border-gray-100 rounded-[10px] shadow-xl py-1.5 w-36 text-[13px]">
                  <button onClick={() => { setSortNewest(true); setSortOpen(false); }} className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer ${sortNewest ? "font-semibold text-black" : "text-gray-600"}`}>
                    Newest First
                  </button>
                  <button onClick={() => { setSortNewest(false); setSortOpen(false); }} className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer ${!sortNewest ? "font-semibold text-black" : "text-gray-600"}`}>
                    Oldest First
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop table headers */}
          <div className="hidden md:grid grid-cols-[64px_1fr_160px_80px_100px_110px_80px] gap-3 px-5 py-2.5 border-b border-gray-50">
            {["IMAGE","FILE NAME","UPLOADED","SIZE","STATUS","VISIBILITY","ACTIONS"].map((h) => (
              <span key={h} className="text-[10px] font-semibold text-gray-400 tracking-wider">{h}</span>
            ))}
          </div>

          {loading ? (
            <div>{Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}</div>
          ) : sorted.length === 0 ? (
            <p className="text-center text-[13px] text-gray-300 py-16">No images yet. Upload some above.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {sorted.map((img) => (
                <ImageRow
                  key={img.id}
                  img={img}
                  menuOpen={openMenuId === img.id}
                  onMenuClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId((p) => (p === img.id ? null : img.id));
                  }}
                  onToggle={() => toggleVisibility(img)}
                  onDelete={() => deleteImage(img)}
                  onPreview={() => setPreviewUrl(getLookbookImageUrl(img.storage_path))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Image Row ────────────────────────────────────────────────────────────────
function ImageRow({ img, menuOpen, onMenuClick, onToggle, onDelete, onPreview }: {
  img: LookbookImage;
  menuOpen: boolean;
  onMenuClick: (e: React.MouseEvent) => void;
  onToggle: () => void;
  onDelete: () => void;
  onPreview: () => void;
}) {
  const displayName = img.alt_text ?? img.storage_path;

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-[64px_1fr_160px_80px_100px_110px_80px] gap-3 items-center px-5 py-3 hover:bg-gray-50/60 transition-colors">
        <div
          className="w-14 h-14 rounded-[6px] overflow-hidden bg-gray-100 relative shrink-0 cursor-zoom-in"
          onClick={(e) => { e.stopPropagation(); onPreview(); }}
        >
          <Image src={getLookbookImageUrl(img.storage_path)} alt={displayName} fill className="object-cover hover:scale-105 transition-transform duration-200" unoptimized />
        </div>
        <span className="text-[13px] font-medium text-black truncate">{displayName}</span>
        <span className="text-[11px] text-gray-400 whitespace-pre-line leading-snug">{formatDate(img.created_at)}</span>
        <span className="text-[12px] text-gray-500">{formatBytes(img.file_size_bytes)}</span>
        <span>
          <span className="text-[11px] font-semibold bg-[#d1fae5] text-[#065f46] px-2.5 py-1 rounded-full">Uploaded</span>
        </span>
        <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
          <EyeIcon off={!img.is_visible} />
          <span>{img.is_visible ? "Visible" : "Hidden"}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            title={img.is_visible ? "Hide" : "Show"}
            className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-[6px] transition-colors cursor-pointer"
          >
            <EyeIcon off={img.is_visible} />
          </button>
          <div className="relative">
            <button
              onClick={onMenuClick}
              className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-[6px] transition-colors cursor-pointer"
            >
              <DotsIcon />
            </button>
            {menuOpen && <DeleteMenu onDelete={onDelete} />}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3">
        <div
          className="w-16 h-16 rounded-[8px] overflow-hidden bg-gray-100 relative shrink-0 cursor-zoom-in"
          onClick={(e) => { e.stopPropagation(); onPreview(); }}
        >
          <Image src={getLookbookImageUrl(img.storage_path)} alt={displayName} fill className="object-cover hover:scale-105 transition-transform duration-200" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-black truncate">{displayName}</p>
          <p className="text-[11px] text-gray-400">
            {new Date(img.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {formatBytes(img.file_size_bytes)}
          </p>
          <span className={`inline-block mt-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${img.is_visible ? "bg-[#d1fae5] text-[#065f46]" : "bg-gray-100 text-gray-500"}`}>
            {img.is_visible ? "Visible" : "Hidden"}
          </span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="p-2 text-gray-400 hover:text-black cursor-pointer transition-colors">
            <EyeIcon off={img.is_visible} />
          </button>
          <div className="relative">
            <button onClick={onMenuClick} className="p-2 text-gray-400 hover:text-black cursor-pointer transition-colors">
              <DotsIcon />
            </button>
            {menuOpen && <DeleteMenu onDelete={onDelete} />}
          </div>
        </div>
      </div>
    </>
  );
}

export default function LookbookSkeleton() {
  // Varying heights to mimic Pinterest masonry feel
  const heights = [
    "h-48", "h-64", "h-56", "h-72", "h-44", "h-60",
    "h-52", "h-68", "h-48", "h-56", "h-64", "h-44",
  ];

  return (
    <>
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-full ${h} rounded-[8px] bg-gray-100 overflow-hidden relative break-inside-avoid mb-3`}
        >
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>
      ))}
    </>
  );
}

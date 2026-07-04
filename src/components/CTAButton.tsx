"use client";

import { useRouter } from "next/navigation";

export default function CTAButton() {
  const router = useRouter();

  return (
    <div className="w-full px-4 mb-8 flex justify-center">
      <button
        className="flex flex-col items-start bg-black text-left py-[11px] px-[78px] rounded-md border-0 cursor-pointer"
        style={{ boxShadow: "0px 4px 20px #0000001C" }}
        onClick={() => router.push("/lookbook")}
      >
        <span className="text-white text-xs">VIEW LOOKBOOK</span>
      </button>
    </div>
  );
}

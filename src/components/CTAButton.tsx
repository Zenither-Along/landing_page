"use client";

import { siteConfig } from "@/data/links";

export default function CTAButton() {
  return (
    <div className="w-full px-4 mb-8 flex justify-center">
      <button
        className="flex flex-col items-start bg-black text-left py-[11px] px-[78px] rounded-md border-0"
        style={{ boxShadow: "0px 4px 20px #0000001C" }}
        onClick={() => window.open(siteConfig.lookbookUrl, "_blank")}
      >
        <span className="text-white text-xs">VIEW LOOKBOOK</span>
      </button>
    </div>
  );
}

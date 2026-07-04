"use client";

import Image from "next/image";
import { siteConfig } from "@/data/links";

const CIRCLE_SIZE = 96; // px
const OVERLAP = 0.4;    // 40% of circle overlaps the hero image

export default function HeroSection() {
  const belowHero = CIRCLE_SIZE * (1 - OVERLAP); // 57.6px hangs below
  const contentPaddingTop = belowHero + 16;       // 16px gap after circle

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Banner + Logo Circle Container */}
      <div className="w-full relative" style={{ height: "220px" }}>
        {/* Banner — own overflow-hidden so it clips the image but NOT the circle */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/link_page_banner-image.svg"
            alt="MRIZO CORNER — Clothing for every corner of your life"
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Logo Circle — sits at bottom centre, translateY(60%) so 40% overlaps */}
        <div
          className="absolute left-1/2 bottom-0 z-10"
          style={{
            width: `${CIRCLE_SIZE}px`,
            height: `${CIRCLE_SIZE}px`,
            transform: `translateX(-50%) translateY(${(1 - OVERLAP) * 100}%)`,
          }}
        >
          <div className="w-full h-full rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center overflow-hidden p-2">
            <Image
              src="/primary_mrizo_logo.svg"
              alt="MRIZO CORNER Logo"
              width={70}
              height={70}
              priority
            />
          </div>
        </div>
      </div>

      {/* Brand Identity — padded to clear the hanging circle */}
      <div
        className="flex flex-col items-center px-6 text-center"
        style={{ paddingTop: `${contentPaddingTop}px` }}
      >
        {/* Tagline */}
        <span className="text-[#494949] text-[10px] text-center w-[118px]">
          {"Clothing for every corner of your life."}
        </span>
      </div>
    </div>
  );
}

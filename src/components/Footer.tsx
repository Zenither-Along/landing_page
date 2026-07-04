import { siteConfig } from "@/data/links";

export default function Footer() {
  return (
    <footer className="w-full text-center py-10 px-4 mt-8">
      <p className="text-xs text-gray-500 tracking-widest font-medium">
        © {siteConfig.brandName} {siteConfig.brandTagline} EST. {siteConfig.footerYear}
      </p>
      <p className="text-xs text-gray-400 tracking-wider mt-1">
        All rights reserved
      </p>
    </footer>
  );
}

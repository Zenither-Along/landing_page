import Link from "next/link";
import { LinkItem } from "@/data/links";
import {
  WhatsAppIcon,
  StoreIcon,
  GoogleIcon,
  InstagramIcon,
  EmailIcon,
  ArrowIcon,
} from "@/components/Icons";

const iconMap = {
  whatsapp: WhatsAppIcon,
  store: StoreIcon,
  google: GoogleIcon,
  instagram: InstagramIcon,
  email: EmailIcon,
};

interface LinkCardProps {
  item: LinkItem;
}

export default function LinkCard({ item }: LinkCardProps) {
  const IconComponent = iconMap[item.icon];

  return (
    <Link
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="
        flex items-center justify-between
        w-full
        border border-gray-200
        rounded-[6px]
        px-4 py-4
        group
        transition-all duration-200
        hover:bg-[#E0E0E0] hover:border-black
        active:scale-[0.98]
      "
    >
      {/* Left: Icon + Label */}
      <div className="flex items-center gap-4">
        <span className="text-black">
          <IconComponent />
        </span>
        <span className="text-black text-[12px] font-bold">
              {item.label}
            </span>
      </div>

      {/* Right: Arrow */}
      <span className="text-black">
        <ArrowIcon />
      </span>
    </Link>
  );
}

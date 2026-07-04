import { links } from "@/data/links";
import LinkCard from "@/components/LinkCard";

export default function LinksSection() {
  return (
    <div className="w-full px-4 flex flex-col gap-3">
      {links.map((item) => (
        <LinkCard key={item.id} item={item} />
      ))}
    </div>
  );
}

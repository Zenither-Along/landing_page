export interface LinkItem {
  id: string;
  label: string;
  href: string;
  icon: "whatsapp" | "store" | "google" | "instagram" | "email";
}

export const links: LinkItem[] = [
  {
    id: "whatsapp",
    label: "ORDER ON WHATSAPP",
    href: "https://wa.me/919101547103",
    icon: "whatsapp",
  },
  {
    id: "store",
    label: "VISIT OUR STORE",
    href: "https://maps.app.goo.gl/R4FgiDaJu1rFH3yEA",
    icon: "store",
  },
  {
    id: "google",
    label: "GIVE GOOGLE REVIEWS",
    href: "https://g.page/r/CQLrCJ0bH3AYEBM/review",
    icon: "google",
  },
  {
    id: "instagram",
    label: "INSTAGRAM",
    href: "https://www.instagram.com/mrizo_corner?igsh=bGR2cWF5OHZhMDUw",
    icon: "instagram",
  },
  {
    id: "email",
    label: "EMAIL",
    href: "mailto:mrizocorner@gmail.com",
    icon: "email",
  },
];

export const siteConfig = {
  brandName: "MRIZO",
  brandTagline: "CORNER",
  tagline: "Clothing for every corner\nof your life.",
  lookbookUrl: "https://mrizocorner.com/lookbook",
  footerYear: "2026",
};

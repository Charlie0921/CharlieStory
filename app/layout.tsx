import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kunjoong Charlie Kim · Developer Portfolio",
  description: "Kunjoong Charlie Kim — Penn State computer science student building practical software, business systems, and applied AI. Explore projects, experience, and technical notes.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

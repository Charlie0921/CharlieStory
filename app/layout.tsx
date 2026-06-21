import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kunjoong Charlie Kim · Developer Portfolio",
  description: "A recruiter-friendly developer portfolio inspired by a Korean Cyworld mini-homepage.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}

import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = new URL(`${protocol}://${host}`);
  const socialImage = new URL("/og.png", baseUrl).toString();

  return {
    metadataBase: baseUrl,
    title: "CueChaos — The movie is listening",
    description: "A zero-API improv party game with secret roles and Codex-crafted story packs.",
    openGraph: {
      title: "CueChaos — The movie is listening",
      description: "Your friends. One impossible scene. A zero-API party game built from Codex-crafted story packs.",
      type: "website",
      images: [{ url: socialImage, width: 1734, height: 907, alt: "CueChaos — The movie is listening" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "CueChaos — The movie is listening",
      description: "Your friends. One impossible scene. A zero-API party game built from Codex-crafted story packs.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}

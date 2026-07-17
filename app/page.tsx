import type { Metadata } from "next";
import { CueChaosGame } from "./CueChaosGame";

export const metadata: Metadata = {
  title: "CueChaos — The movie is listening",
  description: "A bilingual, zero-API improv party game with secret roles, timed scenes, and Codex-crafted story packs.",
};

export default function Home() {
  return <CueChaosGame />;
}

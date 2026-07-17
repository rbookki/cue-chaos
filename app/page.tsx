import type { Metadata } from "next";
import { CueChaosGame } from "./CueChaosGame";

export const metadata: Metadata = {
  title: "CueChaos — The movie is listening",
  description: "A zero-API improv party game with secret roles and story packs created directly in Codex.",
};

export default function Home() {
  return <CueChaosGame />;
}

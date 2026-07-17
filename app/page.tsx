import type { Metadata } from "next";
import { CueChaosGame } from "./CueChaosGame";

export const metadata: Metadata = {
  title: "CueChaos — Plot Saboteur",
  description: "A bilingual, zero-API social deduction game with secret roles, anonymous votes, and Codex-crafted chaos packs.",
};

export default function Home() {
  return <CueChaosGame />;
}

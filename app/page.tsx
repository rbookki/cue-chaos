import type { Metadata } from "next";
import { CueChaosGame } from "./CueChaosGame";

export const metadata: Metadata = {
  title: "CueChaos — Inside Saboteur",
  description: "A bilingual, zero-API social deduction game with connected cases, evidence trails, and consequential decisions.",
};

export default function Home() {
  return <CueChaosGame />;
}

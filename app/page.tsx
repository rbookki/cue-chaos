import type { Metadata } from "next";
import { CueChaosGame } from "./CueChaosGame";

export const metadata: Metadata = {
  title: "CueChaos — The movie is listening",
  description: "A live AI improv party game. Secret roles, impossible scenes, and plot twists directed by GPT-5.6.",
};

export default function Home() {
  return <CueChaosGame />;
}

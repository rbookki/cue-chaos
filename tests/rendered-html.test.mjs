import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);

async function loadWorker() {
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  return (await import(workerUrl.href)).default;
}

const env = {
  ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the CueChaos product experience", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), env, ctx);
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>CueChaos — The movie is listening<\/title>/i);
  assert.match(html, /Your friends/);
  assert.match(html, /START THE SHOW/);
  assert.match(html, /HOW TO PLAY/);
  assert.match(html, /GPT‑5\.6/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("offline story pack returns a complete, playable opening beat", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("http://localhost/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "start",
      theme: "office",
      players: ["Maya", "Leo", "Sam"],
      act: 0,
      history: [],
      locale: "en",
      sessionSeed: "test-opening",
    }),
  }), env, ctx);
  assert.equal(response.status, 200);
  const beat = await response.json();
  assert.equal(beat.source, "story-pack");
  assert.equal(beat.roles.length, 3);
  assert.equal(beat.choices.length, 3);
  assert.ok(beat.roles.every((role) => role.secretObjective));
});

test("Chinese space pack reacts to a player move without external inference", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("http://localhost/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "twist",
      theme: "space",
      players: ["小雨", "阿杰", "Sam"],
      act: 1,
      playerMove: "把月球登记成情绪支持宠物",
      history: ["把月球登记成情绪支持宠物"],
      locale: "zh",
      sessionSeed: "test-space",
    }),
  }), env, ctx);
  assert.equal(response.status, 200);
  const beat = await response.json();
  assert.equal(beat.source, "story-pack");
  assert.match(beat.directorLine, /把月球登记成情绪支持宠物/);
  assert.equal(beat.choices.length, 3);
  assert.ok(Number.isInteger(beat.variant));
});

test("runtime bundle contains no external OpenAI inference endpoint", async () => {
  const builtWorkerUrl = new URL("../dist/server/index.js", import.meta.url);
  const workerSource = await import("node:fs/promises").then(({ readFile }) => readFile(builtWorkerUrl, "utf8"));
  assert.doesNotMatch(workerSource, /api\.openai\.com|OPENAI_API_KEY/);
});

test("director rejects undersized casts", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("http://localhost/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "start", theme: "heist", players: ["One", "Two"], act: 0, history: [] }),
  }), env, ctx);
  assert.equal(response.status, 400);
});

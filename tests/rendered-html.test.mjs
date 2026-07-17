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
  assert.match(html, /<title>CueChaos — Plot Saboteur<\/title>/i);
  assert.match(html, /Trust the cast/);
  assert.match(html, /DEAL SECRET ROLES/);
  assert.match(html, /HOW TO PLAY/);
  assert.match(html, /GPT‑5\.6/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("offline pack returns a complete three-round deduction game", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("http://localhost/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      theme: "office",
      players: ["Maya", "Leo", "Sam"],
      locale: "en",
      sessionSeed: "test-opening",
    }),
  }), env, ctx);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-cuechaos-mode"), "offline-saboteur");
  const game = await response.json();
  assert.equal(game.source, "story-pack");
  assert.equal(game.cards.length, 3);
  assert.equal(game.rounds.length, 3);
  assert.ok(game.rounds.every((round) => round.choices.length === 3));
  const saboteurs = game.cards.filter((card) => card.team === "saboteur");
  assert.equal(saboteurs.length, 1);
  assert.equal(saboteurs[0].targets.length, 3);
  assert.ok(game.cards.filter((card) => card.team === "cast").every((card) => card.targets.length === 0));
});

test("Chinese space pack is deterministic and marks the riskiest target", async () => {
  const worker = await loadWorker();
  const requestBody = JSON.stringify({
    theme: "space",
    players: ["小雨", "阿杰", "Sam"],
    locale: "zh",
    sessionSeed: "test-space",
  });
  const firstResponse = await worker.fetch(new Request("http://localhost/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: requestBody,
  }), env, ctx);
  const secondResponse = await worker.fetch(new Request("http://localhost/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: requestBody,
  }), env, ctx);
  assert.equal(firstResponse.status, 200);
  assert.equal(secondResponse.status, 200);
  const firstGame = await firstResponse.json();
  const secondGame = await secondResponse.json();
  assert.deepEqual(firstGame, secondGame);
  assert.match(firstGame.rounds[0].headline, /时间线/);

  const saboteur = firstGame.cards.find((card) => card.team === "saboteur");
  assert.ok(saboteur);
  saboteur.targets.forEach((target, index) => {
    const round = firstGame.rounds[index];
    const markedChoice = round.choices.find((choice) => choice.id === target.choiceId);
    assert.equal(markedChoice.chaos, Math.max(...round.choices.map((choice) => choice.chaos)));
  });
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
    body: JSON.stringify({ theme: "heist", players: ["One", "Two"], locale: "en", sessionSeed: "too-small" }),
  }), env, ctx);
  assert.equal(response.status, 400);
});

test("director rejects duplicate player names", async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(new Request("http://localhost/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme: "heist", players: ["One", "one", "Three"], locale: "en", sessionSeed: "duplicates" }),
  }), env, ctx);
  assert.equal(response.status, 400);
});

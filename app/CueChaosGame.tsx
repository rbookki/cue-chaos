"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { THEMES, type DirectorBeat, type DirectorRequest, type ThemeId } from "./game-types";

type Screen = "lobby" | "roles" | "playing" | "finale";

const INITIAL_PLAYERS = ["Maya", "Leo", "Sam"];

async function requestDirector(input: DirectorRequest) {
  const response = await fetch("/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = await response.json() as DirectorBeat & { error?: string };
  if (!response.ok) throw new Error(payload.error || "The director missed their cue.");
  return payload;
}

function Wordmark() {
  return (
    <a className="wordmark" href="#top" aria-label="CueChaos home">
      <span className="wordmark__cue">CUE</span>
      <span className="wordmark__chaos">CHAOS</span>
      <i>LIVE</i>
    </a>
  );
}

function Lobby({
  theme,
  setTheme,
  players,
  setPlayers,
  onStart,
  loading,
  error,
}: {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  players: string[];
  setPlayers: (players: string[]) => void;
  onStart: () => void;
  loading: boolean;
  error: string;
}) {
  const canStart = players.length >= 3 && players.every((player) => player.trim().length > 0);

  function updatePlayer(index: number, value: string) {
    setPlayers(players.map((player, playerIndex) => playerIndex === index ? value.slice(0, 24) : player));
  }

  return (
    <main className="lobby" id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__signal"><span /> THE MOVIE IS LISTENING <span /></div>
        <h1 id="hero-title">Your friends.<br /><em>One impossible scene.</em></h1>
        <p>CueChaos turns any room into a Codex-crafted comedy. Secret roles. Bad decisions. A story pack that folds your choices back into the scene.</p>
        <div className="hero__proof">
          <span><b>3–6</b> players</span>
          <span><b>10</b> minutes</span>
          <span><b>∞</b> bad ideas</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="setup-card__topline">
          <div><span className="kicker">NOW CASTING</span><h2 id="setup-title">Choose tonight’s disaster</h2></div>
          <span className="take-pill">TAKE 001</span>
        </div>

        <div className="theme-grid" role="radiogroup" aria-label="Story world">
          {(Object.keys(THEMES) as ThemeId[]).map((id, index) => {
            const item = THEMES[id];
            return (
              <button
                key={id}
                className={`theme-card theme-card--${id} ${theme === id ? "is-selected" : ""}`}
                onClick={() => setTheme(id)}
                role="radio"
                aria-checked={theme === id}
              >
                <span className="theme-card__number">0{index + 1}</span>
                <span className="theme-card__art" aria-hidden="true"><i /><b>{id === "heist" ? "◇" : id === "office" ? "↗" : "♡"}</b></span>
                <span className="theme-card__eyebrow">{item.eyebrow}</span>
                <strong>{item.title}</strong>
                <small>{item.logline}</small>
                <span className="theme-card__select">{theme === id ? "SELECTED" : "SELECT"} <i>→</i></span>
              </button>
            );
          })}
        </div>

        <div className="cast-builder">
          <div className="cast-builder__heading">
            <div><span className="kicker">YOUR CAST</span><h3>Who’s brave enough?</h3></div>
            <span>{players.length} / 6 PLAYERS</span>
          </div>
          <div className="player-list">
            {players.map((player, index) => (
              <label className="player-field" key={index}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <input
                  aria-label={`Player ${index + 1} name`}
                  value={player}
                  onChange={(event) => updatePlayer(index, event.target.value)}
                  placeholder={`Player ${index + 1}`}
                />
                {players.length > 3 && <button type="button" onClick={() => setPlayers(players.filter((_, playerIndex) => playerIndex !== index))} aria-label={`Remove ${player || `player ${index + 1}`}`}>×</button>}
              </label>
            ))}
            {players.length < 6 && (
              <button className="add-player" onClick={() => setPlayers([...players, ""])}><span>＋</span> Add player</button>
            )}
          </div>
        </div>

        {error && <p className="error-banner" role="alert">{error}</p>}
        <button className="start-button" onClick={onStart} disabled={!canStart || loading}>
          <span>{loading ? "LOADING TONIGHT’S STORY PACK…" : "START THE SHOW"}</span>
          <i>{loading ? "···" : "→"}</i>
        </button>
        <p className="setup-note"><span>✦</span> Story packs created with GPT‑5.6 in Codex · Zero API calls while playing</p>
      </section>

      <section className="how-it-works" aria-label="How CueChaos works">
        <span className="kicker">THE FORMAT</span>
        <div className="steps">
          <article><b>01</b><h3>Reveal</h3><p>Pass the phone. Every player gets a role and a secret objective.</p></article>
          <article><b>02</b><h3>Perform</h3><p>Pick a move or improvise your own. Commit to the bit.</p></article>
          <article><b>03</b><h3>React</h3><p>Your choice becomes the next scene’s running joke—without calling an API.</p></article>
        </div>
      </section>
    </main>
  );
}

function RoleReveal({
  beat,
  index,
  revealed,
  onReveal,
  onNext,
}: {
  beat: DirectorBeat;
  index: number;
  revealed: boolean;
  onReveal: () => void;
  onNext: () => void;
}) {
  const role = beat.roles[index];
  if (!role) return null;
  return (
    <main className="role-screen">
      <div className="role-progress"><span>SECRET CASTING</span><div>{beat.roles.map((_, roleIndex) => <i key={roleIndex} className={roleIndex <= index ? "is-filled" : ""} />)}</div><small>{index + 1} / {beat.roles.length}</small></div>
      <section className={`role-envelope ${revealed ? "is-revealed" : ""}`}>
        <div className="role-envelope__stamp">PRIVATE<br />ROLE</div>
        {!revealed ? (
          <div className="role-envelope__closed">
            <span className="eyebrow">PASS THE PHONE TO</span>
            <h1>{role.player}</h1>
            <p>Make sure nobody is peeking. Your objective is yours alone.</p>
            <button onClick={onReveal}>HOLD TO REVEAL <i>◎</i></button>
          </div>
        ) : (
          <div className="role-envelope__open">
            <span className="eyebrow">YOU ARE</span>
            <h1>{role.publicRole}</h1>
            <div className="secret-mission"><span>YOUR SECRET OBJECTIVE</span><p>{role.secretObjective}</p></div>
            <button onClick={onNext}>{index === beat.roles.length - 1 ? "ENTER THE SCENE" : "HIDE & PASS LEFT"} <i>→</i></button>
          </div>
        )}
      </section>
      <p className="privacy-note">This screen is meant for {role.player} only.</p>
    </main>
  );
}

function Stage({
  beat,
  act,
  theme,
  players,
  loading,
  error,
  onMove,
}: {
  beat: DirectorBeat;
  act: number;
  theme: ThemeId;
  players: string[];
  loading: boolean;
  error: string;
  onMove: (move: string) => void;
}) {
  const [customMove, setCustomMove] = useState("");
  const activePlayer = players[act % players.length];

  function submitCustom(event: FormEvent) {
    event.preventDefault();
    if (customMove.trim()) onMove(customMove.trim());
  }

  return (
    <main className="stage-screen">
      <header className="stage-header">
        <div><span className="live-dot" /> LIVE STORY</div>
        <div className="act-track" aria-label={`Act ${act + 1} of 3`}>{[0, 1, 2].map((step) => <span key={step} className={step <= act ? "is-active" : ""}><i /> ACT {step + 1}</span>)}</div>
        <span className="model-pill">OFFLINE STORY PACK</span>
      </header>

      <section className="scene-layout">
        <div className="scene-copy">
          <span className="scene-kicker">SCENE {String(act + 1).padStart(2, "0")} · {THEMES[theme].eyebrow}</span>
          <h1>{beat.headline.replace(/^ACT [IVX]+ — /, "")}</h1>
          <p className="director-line">“{beat.directorLine}”</p>
          <div className="twist-card"><span>PLOT TWIST</span><p>{beat.twist}</p><i>!</i></div>
          <div className="mission-strip"><span>NEXT MISSION</span><strong>{beat.mission}</strong></div>
        </div>

        <aside className="control-deck">
          <div className="turn-card"><span>ON THE SPOT</span><strong>{activePlayer}</strong><p>Choose what happens next—or improvise something worse.</p></div>
          <div className="choice-list">
            {beat.choices.map((choice, index) => (
              <button key={choice} onClick={() => onMove(choice)} disabled={loading}>
                <span>{String.fromCharCode(65 + index)}</span><strong>{choice}</strong><i>→</i>
              </button>
            ))}
          </div>
          <form className="custom-move" onSubmit={submitCustom}>
            <label htmlFor="custom-move">OR IMPROVISE</label>
            <div><input id="custom-move" value={customMove} onChange={(event) => setCustomMove(event.target.value.slice(0, 120))} placeholder="Say what your character does…" disabled={loading} /><button disabled={!customMove.trim() || loading}>GO</button></div>
          </form>
          {loading && <div className="director-thinking"><span /><p><b>CUTTING TO THE NEXT SCENE</b>Turning your choice into a callback…</p></div>}
          {error && <p className="error-banner" role="alert">{error}</p>}
        </aside>
      </section>

      <footer className="stage-footer">
        <div><span>CHAOS LEVEL</span><div className="heat-meter"><i style={{ width: `${beat.heat}%` }} /></div><strong>{beat.heat}%</strong></div>
        <p>Cast: {players.join(" · ")}</p>
      </footer>
    </main>
  );
}

function Finale({ beat, theme, onReplay }: { beat: DirectorBeat; theme: ThemeId; onReplay: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copyRecap() {
    await navigator.clipboard.writeText(`${THEMES[theme].title} — ${beat.finale}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="finale-screen">
      <div className="finale-burst" aria-hidden="true">✦</div>
      <section className="finale-hero">
        <span className="kicker">THAT’S A WRAP</span>
        <p className="finale-label">A CUECHAOS ORIGINAL</p>
        <h1>{THEMES[theme].title}</h1>
        <p className="finale-copy">{beat.finale}</p>
        <div className="credits-line"><span>STORY PACK BY GPT‑5.6 IN CODEX</span><i>◆</i><span>WRITTEN BY BAD DECISIONS</span></div>
      </section>

      <section className="awards-section">
        <div className="awards-heading"><span>TONIGHT’S AWARDS</span><p>The director noticed everything.</p></div>
        <div className="awards-grid">
          {beat.awards.map((award, index) => (
            <article key={`${award.player}-${award.title}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <small>{award.player}</small>
              <h2>{award.title}</h2>
              <p>{award.reason}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="finale-actions">
        <button className="button-outline" onClick={copyRecap}>{copied ? "COPIED!" : "COPY THE RECAP"}</button>
        <button className="button-solid" onClick={onReplay}>PLAY ANOTHER DISASTER <span>→</span></button>
      </div>
    </main>
  );
}

export function CueChaosGame() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [theme, setTheme] = useState<ThemeId>("office");
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [beat, setBeat] = useState<DirectorBeat | null>(null);
  const [act, setAct] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleRevealed, setRoleRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const style = useMemo(() => ({ "--accent": THEMES[theme].accent }) as CSSProperties, [theme]);

  async function startGame() {
    setLoading(true);
    setError("");
    try {
      const nextBeat = await requestDirector({ action: "start", theme, players: players.map((player) => player.trim()), act: 0, history: [] });
      setBeat(nextBeat);
      setAct(0);
      setHistory([]);
      setRoleIndex(0);
      setRoleRevealed(false);
      setScreen("roles");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The director missed their cue.");
    } finally {
      setLoading(false);
    }
  }

  function nextRole() {
    if (!beat) return;
    if (roleIndex >= beat.roles.length - 1) {
      setScreen("playing");
      return;
    }
    setRoleIndex((index) => index + 1);
    setRoleRevealed(false);
  }

  async function playMove(move: string) {
    if (!beat || loading) return;
    const nextHistory = [...history, move];
    setLoading(true);
    setError("");
    try {
      if (act >= 2) {
        const finale = await requestDirector({ action: "finale", theme, players, act, playerMove: move, history: nextHistory });
        setHistory(nextHistory);
        setBeat(finale);
        setScreen("finale");
      } else {
        const nextAct = act + 1;
        const nextBeat = await requestDirector({ action: "twist", theme, players, act: nextAct, playerMove: move, history: nextHistory });
        setHistory(nextHistory);
        setAct(nextAct);
        setBeat(nextBeat);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The director missed their cue.");
    } finally {
      setLoading(false);
    }
  }

  function replay() {
    setScreen("lobby");
    setBeat(null);
    setAct(0);
    setHistory([]);
    setError("");
  }

  return (
    <div className={`app-shell app-shell--${screen}`} style={style}>
      <div className="grain" aria-hidden="true" />
      <header className="site-header"><Wordmark /><span className="site-header__tag">AI IMPROV PARTY GAME</span><a href={screen === "lobby" ? "#top" : "#"} onClick={screen === "lobby" ? undefined : replay}>{screen === "lobby" ? "HOW TO PLAY ↓" : "EXIT GAME ×"}</a></header>
      {screen === "lobby" && <Lobby theme={theme} setTheme={setTheme} players={players} setPlayers={setPlayers} onStart={startGame} loading={loading} error={error} />}
      {screen === "roles" && beat && <RoleReveal beat={beat} index={roleIndex} revealed={roleRevealed} onReveal={() => setRoleRevealed(true)} onNext={nextRole} />}
      {screen === "playing" && beat && <Stage beat={beat} act={act} theme={theme} players={players} loading={loading} error={error} onMove={playMove} />}
      {screen === "finale" && beat && <Finale beat={beat} theme={theme} onReplay={replay} />}
    </div>
  );
}

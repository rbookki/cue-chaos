"use client";

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  THEMES,
  type DirectorBeat,
  type DirectorRequest,
  type Locale,
  type ThemeId,
} from "./game-types";

type Screen = "lobby" | "roles" | "playing" | "finale";

const INITIAL_PLAYERS = ["Maya", "Leo", "Sam"];

const TEXT = {
  zh: {
    siteTag: "零 API 即兴聚会游戏",
    howTo: "怎么玩？",
    exit: "退出游戏 ×",
    signal: "电影正在听你们说话",
    heroLine1: "你的朋友。",
    heroLine2: "一场不可能的戏。",
    heroBody: "CueChaos 把任何房间变成一部由 Codex 编排的喜剧。秘密身份、糟糕决定，以及会把你的选择变成回旋镖的剧情包。",
    players: "玩家",
    minutes: "分钟",
    badIdeas: "馊主意",
    casting: "今晚选片",
    chooseDisaster: "选择今晚的灾难",
    take: "第 001 镜",
    selected: "已选择",
    select: "选择",
    yourCast: "演员名单",
    braveEnough: "谁敢加入？",
    addPlayer: "添加玩家",
    start: "开始演出",
    loadingPack: "正在装载今晚的剧情包…",
    offlineNote: "剧情包由 GPT‑5.6 在 Codex 中创作 · 游玩时零 API 调用",
    format: "游戏流程",
    steps: [
      ["揭晓", "依次传手机。每位玩家获得角色和只有自己知道的秘密任务。"],
      ["表演", "每幕先即兴演一分钟，再由当轮玩家选择下一步或输入自己的骚操作。"],
      ["回调", "你的选择会成为下一幕的笑点和麻烦，全程不调用外部 API。"],
    ],
    rulesTitle: "60 秒学会 CueChaos",
    rulesIntro: "它不是单纯点按钮，而是一场需要大家开口表演的传手机游戏。",
    rules: [
      ["不要偷看", "每个人只看自己的角色和秘密任务，看完立即把手机传下去。"],
      ["先演后选", "读出场景，所有人即兴演 60 秒。当轮玩家最后决定剧情走向。"],
      ["秘密完成任务", "不要直接说出任务；想办法在对话中悄悄完成。"],
      ["认真胡说八道", "没有演技要求。接住别人的梗，比合理更重要。"],
    ],
    close: "明白了，开始选片",
    secretCasting: "秘密选角",
    passTo: "把手机交给",
    privacyBody: "确认没有人偷看。你的任务只属于你。",
    reveal: "点击揭晓身份",
    youAre: "你的角色",
    secretObjective: "秘密任务",
    enterScene: "进入第一幕",
    hidePass: "隐藏并传给左边",
    privateOnly: "本页仅供 {name} 查看。",
    liveStory: "现场故事",
    offlinePack: "离线剧情包",
    scene: "场景",
    plotTwist: "剧情反转",
    nextMission: "本幕任务",
    onSpot: "本轮主角",
    turnBody: "大家先表演，再由你决定下一幕发生什么。",
    performFirst: "先大声表演场景，计时结束后再选择。",
    timer: "表演计时",
    pause: "暂停",
    resume: "继续",
    reset: "重置",
    cut: "导演喊卡！现在做决定。",
    improvise: "或者自己发挥",
    movePlaceholder: "输入你的角色做了什么…",
    go: "出发",
    cutting: "正在切换下一幕",
    callback: "把你的选择变成下一幕回调…",
    chaos: "混乱指数",
    cast: "演员",
    wrap: "正式杀青",
    original: "一部 CUECHAOS 原创电影",
    credits1: "剧情包由 GPT‑5.6 在 Codex 中创作",
    credits2: "剧本由糟糕决定共同完成",
    recap: "今晚的三幕回顾",
    recapBody: "每一个决定都留下了证据。",
    act: "第 {n} 幕",
    awards: "今晚颁奖礼",
    awardsBody: "导演什么都看见了。",
    copy: "复制电影回顾",
    copied: "已复制！",
    replay: "再玩一场灾难",
    error: "导演错过了提示，请再试一次。",
  },
  en: {
    siteTag: "ZERO-API IMPROV PARTY GAME",
    howTo: "HOW TO PLAY?",
    exit: "EXIT GAME ×",
    signal: "THE MOVIE IS LISTENING",
    heroLine1: "Your friends.",
    heroLine2: "One impossible scene.",
    heroBody: "CueChaos turns any room into a Codex-crafted comedy. Secret roles. Bad decisions. A story pack that folds your choices back into the scene.",
    players: "players",
    minutes: "minutes",
    badIdeas: "bad ideas",
    casting: "NOW CASTING",
    chooseDisaster: "Choose tonight’s disaster",
    take: "TAKE 001",
    selected: "SELECTED",
    select: "SELECT",
    yourCast: "YOUR CAST",
    braveEnough: "Who’s brave enough?",
    addPlayer: "Add player",
    start: "START THE SHOW",
    loadingPack: "LOADING TONIGHT’S STORY PACK…",
    offlineNote: "Story packs created with GPT‑5.6 in Codex · Zero API calls while playing",
    format: "THE FORMAT",
    steps: [
      ["Reveal", "Pass the phone. Every player gets a role and a private objective."],
      ["Perform", "Improvise for a minute, then the spotlight player chooses what happens next."],
      ["Callback", "Your choice becomes the next scene’s running joke—without calling an external API."],
    ],
    rulesTitle: "Learn CueChaos in 60 seconds",
    rulesIntro: "This is not just a button-clicking game. It is a pass-the-phone game where everyone performs out loud.",
    rules: [
      ["No peeking", "Only look at your own role and secret objective, then pass the phone."],
      ["Perform before choosing", "Read the scene and improvise together for 60 seconds. The spotlight player decides at the end."],
      ["Stay secret", "Never announce your objective. Complete it naturally inside the scene."],
      ["Commit to the bit", "No acting skill required. Supporting someone else’s joke matters more than logic."],
    ],
    close: "GOT IT — START CASTING",
    secretCasting: "SECRET CASTING",
    passTo: "PASS THE PHONE TO",
    privacyBody: "Make sure nobody is peeking. Your objective is yours alone.",
    reveal: "TAP TO REVEAL",
    youAre: "YOU ARE",
    secretObjective: "YOUR SECRET OBJECTIVE",
    enterScene: "ENTER THE FIRST SCENE",
    hidePass: "HIDE & PASS LEFT",
    privateOnly: "This screen is meant for {name} only.",
    liveStory: "LIVE STORY",
    offlinePack: "OFFLINE STORY PACK",
    scene: "SCENE",
    plotTwist: "PLOT TWIST",
    nextMission: "SCENE MISSION",
    onSpot: "IN THE SPOTLIGHT",
    turnBody: "Perform together first. Then you decide what happens next.",
    performFirst: "Play the scene out loud. Choose after the timer ends.",
    timer: "SCENE TIMER",
    pause: "PAUSE",
    resume: "RESUME",
    reset: "RESET",
    cut: "CUT! Time to make the decision.",
    improvise: "OR IMPROVISE",
    movePlaceholder: "Say what your character does…",
    go: "GO",
    cutting: "CUTTING TO THE NEXT SCENE",
    callback: "Turning your choice into a callback…",
    chaos: "CHAOS LEVEL",
    cast: "Cast",
    wrap: "THAT’S A WRAP",
    original: "A CUECHAOS ORIGINAL",
    credits1: "STORY PACK BY GPT‑5.6 IN CODEX",
    credits2: "WRITTEN BY BAD DECISIONS",
    recap: "TONIGHT’S THREE-ACT RECAP",
    recapBody: "Every decision left evidence.",
    act: "ACT {n}",
    awards: "TONIGHT’S AWARDS",
    awardsBody: "The director noticed everything.",
    copy: "COPY THE MOVIE RECAP",
    copied: "COPIED!",
    replay: "PLAY ANOTHER DISASTER",
    error: "The director missed their cue. Please try again.",
  },
} as const;

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
      <i>PLAY</i>
    </a>
  );
}

function RulesModal({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const text = TEXT[locale];
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="rules-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="rules-modal" role="dialog" aria-modal="true" aria-labelledby="rules-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="rules-modal__x" onClick={onClose} aria-label={locale === "zh" ? "关闭玩法说明" : "Close instructions"}>×</button>
        <span className="kicker">{locale === "zh" ? "开演之前" : "BEFORE THE SHOW"}</span>
        <h2 id="rules-title">{text.rulesTitle}</h2>
        <p className="rules-modal__intro">{text.rulesIntro}</p>
        <div className="rules-list">
          {text.rules.map(([title, body], index) => (
            <article key={title}>
              <span>0{index + 1}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </article>
          ))}
        </div>
        <button className="rules-modal__close" onClick={onClose}>{text.close} <span>→</span></button>
      </section>
    </div>
  );
}

function Lobby({
  locale,
  theme,
  setTheme,
  players,
  setPlayers,
  onStart,
  loading,
  error,
}: {
  locale: Locale;
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  players: string[];
  setPlayers: (players: string[]) => void;
  onStart: () => void;
  loading: boolean;
  error: string;
}) {
  const text = TEXT[locale];
  const canStart = players.length >= 3 && players.every((player) => player.trim().length > 0);

  function updatePlayer(index: number, value: string) {
    setPlayers(players.map((player, playerIndex) => playerIndex === index ? value.slice(0, 24) : player));
  }

  return (
    <main className="lobby" id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__signal"><span /> {text.signal} <span /></div>
        <h1 id="hero-title">{text.heroLine1}<br /><em>{text.heroLine2}</em></h1>
        <p>{text.heroBody}</p>
        <div className="hero__proof">
          <span><b>3–6</b> {text.players}</span>
          <span><b>10</b> {text.minutes}</span>
          <span><b>∞</b> {text.badIdeas}</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="setup-card__topline">
          <div><span className="kicker">{text.casting}</span><h2 id="setup-title">{text.chooseDisaster}</h2></div>
          <span className="take-pill">{text.take}</span>
        </div>

        <div className="theme-grid" role="radiogroup" aria-label={locale === "zh" ? "选择故事世界" : "Story world"}>
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
                <span className="theme-card__art" aria-hidden="true"><i /><b>{item.symbol}</b></span>
                <span className="theme-card__eyebrow">{item.eyebrow[locale]}</span>
                <strong>{item.title[locale]}</strong>
                <small>{item.logline[locale]}</small>
                <span className="theme-card__select">{theme === id ? text.selected : text.select} <i>→</i></span>
              </button>
            );
          })}
        </div>

        <div className="cast-builder">
          <div className="cast-builder__heading">
            <div><span className="kicker">{text.yourCast}</span><h3>{text.braveEnough}</h3></div>
            <span>{players.length} / 6 {text.players.toUpperCase()}</span>
          </div>
          <div className="player-list">
            {players.map((player, index) => (
              <label className="player-field" key={index}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <input
                  aria-label={locale === "zh" ? `玩家 ${index + 1} 名字` : `Player ${index + 1} name`}
                  value={player}
                  onChange={(event) => updatePlayer(index, event.target.value)}
                  placeholder={locale === "zh" ? `玩家 ${index + 1}` : `Player ${index + 1}`}
                />
                {players.length > 3 && <button type="button" onClick={() => setPlayers(players.filter((_, playerIndex) => playerIndex !== index))} aria-label={locale === "zh" ? `移除 ${player || `玩家 ${index + 1}`}` : `Remove ${player || `player ${index + 1}`}`}>×</button>}
              </label>
            ))}
            {players.length < 6 && (
              <button className="add-player" onClick={() => setPlayers([...players, ""])}><span>＋</span> {text.addPlayer}</button>
            )}
          </div>
        </div>

        {error && <p className="error-banner" role="alert">{error}</p>}
        <button className="start-button" onClick={onStart} disabled={!canStart || loading}>
          <span>{loading ? text.loadingPack : text.start}</span>
          <i>{loading ? "···" : "→"}</i>
        </button>
        <p className="setup-note"><span>✦</span> {text.offlineNote}</p>
      </section>

      <section className="how-it-works" aria-label={text.format}>
        <span className="kicker">{text.format}</span>
        <div className="steps">
          {text.steps.map(([title, body], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{body}</p></article>)}
        </div>
      </section>
    </main>
  );
}

function RoleReveal({
  locale,
  beat,
  index,
  revealed,
  onReveal,
  onNext,
}: {
  locale: Locale;
  beat: DirectorBeat;
  index: number;
  revealed: boolean;
  onReveal: () => void;
  onNext: () => void;
}) {
  const text = TEXT[locale];
  const role = beat.roles[index];
  if (!role) return null;
  return (
    <main className="role-screen">
      <div className="role-progress"><span>{text.secretCasting}</span><div>{beat.roles.map((_, roleIndex) => <i key={roleIndex} className={roleIndex <= index ? "is-filled" : ""} />)}</div><small>{index + 1} / {beat.roles.length}</small></div>
      <section className={`role-envelope ${revealed ? "is-revealed" : ""}`}>
        <div className="role-envelope__stamp">PRIVATE<br />ROLE</div>
        {!revealed ? (
          <div className="role-envelope__closed">
            <span className="eyebrow">{text.passTo}</span>
            <h1>{role.player}</h1>
            <p>{text.privacyBody}</p>
            <button onClick={onReveal}>{text.reveal} <i>◎</i></button>
          </div>
        ) : (
          <div className="role-envelope__open">
            <span className="eyebrow">{text.youAre}</span>
            <h1>{role.publicRole}</h1>
            <div className="secret-mission"><span>{text.secretObjective}</span><p>{role.secretObjective}</p></div>
            <button onClick={onNext}>{index === beat.roles.length - 1 ? text.enterScene : text.hidePass} <i>→</i></button>
          </div>
        )}
      </section>
      <p className="privacy-note">{text.privateOnly.replace("{name}", role.player)}</p>
    </main>
  );
}

function Stage({
  locale,
  beat,
  act,
  theme,
  players,
  loading,
  error,
  onMove,
}: {
  locale: Locale;
  beat: DirectorBeat;
  act: number;
  theme: ThemeId;
  players: string[];
  loading: boolean;
  error: string;
  onMove: (move: string) => void;
}) {
  const text = TEXT[locale];
  const [customMove, setCustomMove] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [paused, setPaused] = useState(false);
  const activePlayer = players[act % players.length];

  useEffect(() => {
    if (paused || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [paused, secondsLeft]);

  function submitCustom(event: FormEvent) {
    event.preventDefault();
    if (customMove.trim()) onMove(customMove.trim());
  }

  const timerText = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  return (
    <main className="stage-screen">
      <header className="stage-header">
        <div><span className="live-dot" /> {text.liveStory}</div>
        <div className="act-track" aria-label={locale === "zh" ? `三幕中的第 ${act + 1} 幕` : `Act ${act + 1} of 3`}>{[0, 1, 2].map((step) => <span key={step} className={step <= act ? "is-active" : ""}><i /> {text.act.replace("{n}", String(step + 1))}</span>)}</div>
        <span className="model-pill">{text.offlinePack}</span>
      </header>

      <section className="scene-layout">
        <div className="scene-copy">
          <span className="scene-kicker">{text.scene} {String(act + 1).padStart(2, "0")} · {THEMES[theme].eyebrow[locale]}</span>
          <h1>{beat.headline}</h1>
          <p className="director-line">“{beat.directorLine}”</p>
          <div className="twist-card"><span>{text.plotTwist}</span><p>{beat.twist}</p><i>!</i></div>
          <div className="mission-strip"><span>{text.nextMission}</span><strong>{beat.mission}</strong></div>
        </div>

        <aside className="control-deck">
          <div className={`scene-timer ${secondsLeft === 0 ? "is-finished" : ""}`}>
            <div><span>{text.timer}</span><strong>{timerText}</strong></div>
            <div>
              <button onClick={() => setPaused((value) => !value)}>{paused ? text.resume : text.pause}</button>
              <button onClick={() => { setSecondsLeft(60); setPaused(false); }}>{text.reset}</button>
            </div>
          </div>
          <p className="perform-cue">{secondsLeft === 0 ? text.cut : text.performFirst}</p>
          <div className="turn-card"><span>{text.onSpot}</span><strong>{activePlayer}</strong><p>{text.turnBody}</p></div>
          <div className="choice-list">
            {beat.choices.map((choice, index) => (
              <button key={choice} onClick={() => onMove(choice)} disabled={loading}>
                <span>{String.fromCharCode(65 + index)}</span><strong>{choice}</strong><i>→</i>
              </button>
            ))}
          </div>
          <form className="custom-move" onSubmit={submitCustom}>
            <label htmlFor="custom-move">{text.improvise}</label>
            <div><input id="custom-move" value={customMove} onChange={(event) => setCustomMove(event.target.value.slice(0, 120))} placeholder={text.movePlaceholder} disabled={loading} /><button disabled={!customMove.trim() || loading}>{text.go}</button></div>
          </form>
          {loading && <div className="director-thinking"><span /><p><b>{text.cutting}</b>{text.callback}</p></div>}
          {error && <p className="error-banner" role="alert">{error}</p>}
        </aside>
      </section>

      <footer className="stage-footer">
        <div><span>{text.chaos}</span><div className="heat-meter"><i style={{ width: `${beat.heat}%` }} /></div><strong>{beat.heat}%</strong></div>
        <p>{text.cast}: {players.join(" · ")}</p>
      </footer>
    </main>
  );
}

function Finale({
  locale,
  beat,
  theme,
  players,
  history,
  onReplay,
}: {
  locale: Locale;
  beat: DirectorBeat;
  theme: ThemeId;
  players: string[];
  history: string[];
  onReplay: () => void;
}) {
  const text = TEXT[locale];
  const [copied, setCopied] = useState(false);

  async function copyRecap() {
    const moves = history.map((move, index) => `${text.act.replace("{n}", String(index + 1))} · ${players[index % players.length]}: ${move}`).join("\n");
    await navigator.clipboard.writeText(`${THEMES[theme].title[locale]}\n${moves}\n\n${beat.finale}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="finale-screen">
      <div className="finale-burst" aria-hidden="true">✦</div>
      <section className="finale-hero">
        <span className="kicker">{text.wrap}</span>
        <p className="finale-label">{text.original}</p>
        <h1>{THEMES[theme].title[locale]}</h1>
        <p className="finale-copy">{beat.finale}</p>
        <div className="credits-line"><span>{text.credits1}</span><i>◆</i><span>{text.credits2}</span></div>
      </section>

      <section className="recap-section">
        <div className="awards-heading"><span>{text.recap}</span><p>{text.recapBody}</p></div>
        <div className="recap-grid">
          {history.map((move, index) => (
            <article key={`${move}-${index}`}>
              <span>{text.act.replace("{n}", String(index + 1))}</span>
              <strong>{players[index % players.length]}</strong>
              <p>{move}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="awards-section">
        <div className="awards-heading"><span>{text.awards}</span><p>{text.awardsBody}</p></div>
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
        <button className="button-outline" onClick={copyRecap}>{copied ? text.copied : text.copy}</button>
        <button className="button-solid" onClick={onReplay}>{text.replay} <span>→</span></button>
      </div>
    </main>
  );
}

export function CueChaosGame() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [locale, setLocale] = useState<Locale>("zh");
  const [rulesOpen, setRulesOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("office");
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [beat, setBeat] = useState<DirectorBeat | null>(null);
  const [act, setAct] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [sessionSeed, setSessionSeed] = useState("judge-demo");
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleRevealed, setRoleRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const style = useMemo(() => ({ "--accent": THEMES[theme].accent }) as CSSProperties, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  async function startGame() {
    setLoading(true);
    setError("");
    const nextSeed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    try {
      const nextBeat = await requestDirector({
        action: "start",
        theme,
        players: players.map((player) => player.trim()),
        act: 0,
        history: [],
        locale,
        sessionSeed: nextSeed,
      });
      setSessionSeed(nextSeed);
      setBeat(nextBeat);
      setAct(0);
      setHistory([]);
      setRoleIndex(0);
      setRoleRevealed(false);
      setScreen("roles");
    } catch {
      setError(TEXT[locale].error);
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
        const finale = await requestDirector({ action: "finale", theme, players, act, playerMove: move, history: nextHistory, locale, sessionSeed });
        setHistory(nextHistory);
        setBeat(finale);
        setScreen("finale");
      } else {
        const nextAct = act + 1;
        const nextBeat = await requestDirector({ action: "twist", theme, players, act: nextAct, playerMove: move, history: nextHistory, locale, sessionSeed });
        setHistory(nextHistory);
        setAct(nextAct);
        setBeat(nextBeat);
      }
    } catch {
      setError(TEXT[locale].error);
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
      <header className="site-header">
        <Wordmark />
        <span className="site-header__tag">{TEXT[locale].siteTag}</span>
        <div className="site-header__actions">
          {screen === "lobby" && <button className="locale-switch" onClick={() => setLocale((value) => value === "zh" ? "en" : "zh")} aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}>{locale === "zh" ? "EN" : "中文"}</button>}
          <button className="header-action" onClick={screen === "lobby" ? () => setRulesOpen(true) : replay}>{screen === "lobby" ? TEXT[locale].howTo : TEXT[locale].exit}</button>
        </div>
      </header>
      {screen === "lobby" && <Lobby locale={locale} theme={theme} setTheme={setTheme} players={players} setPlayers={setPlayers} onStart={startGame} loading={loading} error={error} />}
      {screen === "roles" && beat && <RoleReveal locale={locale} beat={beat} index={roleIndex} revealed={roleRevealed} onReveal={() => setRoleRevealed(true)} onNext={nextRole} />}
      {screen === "playing" && beat && <Stage key={`${sessionSeed}-${act}`} locale={locale} beat={beat} act={act} theme={theme} players={players} loading={loading} error={error} onMove={playMove} />}
      {screen === "finale" && beat && <Finale locale={locale} beat={beat} theme={theme} players={players} history={history} onReplay={replay} />}
      {rulesOpen && <RulesModal locale={locale} onClose={() => setRulesOpen(false)} />}
    </div>
  );
}

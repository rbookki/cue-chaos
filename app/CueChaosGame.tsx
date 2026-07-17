"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  THEMES,
  type ChaosRound,
  type ChoiceId,
  type Locale,
  type SabotageGame,
  type SabotageGameRequest,
  type SecretCard,
  type ThemeId,
} from "./game-types";

type Screen = "lobby" | "secrets" | "briefing" | "ballot" | "reveal" | "accusation" | "finale";

type Ballot = { player: string; choiceId: ChoiceId };
type RoundResult = {
  roundIndex: number;
  winningChoiceId: ChoiceId;
  counts: Record<ChoiceId, number>;
  progressDelta: number;
  riskDelta: number;
  clue: string;
  sabotageHit: boolean;
};

const INITIAL_PLAYERS = ["Maya", "Leo", "Sam"];

const TEXT = {
  en: {
    siteTag: "ZERO-API SOCIAL DEDUCTION",
    howTo: "HOW TO PLAY?",
    exit: "EXIT GAME ×",
    signal: "ONE OF YOU IS COMPROMISING THE CASE",
    heroLine1: "Trust the team.",
    heroLine2: "Suspect everyone.",
    heroBody: "One player is secretly compromising the mission. Make three connected decisions, follow the evidence, and expose who keeps pushing dangerous shortcuts.",
    players: "players",
    minutes: "minutes",
    saboteur: "saboteur",
    casting: "CHOOSE A CASE",
    chooseWorld: "Which mission will your group solve?",
    take: "CASE 001",
    selected: "SELECTED",
    select: "SELECT",
    yourCast: "YOUR SUSPECTS",
    addPlayers: "Who’s in the room?",
    addPlayer: "Add player",
    start: "DEAL SECRET ROLES",
    loading: "SHUFFLING THE EVIDENCE…",
    offlineNote: "Deduction packs made with GPT‑5.6 in Codex · Zero API calls while playing",
    format: "ONE CASE · THREE CAUSAL STEPS",
    steps: [
      ["Investigate", "Every case has one goal. Each decision reveals a clue and becomes part of the next scene."],
      ["Choose", "Vote privately between careful plans and tempting shortcuts. Consequences change progress and risk."],
      ["Deduce", "Use the full evidence trail to identify who repeatedly pushed plans that compromised the mission."],
    ],
    rulesTitle: "Solve the case. Catch the inside threat.",
    rulesIntro: "Every round advances one continuous mission. Comedy lives in the setting; the evidence and consequences follow a clear chain.",
    rules: [
      ["Deal roles", "Pass the phone. One player sees Inside Saboteur; everyone else joins the investigation team."],
      ["Follow the case", "Read the goal, stakes, and evidence trail. The previous result remains visible in every later round."],
      ["Vote privately", "Every plan sounds plausible. Only after the vote do you see what it achieved, what it risked, and which clue it found."],
      ["Win the finale", "Cast must identify the Saboteur and stop at least two marked high-risk plans. Otherwise, the Saboteur wins."],
    ],
    close: "GOT IT — PICK A CASE",
    secretDeal: "SECRET ROLE DEAL",
    passTo: "PASS THE PHONE TO",
    noPeeking: "Make sure nobody is looking. Your allegiance stays secret until the finale.",
    revealRole: "REVEAL MY ROLE",
    castTeam: "YOU ARE INVESTIGATION TEAM",
    saboteurTeam: "YOU ARE THE INSIDE SABOTEUR",
    coverRole: "YOUR COVER ROLE",
    privateBriefing: "PRIVATE BRIEFING",
    targets: "PLANS THAT PROTECT YOUR COVER",
    targetRound: "ROUND {n}",
    hidePass: "HIDE & PASS LEFT",
    enterCrisis: "START THE FIRST CRISIS",
    privateOnly: "For {name} only. Do not show anyone.",
    caseFile: "CASE FILE",
    round: "ROUND {n} / 3",
    progress: "CASE PROGRESS",
    risk: "CASE RISK",
    caseGoal: "MISSION",
    stakes: "WHY IT MATTERS",
    caseSoFar: "CASE SO FAR",
    decision: "THE DECISION",
    ballotHint: "Each plan can work, but some trade evidence for speed. Discuss the logic, then vote in secret.",
    beginVoting: "BEGIN SECRET BALLOT",
    votesLocked: "{n} / {total} VOTES LOCKED",
    readyFor: "PRIVATE BALLOT FOR",
    readyBody: "Take the phone alone. Your vote will not be shown with your name.",
    ready: "I’M READY TO VOTE",
    choose: "CHOOSE ONE OUTCOME",
    voteLocked: "VOTE LOCKED",
    passNext: "Hide the screen and pass left.",
    majority: "THE MAJORITY CHOSE",
    targetHit: "THE MISSION WAS COMPROMISED",
    targetBlocked: "THE EVIDENCE TRAIL HELD",
    consequence: "CONSEQUENCE",
    clueFound: "NEW EVIDENCE",
    evidence: "ANONYMOUS VOTE SPLIT",
    discuss: "DISCUSSION WINDOW",
    discussBody: "Was this risk necessary? Who pushed the shortcut, and did their reasoning match the evidence?",
    nextRound: "FOLLOW THE CONSEQUENCE",
    finalAccusation: "FINAL ACCUSATION",
    accusationBody: "One at a time, secretly vote for the player you believe compromised the case.",
    accuseReady: "I’M READY TO ACCUSE",
    accuseQuestion: "WHO WAS OFF SCRIPT?",
    cannotSelf: "You cannot vote for yourself.",
    revealVerdict: "REVEAL THE SABOTEUR",
    castWins: "THE TEAM SECURED THE MISSION",
    saboteurWins: "THE SABOTEUR COMPROMISED THE CASE",
    saboteurWas: "THE INSIDE SABOTEUR WAS",
    caught: "IDENTITY EXPOSED",
    escaped: "IDENTITY HIDDEN",
    hits: "COMPROMISED STEPS",
    finalVotes: "FINAL ACCUSATION RESULTS",
    roundLedger: "THE COMPLETE EVIDENCE TRAIL",
    replay: "PLAY ANOTHER CASE",
    copy: "COPY THE VERDICT",
    copied: "VERDICT COPIED!",
    error: "The case file jammed. Please try again.",
  },
  zh: {
    siteTag: "零 API 社交推理游戏",
    howTo: "怎么玩？",
    exit: "退出游戏 ×",
    signal: "你们之中有人正在污染案件",
    heroLine1: "相信团队。",
    heroLine2: "怀疑所有人。",
    heroBody: "一名玩家正在秘密破坏真实任务。完成三个连续决策、追踪证据链，找出那个总在推动危险捷径的人。",
    players: "玩家",
    minutes: "分钟",
    saboteur: "破坏者",
    casting: "选择案件",
    chooseWorld: "这一次你们要解决哪项任务？",
    take: "案件 001",
    selected: "已选择",
    select: "选择",
    yourCast: "嫌疑人名单",
    addPlayers: "谁在现场？",
    addPlayer: "添加玩家",
    start: "发放秘密身份",
    loading: "正在打乱证据…",
    offlineNote: "推理剧情包由 GPT‑5.6 在 Codex 中创作 · 游玩时零 API 调用",
    format: "一个案件 · 三步因果链",
    steps: [
      ["调查", "每个案件只有一个明确目标；每次选择都会产生线索，并进入下一幕。"],
      ["决策", "在稳妥方案和诱人捷径之间匿名投票，结果会改变进度与风险。"],
      ["推理", "根据完整证据链，找出那个反复推动任务失控方案的人。"],
    ],
    rulesTitle: "解决案件，抓出内部破坏者",
    rulesIntro: "每一轮都在推进同一个任务。幽默来自人物和环境，但证据与后果必须保持清晰因果。",
    rules: [
      ["发放身份", "依次传手机。一人看到“内部破坏者”，其他人都是调查团队。"],
      ["追踪案件", "阅读任务、利害和证据记录；上一轮结果会一直保留，并构成下一轮背景。"],
      ["匿名投票", "每个方案都能自圆其说。投票后才会揭晓它推动了什么、制造了什么风险、找到了什么线索。"],
      ["决定胜负", "团队必须认出破坏者，并阻止至少两个被标记的高风险方案，才能获胜。"],
    ],
    close: "明白了，选择案件",
    secretDeal: "秘密身份发放",
    passTo: "把手机交给",
    noPeeking: "确认没人偷看。你的阵营必须保密到最终揭晓。",
    revealRole: "揭晓我的身份",
    castTeam: "你是调查团队",
    saboteurTeam: "你是内部破坏者",
    coverRole: "伪装身份",
    privateBriefing: "秘密任务",
    targets: "能够保护你身份的三个方案",
    targetRound: "第 {n} 轮",
    hidePass: "隐藏并传给左边",
    enterCrisis: "进入第一场危机",
    privateOnly: "本页仅供 {name} 查看，禁止展示给别人。",
    caseFile: "案件档案",
    round: "第 {n} / 3 轮",
    progress: "案件进度",
    risk: "案件风险",
    caseGoal: "任务目标",
    stakes: "失败代价",
    caseSoFar: "案件进展",
    decision: "本轮决策",
    ballotHint: "每个方案都可能奏效，但有些会用证据换速度。先讨论逻辑，再传手机匿名投票。",
    beginVoting: "开始秘密投票",
    votesLocked: "已锁定 {n} / {total} 票",
    readyFor: "秘密选票属于",
    readyBody: "独自拿好手机。你的名字不会与选项一起公开。",
    ready: "我准备好投票了",
    choose: "选择一个结果",
    voteLocked: "选票已锁定",
    passNext: "隐藏屏幕，然后传给左边。",
    majority: "多数人选择了",
    targetHit: "任务完整性遭到破坏",
    targetBlocked: "证据链保持完整",
    consequence: "行动后果",
    clueFound: "新增证据",
    evidence: "匿名票数分布",
    discuss: "公开讨论时间",
    discussBody: "这次风险真的有必要吗？是谁推动了捷径，他的理由符合现有证据吗？",
    nextRound: "继续追踪后果",
    finalAccusation: "最终指认",
    accusationBody: "依次秘密投票，选出你认为一直在污染案件的玩家。",
    accuseReady: "我准备好指认了",
    accuseQuestion: "谁没有按剧本来？",
    cannotSelf: "不能投给自己。",
    revealVerdict: "揭晓内部破坏者",
    castWins: "团队成功保全任务",
    saboteurWins: "破坏者成功污染案件",
    saboteurWas: "真正的内部破坏者是",
    caught: "身份暴露",
    escaped: "成功隐藏",
    hits: "遭破坏步骤",
    finalVotes: "最终指认票数",
    roundLedger: "完整证据链",
    replay: "再玩一个案件",
    copy: "复制判决结果",
    copied: "判决已复制！",
    error: "案件档案卡住了，请再试一次。",
  },
} as const;

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

async function requestGame(input: SabotageGameRequest) {
  const response = await fetch("/api/director", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = await response.json() as SabotageGame & { error?: string };
  if (!response.ok) throw new Error(payload.error || "The case file jammed.");
  return payload;
}

function Wordmark() {
  return (
    <a className="wordmark" href="#top" aria-label="CueChaos home">
      <span className="wordmark__cue">CUE</span><span className="wordmark__chaos">CHAOS</span><i>BLUFF</i>
    </a>
  );
}

function RulesModal({ locale, onClose }: { locale: Locale; onClose: () => void }) {
  const text = TEXT[locale];
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <div className="rules-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="rules-modal" role="dialog" aria-modal="true" aria-labelledby="rules-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="rules-modal__x" onClick={onClose} aria-label={locale === "zh" ? "关闭玩法说明" : "Close instructions"}>×</button>
        <span className="kicker">{locale === "zh" ? "开局之前" : "BEFORE THE FIRST VOTE"}</span>
        <h2 id="rules-title">{text.rulesTitle}</h2>
        <p className="rules-modal__intro">{text.rulesIntro}</p>
        <div className="rules-list">
          {text.rules.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}
        </div>
        <button className="rules-modal__close" onClick={onClose}>{text.close} <span>→</span></button>
      </section>
    </div>
  );
}

function Lobby({
  locale, theme, setTheme, players, setPlayers, onStart, loading, error,
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
  const cleanedPlayers = players.map((player) => player.trim().toLocaleLowerCase());
  const canStart = players.length >= 3
    && players.every((player) => player.trim())
    && new Set(cleanedPlayers).size === cleanedPlayers.length;

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
          <span><b>3–6</b> {text.players}</span><span><b>8–12</b> {text.minutes}</span><span><b>1</b> {text.saboteur}</span>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div className="setup-card__topline"><div><span className="kicker">{text.casting}</span><h2 id="setup-title">{text.chooseWorld}</h2></div><span className="take-pill">{text.take}</span></div>
        <div className="theme-grid" role="radiogroup" aria-label={locale === "zh" ? "选择案件世界" : "Choose a case world"}>
          {(Object.keys(THEMES) as ThemeId[]).map((id, index) => {
            const item = THEMES[id];
            return (
              <button key={id} className={`theme-card theme-card--${id} ${theme === id ? "is-selected" : ""}`} onClick={() => setTheme(id)} role="radio" aria-checked={theme === id}>
                <span className="theme-card__number">0{index + 1}</span><span className="theme-card__art" aria-hidden="true"><i /><b>{item.symbol}</b></span>
                <span className="theme-card__eyebrow">{item.eyebrow[locale]}</span><strong>{item.title[locale]}</strong><small>{item.logline[locale]}</small>
                <span className="theme-card__select">{theme === id ? text.selected : text.select} <i>→</i></span>
              </button>
            );
          })}
        </div>

        <div className="cast-builder">
          <div className="cast-builder__heading"><div><span className="kicker">{text.yourCast}</span><h3>{text.addPlayers}</h3></div><span>{players.length} / 6 {text.players.toUpperCase()}</span></div>
          <div className="player-list">
            {players.map((player, index) => (
              <label className="player-field" key={index}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <input aria-label={locale === "zh" ? `玩家 ${index + 1} 名字` : `Player ${index + 1} name`} value={player} onChange={(event) => updatePlayer(index, event.target.value)} placeholder={locale === "zh" ? `玩家 ${index + 1}` : `Player ${index + 1}`} />
                {players.length > 3 && <button type="button" onClick={() => setPlayers(players.filter((_, playerIndex) => playerIndex !== index))} aria-label={`Remove ${player}`}>×</button>}
              </label>
            ))}
            {players.length < 6 && <button className="add-player" onClick={() => setPlayers([...players, ""])}><span>＋</span> {text.addPlayer}</button>}
          </div>
        </div>
        {error && <p className="error-banner" role="alert">{error}</p>}
        <button className="start-button" onClick={onStart} disabled={!canStart || loading}><span>{loading ? text.loading : text.start}</span><i>{loading ? "···" : "→"}</i></button>
        <p className="setup-note"><span>✦</span> {text.offlineNote}</p>
      </section>

      <section className="how-it-works" aria-label={text.format}><span className="kicker">{text.format}</span><div className="steps">{text.steps.map(([title, body], index) => <article key={title}><b>0{index + 1}</b><h3>{title}</h3><p>{body}</p></article>)}</div></section>
    </main>
  );
}

function SecretReveal({ locale, card, index, total, revealed, onReveal, onNext }: { locale: Locale; card: SecretCard; index: number; total: number; revealed: boolean; onReveal: () => void; onNext: () => void }) {
  const text = TEXT[locale];
  const isSaboteur = card.team === "saboteur";
  return (
    <main className="role-screen secret-screen">
      <div className="role-progress"><span>{text.secretDeal}</span><div>{Array.from({ length: total }, (_, itemIndex) => <i key={itemIndex} className={itemIndex <= index ? "is-filled" : ""} />)}</div><small>{index + 1} / {total}</small></div>
      <section className={`role-envelope secret-envelope ${revealed && isSaboteur ? "is-saboteur" : ""}`}>
        <div className="role-envelope__stamp">TOP<br />SECRET</div>
        {!revealed ? (
          <div className="role-envelope__closed"><span className="eyebrow">{text.passTo}</span><h1>{card.player}</h1><p>{text.noPeeking}</p><button onClick={onReveal}>{text.revealRole} <i>◎</i></button></div>
        ) : (
          <div className="secret-revealed">
            <span className={`team-badge team-badge--${card.team}`}>{isSaboteur ? text.saboteurTeam : text.castTeam}</span>
            <div className="cover-role"><span>{text.coverRole}</span><h1>{card.coverRole}</h1></div>
            <div className="secret-mission"><span>{text.privateBriefing}</span><p>{card.briefing}</p></div>
            {isSaboteur && <div className="target-list"><span>{text.targets}</span>{card.targets.map((target) => <div key={target.round}><small>{text.targetRound.replace("{n}", String(target.round))}</small><span><strong>{target.choiceId} · {target.label}</strong><em>{target.reason}</em></span></div>)}</div>}
            <button onClick={onNext}>{index === total - 1 ? text.enterCrisis : text.hidePass} <i>→</i></button>
          </div>
        )}
      </section>
      <p className="privacy-note">{text.privateOnly.replace("{name}", card.player)}</p>
    </main>
  );
}

function GameTopbar({ locale, roundIndex, progress, risk }: { locale: Locale; roundIndex: number; progress: number; risk: number }) {
  const text = TEXT[locale];
  return (
    <header className="game-topbar"><span>{text.caseFile}</span><div className="round-pips">{[0, 1, 2].map((step) => <i key={step} className={step <= roundIndex ? "is-active" : ""} />)}</div><div className="case-scores"><span>{text.progress} <strong>{progress} / 9</strong></span><span>{text.risk} <strong>{risk} / 6</strong></span></div></header>
  );
}

function RoundBrief({ locale, round, roundIndex, theme, game, results, progress, risk, onStart }: { locale: Locale; round: ChaosRound; roundIndex: number; theme: ThemeId; game: SabotageGame; results: RoundResult[]; progress: number; risk: number; onStart: () => void }) {
  const text = TEXT[locale];
  return (
    <main className="game-screen">
      <GameTopbar locale={locale} roundIndex={roundIndex} progress={progress} risk={risk} />
      <section className="crisis-layout">
        <div className="crisis-copy">
          <div className="case-objective"><div><span>{text.caseGoal}</span><p>{game.goal}</p></div><div><span>{text.stakes}</span><p>{game.stakes}</p></div></div>
          <span className="scene-kicker">{text.round.replace("{n}", String(roundIndex + 1))} · {round.phase} · {THEMES[theme].eyebrow[locale]}</span><h1>{round.headline}</h1><p>{round.situation}</p>
          {results.length > 0 && <div className="case-history"><span>{text.caseSoFar}</span>{results.map((result) => { const resolvedRound = game.rounds[result.roundIndex]; const selected = resolvedRound.choices.find((item) => item.id === result.winningChoiceId)!; return <article key={result.roundIndex}><b>0{result.roundIndex + 1}</b><div><strong>{selected.label}</strong><p>{selected.consequence}</p><small>{text.clueFound}: {selected.clue}</small></div></article>; })}</div>}
          <div className="crisis-question"><span>{text.decision}</span><strong>{round.question}</strong></div>
        </div>
        <aside className="public-options"><p>{text.ballotHint}</p>{round.choices.map((item) => <div key={item.id}><span>{item.id}</span><div><strong>{item.label}</strong><small>{item.pitch}</small></div></div>)}<button onClick={onStart}>{text.beginVoting} <span>→</span></button></aside>
      </section>
    </main>
  );
}

function PrivateBallot({ locale, player, index, total, round, ready, onReady, onVote }: { locale: Locale; player: string; index: number; total: number; round: ChaosRound; ready: boolean; onReady: () => void; onVote: (choiceId: ChoiceId) => void }) {
  const text = TEXT[locale];
  return (
    <main className="ballot-screen">
      <div className="ballot-progress"><span>{text.votesLocked.replace("{n}", String(index)).replace("{total}", String(total))}</span><div>{Array.from({ length: total }, (_, itemIndex) => <i key={itemIndex} className={itemIndex < index ? "is-filled" : ""} />)}</div></div>
      {!ready ? (
        <section className="pass-card"><span className="kicker">{text.readyFor}</span><h1>{player}</h1><p>{text.readyBody}</p><button onClick={onReady}>{text.ready} <span>→</span></button></section>
      ) : (
        <section className="private-vote-card"><span className="kicker">{text.choose}</span><h1>{round.question}</h1><div className="private-choice-list">{round.choices.map((item) => <button key={item.id} onClick={() => onVote(item.id)}><span>{item.id}</span><div><strong>{item.label}</strong><small>{item.pitch}</small></div><i>→</i></button>)}</div><p>{text.voteLocked} · {text.passNext}</p></section>
      )}
    </main>
  );
}

function RoundReveal({ locale, round, result, progress, risk, isFinal, onNext }: { locale: Locale; round: ChaosRound; result: RoundResult; progress: number; risk: number; isFinal: boolean; onNext: () => void }) {
  const text = TEXT[locale];
  const [seconds, setSeconds] = useState(30);
  useEffect(() => {
    if (seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [seconds]);
  const winner = round.choices.find((item) => item.id === result.winningChoiceId)!;
  const maxVotes = Math.max(...Object.values(result.counts), 1);
  return (
    <main className="reveal-screen">
      <section className="result-card">
        <div className={`result-signal ${result.sabotageHit ? "is-hit" : "is-blocked"}`}>{result.sabotageHit ? text.targetHit : text.targetBlocked}</div>
        <span className="kicker">{text.majority}</span><h1><i>{winner.id}</i>{winner.label}</h1>
        <div className="consequence-box"><span>{text.consequence}</span><p>{winner.consequence}</p><div className="impact-chips"><strong>+{result.progressDelta} {text.progress}</strong><strong className={result.riskDelta > 0 ? "has-risk" : ""}>+{result.riskDelta} {text.risk}</strong></div></div>
        <div className="clue-box"><span>{text.clueFound}</span><p>{result.clue}</p></div>
        <div className="vote-evidence"><span>{text.evidence}</span>{round.choices.map((item) => <div key={item.id}><small>{item.id}</small><div><i style={{ width: `${(result.counts[item.id] / maxVotes) * 100}%` }} /></div><strong>{result.counts[item.id]}</strong></div>)}</div>
      </section>
      <aside className="discussion-card"><span>{text.discuss}</span><strong>00:{String(seconds).padStart(2, "0")}</strong><p>{text.discussBody}</p><div className="case-totals"><div><span>{text.progress}</span><b>{progress} / 9</b></div><div><span>{text.risk}</span><b>{risk} / 6</b></div></div><button onClick={onNext}>{isFinal ? text.finalAccusation : text.nextRound} <span>→</span></button></aside>
    </main>
  );
}

function Accusation({ locale, player, players, index, total, ready, onReady, onAccuse }: { locale: Locale; player: string; players: string[]; index: number; total: number; ready: boolean; onReady: () => void; onAccuse: (name: string) => void }) {
  const text = TEXT[locale];
  return (
    <main className="ballot-screen accusation-screen">
      <div className="ballot-progress"><span>{text.finalAccusation} · {index} / {total}</span><div>{Array.from({ length: total }, (_, itemIndex) => <i key={itemIndex} className={itemIndex < index ? "is-filled" : ""} />)}</div></div>
      {!ready ? (
        <section className="pass-card"><span className="kicker">{text.finalAccusation}</span><h1>{player}</h1><p>{text.accusationBody}</p><button onClick={onReady}>{text.accuseReady} <span>→</span></button></section>
      ) : (
        <section className="private-vote-card"><span className="kicker">{text.accuseQuestion}</span><h1>{locale === "zh" ? `${player} 的最终选择` : `${player}’s final call`}</h1><div className="suspect-choice-grid">{players.filter((name) => name !== player).map((name) => <button key={name} onClick={() => onAccuse(name)}><span>◎</span><strong>{name}</strong><i>→</i></button>)}</div><p>{text.cannotSelf}</p></section>
      )}
    </main>
  );
}

function Finale({ locale, theme, game, results, accusations, progress, risk, onReplay }: { locale: Locale; theme: ThemeId; game: SabotageGame; results: RoundResult[]; accusations: string[]; progress: number; risk: number; onReplay: () => void }) {
  const text = TEXT[locale];
  const [copied, setCopied] = useState(false);
  const saboteur = game.cards.find((card) => card.team === "saboteur")!;
  const sabotageHits = results.filter((result) => result.sabotageHit).length;
  const accusationCounts = game.cards.reduce<Record<string, number>>((counts, card) => ({ ...counts, [card.player]: accusations.filter((name) => name === card.player).length }), {});
  const highVote = Math.max(...Object.values(accusationCounts));
  const topSuspects = Object.entries(accusationCounts).filter(([, count]) => count === highVote).map(([name]) => name);
  const caught = topSuspects.length === 1 && topSuspects[0] === saboteur.player;
  const saboteurWins = !caught || sabotageHits >= 2;

  async function copyVerdict() {
    const verdict = `${THEMES[theme].title[locale]} — ${saboteurWins ? text.saboteurWins : text.castWins}\n${text.saboteurWas}: ${saboteur.player}\n${text.hits}: ${sabotageHits}/3 · ${text.progress}: ${progress}/9 · ${text.risk}: ${risk}/6`;
    await navigator.clipboard.writeText(verdict);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <main className={`verdict-screen ${saboteurWins ? "is-saboteur-win" : "is-cast-win"}`}>
      <section className="verdict-hero"><span className="kicker">{THEMES[theme].eyebrow[locale]}</span><p>{saboteurWins ? text.saboteurWins : text.castWins}</p><h1>{saboteur.player}</h1><strong>{text.saboteurWas}</strong></section>
      <div className="verdict-stats"><article><span>{caught ? text.caught : text.escaped}</span><strong>{caught ? "◎" : "◇"}</strong></article><article><span>{text.hits}</span><strong>{sabotageHits} / 3</strong></article><article><span>{text.progress}</span><strong>{progress} / 9</strong></article><article><span>{text.risk}</span><strong>{risk} / 6</strong></article></div>
      <section className="verdict-details"><div><span className="kicker">{text.finalVotes}</span><div className="accusation-results">{Object.entries(accusationCounts).sort((a, b) => b[1] - a[1]).map(([name, count]) => <article key={name}><strong>{name}</strong><span>{count} {locale === "zh" ? "票" : count === 1 ? "vote" : "votes"}</span></article>)}</div></div><div><span className="kicker">{text.roundLedger}</span><div className="damage-ledger">{results.map((result) => { const item = game.rounds[result.roundIndex].choices.find((choiceItem) => choiceItem.id === result.winningChoiceId)!; return <article key={result.roundIndex}><span>0{result.roundIndex + 1}</span><div><strong>{item.label}</strong><small>{item.clue}</small><em>+{item.progress} {text.progress} · +{item.risk} {text.risk}</em></div></article>; })}</div></div></section>
      <div className="finale-actions"><button className="button-outline" onClick={copyVerdict}>{copied ? text.copied : text.copy}</button><button className="button-solid" onClick={onReplay}>{text.replay} <span>→</span></button></div>
    </main>
  );
}

export function CueChaosGame() {
  const [screen, setScreen] = useState<Screen>("lobby");
  const [locale, setLocale] = useState<Locale>("en");
  const [rulesOpen, setRulesOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("office");
  const [players, setPlayers] = useState(INITIAL_PLAYERS);
  const [game, setGame] = useState<SabotageGame | null>(null);
  const [sessionSeed, setSessionSeed] = useState("judge-demo");
  const [secretIndex, setSecretIndex] = useState(0);
  const [secretRevealed, setSecretRevealed] = useState(false);
  const [roundIndex, setRoundIndex] = useState(0);
  const [ballotIndex, setBallotIndex] = useState(0);
  const [ballotReady, setBallotReady] = useState(false);
  const [ballots, setBallots] = useState<Ballot[]>([]);
  const [results, setResults] = useState<RoundResult[]>([]);
  const [accusationIndex, setAccusationIndex] = useState(0);
  const [accusationReady, setAccusationReady] = useState(false);
  const [accusations, setAccusations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const style = useMemo(() => ({ "--accent": THEMES[theme].accent }) as CSSProperties, [theme]);
  const progress = results.reduce((sum, result) => sum + result.progressDelta, 0);
  const risk = results.reduce((sum, result) => sum + result.riskDelta, 0);

  useEffect(() => { document.documentElement.lang = locale === "zh" ? "zh-CN" : "en"; }, [locale]);

  async function startGame() {
    setLoading(true);
    setError("");
    const nextSeed = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    try {
      const prepared = await requestGame({ theme, players: players.map((player) => player.trim()), locale, sessionSeed: nextSeed });
      setSessionSeed(nextSeed);
      setGame(prepared);
      setSecretIndex(0);
      setSecretRevealed(false);
      setRoundIndex(0);
      setBallots([]);
      setResults([]);
      setAccusations([]);
      setScreen("secrets");
    } catch {
      setError(TEXT[locale].error);
    } finally {
      setLoading(false);
    }
  }

  function nextSecret() {
    if (!game) return;
    if (secretIndex >= game.cards.length - 1) { setScreen("briefing"); return; }
    setSecretIndex((index) => index + 1);
    setSecretRevealed(false);
  }

  function beginBallot() {
    setBallots([]);
    setBallotIndex(0);
    setBallotReady(false);
    setScreen("ballot");
  }

  function castBallot(choiceId: ChoiceId) {
    if (!game) return;
    const nextBallots = [...ballots, { player: players[ballotIndex], choiceId }];
    setBallots(nextBallots);
    if (ballotIndex < players.length - 1) {
      setBallotIndex((index) => index + 1);
      setBallotReady(false);
      return;
    }

    const counts: Record<ChoiceId, number> = { A: 0, B: 0, C: 0 };
    nextBallots.forEach((ballot) => { counts[ballot.choiceId] += 1; });
    const highVote = Math.max(...Object.values(counts));
    const tied = (Object.keys(counts) as ChoiceId[]).filter((id) => counts[id] === highVote);
    const winningChoiceId = tied[hash(`${sessionSeed}:tie:${roundIndex}`) % tied.length];
    const round = game.rounds[roundIndex];
    const winner = round.choices.find((item) => item.id === winningChoiceId)!;
    const target = game.cards.find((card) => card.team === "saboteur")!.targets[roundIndex];
    const result: RoundResult = { roundIndex, winningChoiceId, counts, progressDelta: winner.progress, riskDelta: winner.risk, clue: winner.clue, sabotageHit: target.choiceId === winningChoiceId };
    setResults((items) => [...items, result]);
    setScreen("reveal");
  }

  function nextAfterReveal() {
    if (roundIndex < 2) {
      setRoundIndex((index) => index + 1);
      setScreen("briefing");
      return;
    }
    setAccusationIndex(0);
    setAccusationReady(false);
    setScreen("accusation");
  }

  function castAccusation(name: string) {
    const next = [...accusations, name];
    setAccusations(next);
    if (accusationIndex < players.length - 1) {
      setAccusationIndex((index) => index + 1);
      setAccusationReady(false);
      return;
    }
    setScreen("finale");
  }

  function replay() {
    setScreen("lobby");
    setGame(null);
    setError("");
  }

  return (
    <div className={`app-shell app-shell--${screen}`} style={style}>
      <div className="grain" aria-hidden="true" />
      <header className="site-header"><Wordmark /><span className="site-header__tag">{TEXT[locale].siteTag}</span><div className="site-header__actions">{screen === "lobby" && <button className="locale-switch" onClick={() => setLocale((value) => value === "zh" ? "en" : "zh")}>{locale === "zh" ? "EN" : "中文"}</button>}<button className="header-action" onClick={screen === "lobby" ? () => setRulesOpen(true) : replay}>{screen === "lobby" ? TEXT[locale].howTo : TEXT[locale].exit}</button></div></header>
      {screen === "lobby" && <Lobby locale={locale} theme={theme} setTheme={setTheme} players={players} setPlayers={setPlayers} onStart={startGame} loading={loading} error={error} />}
      {screen === "secrets" && game && <SecretReveal locale={locale} card={game.cards[secretIndex]} index={secretIndex} total={game.cards.length} revealed={secretRevealed} onReveal={() => setSecretRevealed(true)} onNext={nextSecret} />}
      {screen === "briefing" && game && <RoundBrief locale={locale} round={game.rounds[roundIndex]} roundIndex={roundIndex} theme={theme} game={game} results={results} progress={progress} risk={risk} onStart={beginBallot} />}
      {screen === "ballot" && game && <PrivateBallot locale={locale} player={players[ballotIndex]} index={ballotIndex} total={players.length} round={game.rounds[roundIndex]} ready={ballotReady} onReady={() => setBallotReady(true)} onVote={castBallot} />}
      {screen === "reveal" && game && <RoundReveal key={roundIndex} locale={locale} round={game.rounds[roundIndex]} result={results.at(-1)!} progress={progress} risk={risk} isFinal={roundIndex === 2} onNext={nextAfterReveal} />}
      {screen === "accusation" && <Accusation locale={locale} player={players[accusationIndex]} players={players} index={accusationIndex} total={players.length} ready={accusationReady} onReady={() => setAccusationReady(true)} onAccuse={castAccusation} />}
      {screen === "finale" && game && <Finale locale={locale} theme={theme} game={game} results={results} accusations={accusations} progress={progress} risk={risk} onReplay={replay} />}
      {rulesOpen && <RulesModal locale={locale} onClose={() => setRulesOpen(false)} />}
    </div>
  );
}

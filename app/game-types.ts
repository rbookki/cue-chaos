export type ThemeId = "heist" | "office" | "wedding" | "space";

export type Locale = "zh" | "en";

export type Team = "cast" | "saboteur";

export type ChoiceId = "A" | "B" | "C";

export interface SabotageGameRequest {
  theme: ThemeId;
  players: string[];
  locale: Locale;
  sessionSeed: string;
}

export interface SabotageTarget {
  round: number;
  choiceId: ChoiceId;
  label: string;
}

export interface SecretCard {
  player: string;
  team: Team;
  coverRole: string;
  briefing: string;
  targets: SabotageTarget[];
}

export interface ChaosChoice {
  id: ChoiceId;
  label: string;
  consequence: string;
  chaos: number;
}

export interface ChaosRound {
  headline: string;
  situation: string;
  question: string;
  choices: [ChaosChoice, ChaosChoice, ChaosChoice];
}

export interface SabotageGame {
  cards: SecretCard[];
  rounds: [ChaosRound, ChaosRound, ChaosRound];
  source: "story-pack";
}

type LocalizedText = Record<Locale, string>;

export const THEMES: Record<ThemeId, {
  eyebrow: LocalizedText;
  title: LocalizedText;
  logline: LocalizedText;
  accent: string;
  symbol: string;
}> = {
  heist: {
    eyebrow: { en: "MIDNIGHT CAPER", zh: "午夜大劫案" },
    title: { en: "The Last Croissant", zh: "最后一个牛角包" },
    logline: {
      en: "Save the heist while one crew member secretly wrecks the plan.",
      zh: "拯救这场劫案——但团队里有人正秘密毁掉计划。",
    },
    accent: "#ffd84d",
    symbol: "◇",
  },
  office: {
    eyebrow: { en: "CORPORATE DISASTER", zh: "职场灾难片" },
    title: { en: "Reply All", zh: "回复所有人" },
    logline: {
      en: "Three company crises. One coworker wants every meeting to fail.",
      zh: "三场公司危机，一个同事希望每次会议都彻底失败。",
    },
    accent: "#63f3c3",
    symbol: "↗",
  },
  wedding: {
    eyebrow: { en: "ROMANTIC MYSTERY", zh: "浪漫悬疑片" },
    title: { en: "Object Forever", zh: "永远反对" },
    logline: {
      en: "Keep the wedding alive while a hidden guest engineers disaster.",
      zh: "让婚礼继续，同时找出正在制造灾难的神秘宾客。",
    },
    accent: "#ff76b8",
    symbol: "♡",
  },
  space: {
    eyebrow: { en: "COSMIC CHECK-IN", zh: "宇宙入住指南" },
    title: { en: "Moon Motel", zh: "月球汽车旅馆" },
    logline: {
      en: "Protect a lunar motel from the one guest trying to crash the moon.",
      zh: "保护月球旅馆，找出那个想让整个月球坠毁的客人。",
    },
    accent: "#9fa8ff",
    symbol: "✦",
  },
};

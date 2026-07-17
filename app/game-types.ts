export type ThemeId = "heist" | "office" | "wedding" | "space";

export type Locale = "zh" | "en";

export type DirectorAction = "start" | "twist" | "finale";

export interface RoleCard {
  player: string;
  publicRole: string;
  secretObjective: string;
}

export interface AwardCard {
  player: string;
  title: string;
  reason: string;
}

export interface DirectorBeat {
  headline: string;
  directorLine: string;
  twist: string;
  mission: string;
  choices: [string, string, string];
  heat: number;
  roles: RoleCard[];
  finale: string;
  awards: AwardCard[];
  source?: "story-pack";
  variant?: number;
}

export interface DirectorRequest {
  action: DirectorAction;
  theme: ThemeId;
  players: string[];
  act: number;
  playerMove?: string;
  history: string[];
  locale: Locale;
  sessionSeed: string;
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
      en: "Steal a priceless pastry before sunrise. Nobody has the full plan.",
      zh: "天亮前偷走无价牛角包——可惜没有人知道完整计划。",
    },
    accent: "#ffd84d",
    symbol: "◇",
  },
  office: {
    eyebrow: { en: "CORPORATE DISASTER", zh: "职场灾难片" },
    title: { en: "Reply All", zh: "回复所有人" },
    logline: {
      en: "Survive an all-hands meeting after the company mascot becomes CEO.",
      zh: "公司吉祥物突然成为 CEO，你们必须活着开完全员大会。",
    },
    accent: "#63f3c3",
    symbol: "↗",
  },
  wedding: {
    eyebrow: { en: "ROMANTIC MYSTERY", zh: "浪漫悬疑片" },
    title: { en: "Object Forever", zh: "永远反对" },
    logline: {
      en: "The rings are missing, the ex is early, and the cake knows too much.",
      zh: "戒指失踪、前任早到，而婚礼蛋糕知道得太多。",
    },
    accent: "#ff76b8",
    symbol: "♡",
  },
  space: {
    eyebrow: { en: "COSMIC CHECK-IN", zh: "宇宙入住指南" },
    title: { en: "Moon Motel", zh: "月球汽车旅馆" },
    logline: {
      en: "Run a one-star lunar motel while the universe checks out early.",
      zh: "经营一家一星月球旅馆，而整个宇宙都想提前退房。",
    },
    accent: "#9fa8ff",
    symbol: "✦",
  },
};

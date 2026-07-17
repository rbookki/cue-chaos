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
  reason: string;
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
  pitch: string;
  consequence: string;
  clue: string;
  progress: number;
  risk: number;
}

export interface ChaosRound {
  phase: string;
  headline: string;
  situation: string;
  question: string;
  choices: [ChaosChoice, ChaosChoice, ChaosChoice];
}

export interface SabotageGame {
  goal: string;
  stakes: string;
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
      en: "Recover a stolen recipe before midnight—without exposing the crew.",
      zh: "在午夜前夺回被偷的配方，同时不能暴露整个团队。",
    },
    accent: "#ffd84d",
    symbol: "◇",
  },
  office: {
    eyebrow: { en: "CORPORATE DISASTER", zh: "职场灾难片" },
    title: { en: "Reply All", zh: "回复所有人" },
    logline: {
      en: "Prove the board forecast was falsified before the 5 PM vote.",
      zh: "在下午五点董事会表决前，证明财务预测遭到篡改。",
    },
    accent: "#63f3c3",
    symbol: "↗",
  },
  wedding: {
    eyebrow: { en: "ROMANTIC MYSTERY", zh: "浪漫悬疑片" },
    title: { en: "Object Forever", zh: "永远反对" },
    logline: {
      en: "Find the real rings before the vows and expose who switched them.",
      zh: "在宣誓前找回真正的戒指，并揭穿掉包它们的人。",
    },
    accent: "#ff76b8",
    symbol: "♡",
  },
  space: {
    eyebrow: { en: "COSMIC CHECK-IN", zh: "宇宙入住指南" },
    title: { en: "Moon Motel", zh: "月球汽车旅馆" },
    logline: {
      en: "Restore the orbit stabilizer before the next shuttle arrives.",
      zh: "在下一班穿梭机抵达前，修复旅馆的轨道稳定器。",
    },
    accent: "#9fa8ff",
    symbol: "✦",
  },
};

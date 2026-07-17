export type ThemeId = "heist" | "office" | "wedding";

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
}

export interface DirectorRequest {
  action: DirectorAction;
  theme: ThemeId;
  players: string[];
  act: number;
  playerMove?: string;
  history: string[];
}

export const THEMES: Record<ThemeId, {
  eyebrow: string;
  title: string;
  logline: string;
  accent: string;
}> = {
  heist: {
    eyebrow: "MIDNIGHT CAPER",
    title: "The Last Croissant",
    logline: "Steal a priceless pastry before sunrise. Nobody has the full plan.",
    accent: "#ffd84d",
  },
  office: {
    eyebrow: "CORPORATE DISASTER",
    title: "Reply All",
    logline: "Survive an all-hands meeting after the company mascot becomes CEO.",
    accent: "#63f3c3",
  },
  wedding: {
    eyebrow: "ROMANTIC MYSTERY",
    title: "Object Forever",
    logline: "The rings are missing, the ex is early, and the cake knows too much.",
    accent: "#ff76b8",
  },
};

import type { AwardCard, DirectorBeat, DirectorRequest, RoleCard, ThemeId } from "./game-types";

/**
 * Pre-generated story-room material authored directly with Codex for Build Week.
 * Runtime gameplay only remixes these committed packs; it never calls a model API.
 */

const ROLE_SETS: Record<ThemeId, Array<[string, string]>> = {
  heist: [
    ["The Mastermind", "Get someone else to say the word “butter” before the vault opens."],
    ["The Inside Baker", "Protect the croissant, but make everyone believe you want to steal it."],
    ["The Getaway Driver", "Convince the crew that your bicycle is a high-tech escape vehicle."],
    ["The Double Agent", "Secretly make the alarm sound useful."],
    ["The Critic", "Review every disaster as if it were fine dining."],
    ["The Tourist", "Take credit for the plan without understanding any of it."],
  ],
  office: [
    ["Acting CEO", "Use the phrase “strategic synergy” to hide that you have no plan."],
    ["Mascot Handler", "Keep everyone from discovering the CEO is three raccoons in a suit."],
    ["Reply-All Survivor", "Get the meeting cancelled without directly asking."],
    ["HR Oracle", "Turn one absurd sentence into an official company policy."],
    ["Intern of Destiny", "Accidentally become the most qualified person in the room."],
    ["Venture Capitalist", "Invest in the worst idea anyone mentions."],
  ],
  wedding: [
    ["Best Friend", "Delay the ceremony until you learn who replaced the rings."],
    ["Suspicious Florist", "Make everyone compliment the flowers while hiding one clue."],
    ["The Ex", "Prove you came for the cake, not the drama."],
    ["Wedding Detective", "Accuse the least suspicious object in the room."],
    ["Cousin With A Plan", "Turn the crisis into a dance number."],
    ["Cake Whisperer", "Translate one message from the cake without admitting it talks."],
  ],
};

const BEATS: Record<ThemeId, Array<Omit<DirectorBeat, "roles" | "awards" | "source">>> = {
  heist: [
    {
      headline: "ACT I — THE BLUEPRINT IS A MENU",
      directorLine: "The museum closes in eight minutes. Your blueprint lists soup, salad, and one alarmingly expensive croissant.",
      twist: "The vault only opens when it hears a sincere compliment.",
      mission: "Get inside without revealing who actually understands the plan.",
      choices: ["Compliment the vault", "Pose as food critics", "Start an elegant distraction"],
      heat: 28,
      finale: "",
    },
    {
      headline: "ACT II — THE PASTRY MOVES",
      directorLine: "The glass case is empty. Tiny golden crumbs form an arrow toward the dinosaur exhibit.",
      twist: "The croissant is sentient, fast, and deeply offended by the reviews.",
      mission: "Catch the target while keeping the night guard on your side.",
      choices: ["Offer a peace treaty", "Ride the dinosaur skeleton", "Frame the vending machine"],
      heat: 63,
      finale: "",
    },
    {
      headline: "ACT III — ONE LAST BITE",
      directorLine: "Sunrise hits the skylight. The croissant stands at the edge of the roof and demands creative control.",
      twist: "Your client is the croissant’s estranged twin.",
      mission: "Choose loyalty, money, or breakfast before the police arrive.",
      choices: ["Reunite the pastries", "Fake the perfect heist", "Eat the evidence together"],
      heat: 91,
      finale: "",
    },
  ],
  office: [
    {
      headline: "ACT I — THIS COULD HAVE BEEN AN EMAIL",
      directorLine: "The projector turns on by itself. A raccoon in a tiny tie announces a mandatory rebrand.",
      twist: "Every corporate cliché becomes legally binding.",
      mission: "Finish the agenda without accidentally promising infinite growth.",
      choices: ["Circle back aggressively", "Unionize the slideshow", "Promote the coffee machine"],
      heat: 31,
      finale: "",
    },
    {
      headline: "ACT II — THE DECK HAS 900 SLIDES",
      directorLine: "Slide 438 reveals the company has been profitable only on alternate Tuesdays.",
      twist: "The intern owns 51% of the company through a forgotten loyalty program.",
      mission: "Negotiate a future before the next slide loads.",
      choices: ["Crown the intern", "Delete Tuesday", "Launch a loyalty coup"],
      heat: 67,
      finale: "",
    },
    {
      headline: "ACT III — PERFORMANCE REVIEW",
      directorLine: "The building locks down. The new CEO demands one employee be named Human of the Quarter.",
      twist: "The award includes ownership of the company’s haunted printer.",
      mission: "Make a final pitch that saves the team and ends the meeting.",
      choices: ["Nominate the printer", "Stage a merger with lunch", "Confess everything on Reply All"],
      heat: 94,
      finale: "",
    },
  ],
  wedding: [
    {
      headline: "ACT I — SOMETHING BORROWED, SOMEONE SUSPICIOUS",
      directorLine: "The music starts, but the ring box contains a subway token and a handwritten apology.",
      twist: "The apology is dated tomorrow.",
      mission: "Keep the guests entertained while you find the first clue.",
      choices: ["Question the cake", "Begin the dance early", "Follow the nervous doves"],
      heat: 24,
      finale: "",
    },
    {
      headline: "ACT II — THE TOAST KNOWS TOO MUCH",
      directorLine: "A champagne glass projects a tiny map across the ceiling. It points under the head table.",
      twist: "The wedding venue is slowly moving out to sea.",
      mission: "Find the rings before anybody notices the coastline disappearing.",
      choices: ["Turn vows into coordinates", "Interrogate the band", "Ask the ex to steer"],
      heat: 61,
      finale: "",
    },
    {
      headline: "ACT III — SPEAK NOW",
      directorLine: "The rings drop from the chandelier. So does a second wedding invitation with everyone’s names on it.",
      twist: "The cake planned the entire mystery to stop itself from being eaten.",
      mission: "Choose how this impossible ceremony ends.",
      choices: ["Marry the mystery", "Free the cake", "Turn the reception into a trial"],
      heat: 89,
      finale: "",
    },
  ],
};

function rolesFor(players: string[], theme: ThemeId): RoleCard[] {
  return players.map((player, index) => ({
    player,
    publicRole: ROLE_SETS[theme][index % ROLE_SETS[theme].length][0],
    secretObjective: ROLE_SETS[theme][index % ROLE_SETS[theme].length][1],
  }));
}

function awardsFor(players: string[], history: string[]): AwardCard[] {
  const titles = ["Best Improvised Alibi", "Main Character Energy", "Most Suspiciously Helpful", "Chaos MVP", "Perfectly Normal Behavior", "Plot Armor Award"];
  return players.map((player, index) => ({
    player,
    title: titles[index % titles.length],
    reason: index === 0 && history.length ? `For committing completely to “${history.at(-1)}”.` : "For making the director rewrite at least three scenes.",
  }));
}

export function storyPackDirector(request: DirectorRequest): DirectorBeat {
  if (request.action === "finale") {
    return {
      ...BEATS[request.theme][2],
      headline: "THAT’S A WRAP",
      directorLine: "Against budget, logic, and several laws of storytelling, the cast reaches the final shot.",
      twist: "The credits reveal this was the audition. You all got the part.",
      mission: "Take a bow. Argue about the sequel on the way home.",
      choices: ["Demand a sequel", "Blame the director", "Release the blooper reel"],
      heat: 100,
      roles: [],
      finale: `The cast chose ${request.history.at(-1) ?? "pure chaos"}, saved absolutely no one, and somehow delivered the year’s most watchable ending.`,
      awards: awardsFor(request.players, request.history),
      source: "story-pack",
    };
  }

  const beat = BEATS[request.theme][Math.min(request.act, 2)];
  const moveEcho = request.playerMove
    ? ` The director accepts “${request.playerMove}” and immediately makes it everyone’s problem.`
    : "";

  return {
    ...beat,
    directorLine: `${beat.directorLine}${moveEcho}`,
    roles: request.action === "start" ? rolesFor(request.players, request.theme) : [],
    awards: [],
    source: "story-pack",
  };
}

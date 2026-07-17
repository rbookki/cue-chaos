import type {
  AwardCard,
  DirectorBeat,
  DirectorRequest,
  Locale,
  RoleCard,
  ThemeId,
} from "./game-types";

/**
 * Pre-generated story-room material authored directly with Codex for Build Week.
 * Runtime gameplay only remixes these committed packs; it never calls a model API.
 */

type Copy = Record<Locale, string>;

type PackedRole = {
  role: Copy;
  objective: Copy;
};

type PackedBeat = {
  headline: Copy;
  directorLine: Copy;
  twist: Copy;
  mission: Copy;
  choices: [Copy, Copy, Copy];
  heat: number;
};

type StoryPack = {
  roles: PackedRole[];
  beats: [PackedBeat, PackedBeat, PackedBeat];
  finale: Copy;
  awardTitles: Copy[];
};

const c = (en: string, zh: string): Copy => ({ en, zh });

const STORY_PACKS: Record<ThemeId, StoryPack> = {
  heist: {
    roles: [
      { role: c("The Mastermind", "行动策划师"), objective: c("Get someone else to say “butter” before the vault opens.", "在保险库打开前，诱导别人说出“黄油”。") },
      { role: c("The Inside Baker", "烘焙内应"), objective: c("Protect the croissant while convincing everyone you want to steal it.", "保护牛角包，同时让所有人以为你想偷走它。") },
      { role: c("The Getaway Driver", "逃跑司机"), objective: c("Convince the crew that your bicycle is a high-tech escape vehicle.", "说服团队相信你的自行车是高科技逃生载具。") },
      { role: c("The Double Agent", "双面特工"), objective: c("Secretly make the alarm sound useful.", "偷偷把警报声解释成对计划有帮助。") },
      { role: c("The Critic", "美食评论家"), objective: c("Review every disaster as if it were fine dining.", "把每一次灾难都当成高级餐厅体验来点评。") },
      { role: c("The Tourist", "迷路游客"), objective: c("Take credit for the plan without understanding any of it.", "完全没听懂计划，却要抢走全部功劳。") },
    ],
    beats: [
      {
        headline: c("THE BLUEPRINT IS A MENU", "蓝图其实是菜单"),
        directorLine: c("The museum closes in eight minutes. Your blueprint lists soup, salad, and one alarmingly expensive croissant.", "博物馆八分钟后闭馆。你们的行动蓝图上只有汤、沙拉，以及一个贵得离谱的牛角包。"),
        twist: c("The vault only opens when it hears a sincere compliment.", "保险库只有听到真诚赞美才会打开。"),
        mission: c("Get inside without revealing who actually understands the plan.", "潜入内部，同时别暴露到底谁真正看懂了计划。"),
        choices: [c("Compliment the vault", "真诚赞美保险库"), c("Pose as food critics", "假扮美食评论家"), c("Start an elegant distraction", "制造优雅的骚乱")],
        heat: 28,
      },
      {
        headline: c("THE PASTRY MOVES", "目标自己跑了"),
        directorLine: c("The glass case is empty. Tiny golden crumbs form an arrow toward the dinosaur exhibit.", "玻璃展柜空空如也。金色碎屑排成箭头，一路指向恐龙展厅。"),
        twist: c("The croissant is sentient, fast, and deeply offended by the reviews.", "牛角包有自我意识、速度极快，而且被刚才的评价深深冒犯。"),
        mission: c("Catch the target while keeping the night guard on your side.", "抓住目标，同时让夜班保安继续站在你们这边。"),
        choices: [c("Offer a peace treaty", "提出和平条约"), c("Ride the dinosaur skeleton", "骑上恐龙骨架"), c("Frame the vending machine", "嫁祸自动售货机")],
        heat: 63,
      },
      {
        headline: c("ONE LAST BITE", "最后一口"),
        directorLine: c("Sunrise hits the skylight. The croissant stands on the roof and demands creative control.", "晨光穿过天窗。牛角包站在屋顶边缘，要求获得整部电影的创作控制权。"),
        twist: c("Your client is the croissant’s estranged twin.", "雇主竟然是牛角包多年失散的双胞胎。"),
        mission: c("Choose loyalty, money, or breakfast before the police arrive.", "在警察赶到前，从忠诚、金钱和早餐中选一个。"),
        choices: [c("Reunite the pastries", "让兄弟俩团聚"), c("Fake the perfect heist", "伪造完美劫案"), c("Eat the evidence together", "一起吃掉证据")],
        heat: 91,
      },
    ],
    finale: c("After {moves}, the crew saves absolutely no one and somehow delivers the year’s most watchable heist.", "在{moves}之后，团队谁也没救成，却意外拍出了年度最好看的劫案电影。"),
    awardTitles: [c("Best Improvised Alibi", "最佳即兴不在场证明"), c("Chaos MVP", "混乱 MVP"), c("Most Suspiciously Helpful", "最可疑热心市民"), c("Plot Armor Award", "主角光环奖"), c("Perfectly Normal Behavior", "行为十分正常奖"), c("Pastry Whisperer", "牛角包沟通大师")],
  },
  office: {
    roles: [
      { role: c("Acting CEO", "代理 CEO"), objective: c("Use “strategic synergy” to hide that you have no plan.", "用“战略协同”掩盖你其实毫无计划。") },
      { role: c("Mascot Handler", "吉祥物管理员"), objective: c("Hide that the CEO is three raccoons in a suit.", "阻止大家发现 CEO 其实是三只穿西装的浣熊。") },
      { role: c("Reply-All Survivor", "全员回复幸存者"), objective: c("Get the meeting cancelled without directly asking.", "在不直接提议的情况下让会议取消。") },
      { role: c("HR Oracle", "人力资源先知"), objective: c("Turn one absurd sentence into official company policy.", "把一句荒唐的话变成正式公司制度。") },
      { role: c("Intern of Destiny", "天选实习生"), objective: c("Accidentally become the most qualified person in the room.", "不小心成为会议室里最有资格的人。") },
      { role: c("Venture Capitalist", "风险投资人"), objective: c("Invest in the worst idea anyone mentions.", "投资现场出现的最糟糕创意。") },
    ],
    beats: [
      {
        headline: c("THIS COULD HAVE BEEN AN EMAIL", "这事本可以发邮件"),
        directorLine: c("The projector turns on by itself. A raccoon in a tiny tie announces a mandatory rebrand.", "投影仪自行启动。一只系着迷你领带的浣熊宣布公司必须立刻品牌升级。"),
        twist: c("Every corporate cliché becomes legally binding.", "所有职场套话说出口后都会产生法律效力。"),
        mission: c("Finish the agenda without promising infinite growth.", "开完议程，同时避免承诺公司无限增长。"),
        choices: [c("Circle back aggressively", "强势稍后跟进"), c("Unionize the slideshow", "让幻灯片成立工会"), c("Promote the coffee machine", "提拔咖啡机")],
        heat: 31,
      },
      {
        headline: c("THE DECK HAS 900 SLIDES", "方案共有九百页"),
        directorLine: c("Slide 438 reveals the company has only been profitable on alternate Tuesdays.", "第 438 页显示，公司只在隔周周二实现过盈利。"),
        twist: c("The intern owns 51% of the company through a forgotten loyalty program.", "实习生通过被遗忘的积分计划持有公司 51% 股份。"),
        mission: c("Negotiate a future before the next slide loads.", "在下一页加载完成前谈出公司的未来。"),
        choices: [c("Crown the intern", "拥立实习生"), c("Delete Tuesday", "删除星期二"), c("Launch a loyalty coup", "发动积分政变")],
        heat: 67,
      },
      {
        headline: c("PERFORMANCE REVIEW", "年度绩效面谈"),
        directorLine: c("The building locks down. The new CEO demands one employee be named Human of the Quarter.", "办公楼突然封锁。新 CEO 要求选出一名“季度最佳人类”。"),
        twist: c("The award includes ownership of the company’s haunted printer.", "奖品包括公司那台闹鬼打印机的永久所有权。"),
        mission: c("Make one final pitch that saves the team and ends the meeting.", "做最后一次陈述，既要拯救团队，也要结束会议。"),
        choices: [c("Nominate the printer", "提名打印机"), c("Merge with lunch", "与午餐业务合并"), c("Confess on Reply All", "向全员回复一切")],
        heat: 94,
      },
    ],
    finale: c("After {moves}, the meeting finally ends. The minutes list every disaster as an approved action item.", "在{moves}之后，会议终于结束。会议纪要却把所有灾难都列成了已批准行动项。"),
    awardTitles: [c("Main Character Energy", "全场主角奖"), c("Meeting Escape Artist", "会议逃生大师"), c("Synergy Champion", "协同冠军"), c("Chaos MVP", "混乱 MVP"), c("Best Corporate Face", "最佳职场表情管理"), c("Printer’s Choice", "打印机选择奖")],
  },
  wedding: {
    roles: [
      { role: c("Best Friend", "头号好友"), objective: c("Delay the ceremony until you learn who replaced the rings.", "拖延仪式，直到查出是谁调换了戒指。") },
      { role: c("Suspicious Florist", "可疑花艺师"), objective: c("Make everyone compliment the flowers while hiding one clue.", "让所有人称赞鲜花，同时藏起一条线索。") },
      { role: c("The Ex", "突然出现的前任"), objective: c("Prove you came for the cake, not the drama.", "证明你是为蛋糕而来，而不是来看热闹。") },
      { role: c("Wedding Detective", "婚礼侦探"), objective: c("Accuse the least suspicious object in the room.", "指控现场最不可疑的物品。") },
      { role: c("Cousin With A Plan", "有计划的表亲"), objective: c("Turn the crisis into a dance number.", "把整场危机变成一段歌舞表演。") },
      { role: c("Cake Whisperer", "蛋糕翻译官"), objective: c("Translate one message from the cake without admitting it talks.", "翻译蛋糕传来的一条信息，但不能承认它会说话。") },
    ],
    beats: [
      {
        headline: c("SOMEONE SUSPICIOUS", "可疑来宾已经入场"),
        directorLine: c("The music starts, but the ring box contains a subway token and a handwritten apology.", "音乐响起，戒指盒里却只有一枚地铁代币和一封手写道歉信。"),
        twist: c("The apology is dated tomorrow.", "道歉信的日期竟然是明天。"),
        mission: c("Keep the guests entertained while finding the first clue.", "稳住宾客，同时找到第一条线索。"),
        choices: [c("Question the cake", "审问婚礼蛋糕"), c("Begin the dance early", "提前开始跳舞"), c("Follow the nervous doves", "跟踪紧张的鸽子")],
        heat: 24,
      },
      {
        headline: c("THE TOAST KNOWS TOO MUCH", "祝酒词知道得太多"),
        directorLine: c("A champagne glass projects a tiny map across the ceiling. It points under the head table.", "香槟杯在天花板上投出一张小地图，箭头直指主桌下方。"),
        twist: c("The wedding venue is slowly moving out to sea.", "婚礼场地正在缓慢驶向大海。"),
        mission: c("Find the rings before anybody notices the coastline disappearing.", "在宾客发现海岸线消失前找回戒指。"),
        choices: [c("Turn vows into coordinates", "把誓词变成坐标"), c("Interrogate the band", "盘问婚礼乐队"), c("Ask the ex to steer", "让前任掌舵")],
        heat: 61,
      },
      {
        headline: c("SPEAK NOW", "现在请发言"),
        directorLine: c("The rings drop from the chandelier, followed by a second invitation bearing everyone’s names.", "戒指从吊灯上落下，紧接着又掉下一封写着所有人名字的第二份婚礼请柬。"),
        twist: c("The cake planned the mystery to stop itself from being eaten.", "整场谜案都是蛋糕策划的，它只是不想被吃掉。"),
        mission: c("Choose how this impossible ceremony ends.", "决定这场不可能婚礼该如何收场。"),
        choices: [c("Marry the mystery", "与谜案结婚"), c("Free the cake", "释放蛋糕"), c("Put the reception on trial", "审判婚宴")],
        heat: 89,
      },
    ],
    finale: c("After {moves}, the guests applaud, the cake escapes, and nobody can agree who actually got married.", "在{moves}之后，宾客热烈鼓掌、蛋糕成功逃跑，却没人说得清到底是谁结了婚。"),
    awardTitles: [c("Best Dramatic Entrance", "最佳戏剧性登场"), c("Most Eligible Suspect", "最具魅力嫌疑人"), c("Cake’s Best Friend", "蛋糕最佳好友"), c("Chaos MVP", "混乱 MVP"), c("Master of Ceremonies", "婚礼控场大师"), c("Plot Twist of Honor", "荣誉反转制造者")],
  },
  space: {
    roles: [
      { role: c("Night Manager", "夜班经理"), objective: c("Hide that the motel has never had a roof.", "隐瞒这家旅馆从开业起就没有屋顶。") },
      { role: c("Alien Reviewer", "外星差评师"), objective: c("Mention “atmosphere” three times without revealing you breathe soup.", "在不暴露自己靠汤呼吸的情况下，三次提到“氛围”。") },
      { role: c("Time-Share Salesperson", "月球产权销售"), objective: c("Sell someone a crater that technically belongs to the moon.", "把一个理论上属于月球的陨石坑卖给别人。") },
      { role: c("Runaway Astronaut", "离家出走的宇航员"), objective: c("Convince the lobby that Earth is your emotional support planet.", "说服所有人相信地球是你的情绪支持星球。") },
      { role: c("Cosmic Bellhop", "宇宙行李员"), objective: c("Deliver a suitcase to the wrong century on purpose.", "故意把一只行李箱送到错误的世纪。") },
      { role: c("Moon Inspector", "月球质检员"), objective: c("Find one regulation that only exists in zero gravity.", "找出一条只在零重力环境成立的规定。") },
    ],
    beats: [
      {
        headline: c("NO VACANCY IN THIS TIMELINE", "本时间线客满"),
        directorLine: c("At midnight, every room key begins humming the same breakup song.", "午夜时分，所有房卡突然同时哼起同一首失恋歌曲。"),
        twist: c("Room 8 has checked in from tomorrow and refuses to leave yesterday.", "8 号房从明天办理入住，却拒绝离开昨天。"),
        mission: c("Complete check-in before gravity changes shifts.", "在重力交班前完成所有入住手续。"),
        choices: [c("Upgrade the timeline", "升级客人的时间线"), c("Bribe gravity", "贿赂重力"), c("Call interplanetary housekeeping", "呼叫星际客房服务")],
        heat: 29,
      },
      {
        headline: c("THE MINIBAR IS A PORTAL", "迷你吧台是传送门"),
        directorLine: c("A guest opens the minibar and discovers a beach resort orbiting Saturn.", "一位客人打开迷你吧台，发现里面藏着一家环绕土星运行的海滩度假村。"),
        twist: c("Every snack removed erases one embarrassing memory.", "每拿走一份零食，就会抹掉一段尴尬记忆。"),
        mission: c("Close the portal before the motel loses its entire backstory.", "在旅馆失去全部背景故事前关闭传送门。"),
        choices: [c("Eat the evidence", "吃掉证据"), c("Franchise the portal", "加盟传送门生意"), c("Refund the universe", "给宇宙办理退款")],
        heat: 66,
      },
      {
        headline: c("LAST CHECKOUT", "宇宙最后退房"),
        directorLine: c("The moon announces it is leaving orbit and taking the motel’s deposit with it.", "月球宣布即将脱离轨道，而且要带走旅馆全部押金。"),
        twist: c("The motel is the only thing keeping the universe’s five-star rating alive.", "这家旅馆竟然是宇宙维持五星评分的唯一希望。"),
        mission: c("Save the rating, the moon, or at least the complimentary breakfast.", "拯救评分、月球，或者至少保住免费早餐。"),
        choices: [c("Negotiate with the moon", "与月球谈判"), c("Move the motel to Earth", "把旅馆搬去地球"), c("Fake a five-star review", "伪造五星好评")],
        heat: 93,
      },
    ],
    finale: c("After {moves}, the moon stays for one more night. The universe leaves a five-star review with several concerns.", "在{moves}之后，月球同意再住一晚。宇宙留下五星好评，同时提出了若干严重关切。"),
    awardTitles: [c("Best Zero-Gravity Recovery", "最佳零重力救场"), c("Guest of the Millennium", "千年最佳住客"), c("Cosmic Chaos MVP", "宇宙混乱 MVP"), c("Most Likely to Own a Moon", "最可能拥有月球奖"), c("Five-Star Face", "五星表情管理"), c("Timeline Survivor", "时间线幸存者")],
  },
};

const REMIXES: Record<Locale, Array<{ twist: string; mission: string }>> = {
  en: [
    { twist: "Your last move is now legally binding.", mission: "Make it look intentional." },
    { twist: "Someone off-screen has copied your exact move.", mission: "Find the copycat without breaking character." },
    { twist: "The room has voted your move the official plan.", mission: "Escalate it before anyone regains common sense." },
    { twist: "A witness has misunderstood your move in the worst possible way.", mission: "Use the misunderstanding as an advantage." },
  ],
  zh: [
    { twist: "你刚才的行动现在产生了法律效力。", mission: "想办法让它看起来像故意安排。" },
    { twist: "画面外有人完整模仿了你刚才的行动。", mission: "在不出戏的情况下找出模仿者。" },
    { twist: "全场投票把你刚才的行动定为正式计划。", mission: "趁大家恢复理智前把它继续升级。" },
    { twist: "一名目击者用最糟糕的方式误解了你的行动。", mission: "把这个误会变成优势。" },
  ],
};

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function rotate<T>(items: T[], offset: number): T[] {
  const normalized = items.length ? offset % items.length : 0;
  return [...items.slice(normalized), ...items.slice(0, normalized)];
}

function rolesFor(request: DirectorRequest): RoleCard[] {
  const roles = STORY_PACKS[request.theme].roles;
  const ordered = rotate(roles, hash(`${request.sessionSeed}:${request.theme}`) % roles.length);
  return request.players.map((player, index) => ({
    player,
    publicRole: ordered[index % ordered.length].role[request.locale],
    secretObjective: ordered[index % ordered.length].objective[request.locale],
  }));
}

function awardsFor(request: DirectorRequest): AwardCard[] {
  const titles = rotate(
    STORY_PACKS[request.theme].awardTitles,
    hash(`${request.sessionSeed}:awards`) % STORY_PACKS[request.theme].awardTitles.length,
  );

  return request.players.map((player, index) => {
    const move = request.history[index % Math.max(1, request.history.length)];
    return {
      player,
      title: titles[index % titles.length][request.locale],
      reason: move
        ? request.locale === "zh"
          ? `因为把“${move}”演成了本场最难忘的名场面。`
          : `For turning “${move}” into the night’s most unforgettable moment.`
        : request.locale === "zh"
          ? "因为让整个故事至少三次偏离正常轨道。"
          : "For sending the story off its normal rails at least three times.",
    };
  });
}

function moveSummary(request: DirectorRequest): string {
  const moves = request.history.slice(-3);
  if (!moves.length) return request.locale === "zh" ? "一连串无法解释的决定" : "a series of unexplained decisions";
  if (request.locale === "zh") return moves.map((move) => `“${move}”`).join("、");
  return moves.map((move) => `“${move}”`).join(", then ");
}

export function storyPackDirector(request: DirectorRequest): DirectorBeat {
  const pack = STORY_PACKS[request.theme];

  if (request.action === "finale") {
    const summary = moveSummary(request);
    return {
      headline: request.locale === "zh" ? "正式杀青" : "THAT’S A WRAP",
      directorLine: request.locale === "zh"
        ? "在预算、逻辑和多条叙事规则都失守后，全体演员抵达最后一个镜头。"
        : "Against budget, logic, and several laws of storytelling, the cast reaches the final shot.",
      twist: request.locale === "zh" ? "字幕显示：刚才其实是试镜，而你们全都被录取了。" : "The credits reveal this was the audition. You all got the part.",
      mission: request.locale === "zh" ? "谢幕。回家路上继续争论续集。" : "Take a bow. Argue about the sequel on the way home.",
      choices: request.locale === "zh"
        ? ["要求拍摄续集", "把责任推给导演", "公开全部花絮"]
        : ["Demand a sequel", "Blame the director", "Release the blooper reel"],
      heat: 100,
      roles: [],
      finale: pack.finale[request.locale].replace("{moves}", summary),
      awards: awardsFor(request),
      source: "story-pack",
      variant: hash(`${request.sessionSeed}:finale`) % 4,
    };
  }

  const act = Math.max(0, Math.min(request.act, 2));
  const packedBeat = pack.beats[act];
  const variant = hash(`${request.sessionSeed}:${act}:${request.playerMove ?? "opening"}`) % REMIXES[request.locale].length;
  const remix = request.playerMove ? REMIXES[request.locale][variant] : null;
  const choiceOffset = hash(`${request.sessionSeed}:choices:${act}`) % packedBeat.choices.length;
  const choices = rotate(packedBeat.choices, choiceOffset).map((choice) => choice[request.locale]) as DirectorBeat["choices"];
  const callback = request.playerMove
    ? request.locale === "zh"
      ? ` 导演接受了“${request.playerMove}”，并立刻让它变成所有人的麻烦。`
      : ` The director accepts “${request.playerMove}” and immediately makes it everyone’s problem.`
    : "";

  return {
    headline: packedBeat.headline[request.locale],
    directorLine: `${packedBeat.directorLine[request.locale]}${callback}`,
    twist: remix ? `${packedBeat.twist[request.locale]} ${remix.twist}` : packedBeat.twist[request.locale],
    mission: remix ? `${packedBeat.mission[request.locale]} ${remix.mission}` : packedBeat.mission[request.locale],
    choices,
    heat: packedBeat.heat + variant,
    roles: request.action === "start" ? rolesFor(request) : [],
    finale: "",
    awards: [],
    source: "story-pack",
    variant,
  };
}

import type {
  ChaosChoice,
  ChaosRound,
  ChoiceId,
  Locale,
  SabotageGame,
  SabotageGameRequest,
  SecretCard,
  ThemeId,
} from "./game-types";

/**
 * Bilingual social-deduction packs authored directly with Codex.
 * The deployed game only reads and shuffles this committed data.
 */

type Copy = Record<Locale, string>;
type PackedChoice = { id: ChoiceId; label: Copy; consequence: Copy; chaos: number };
type PackedRound = { headline: Copy; situation: Copy; question: Copy; choices: [PackedChoice, PackedChoice, PackedChoice] };
type DeductionPack = { roles: Copy[]; rounds: [PackedRound, PackedRound, PackedRound] };

const c = (en: string, zh: string): Copy => ({ en, zh });
const choice = (id: ChoiceId, en: string, zh: string, consequenceEn: string, consequenceZh: string, chaos: number): PackedChoice => ({
  id,
  label: c(en, zh),
  consequence: c(consequenceEn, consequenceZh),
  chaos,
});

const PACKS: Record<ThemeId, DeductionPack> = {
  heist: {
    roles: [c("Mastermind", "行动策划师"), c("Inside Baker", "烘焙内应"), c("Getaway Driver", "逃跑司机"), c("Security Expert", "安保专家"), c("Food Critic", "美食评论家"), c("Lost Tourist", "迷路游客")],
    rounds: [
      {
        headline: c("THE BLUEPRINT IS A MENU", "蓝图其实是菜单"),
        situation: c("The museum closes in eight minutes. The blueprint lists soup, salad, and one priceless croissant.", "博物馆八分钟后闭馆。行动蓝图上只有汤、沙拉和一个无价牛角包。"),
        question: c("How does the crew enter?", "团队应该如何潜入？"),
        choices: [
          choice("A", "Pose as food critics", "假扮美食评论家", "The guard asks for a reservation but lets the crew into the dining wing.", "保安要求出示预约，但还是让团队进入了餐饮展区。", 12),
          choice("B", "Compliment the vault", "真诚赞美保险库", "The vault blushes, opens, and immediately sounds a very emotional alarm.", "保险库害羞地打开，同时触发了一场非常情绪化的警报。", 30),
          choice("C", "Hide inside the catering cart", "藏进餐车", "The crew reaches the service corridor with only minor soup damage.", "团队顺利抵达后勤通道，只受到轻微汤类损伤。", 7),
        ],
      },
      {
        headline: c("THE TARGET HAS LEGS", "目标长出了腿"),
        situation: c("The croissant escapes its glass case and sprints toward the dinosaur exhibit.", "牛角包冲出玻璃展柜，飞奔向恐龙展厅。"),
        question: c("How do you catch it?", "你们要怎么抓住它？"),
        choices: [
          choice("A", "Offer a pastry peace treaty", "提出糕点和平条约", "The croissant agrees to negotiations and demands legal representation.", "牛角包同意谈判，并要求获得法律代表。", 11),
          choice("B", "Ride the dinosaur skeleton", "骑上恐龙骨架", "The skeleton collapses into a surprisingly fast getaway vehicle.", "恐龙骨架倒塌后，意外变成一辆高速逃生载具。", 33),
          choice("C", "Seal the exits", "封锁所有出口", "The target is contained, though it starts recruiting the gift-shop muffins.", "目标被成功控制，但开始招募纪念品商店里的松饼。", 9),
        ],
      },
      {
        headline: c("ONE LAST BITE", "最后一口"),
        situation: c("On the roof, the croissant demands creative control and half the profits.", "屋顶上，牛角包要求获得创作控制权和一半利润。"),
        question: c("How does the heist end?", "这场劫案如何收场？"),
        choices: [
          choice("A", "Fake the perfect robbery", "伪造完美劫案", "Everyone leaves with a flawless alibi and a suspicious amount of butter.", "所有人带着完美不在场证明和数量可疑的黄油离开。", 16),
          choice("B", "Eat the evidence", "吃掉全部证据", "The evidence fights back. The police arrive during dessert.", "证据开始反击，警察在甜点时间赶到。", 36),
          choice("C", "Give the croissant a producer credit", "给牛角包制片人署名", "The target signs the contract and schedules a sequel.", "目标签下合同，并立刻安排续集。", 8),
        ],
      },
    ],
  },
  office: {
    roles: [c("Acting CEO", "代理 CEO"), c("Mascot Handler", "吉祥物管理员"), c("Reply-All Survivor", "全员回复幸存者"), c("HR Oracle", "人力资源先知"), c("Intern of Destiny", "天选实习生"), c("Venture Capitalist", "风险投资人")],
    rounds: [
      {
        headline: c("THIS COULD HAVE BEEN AN EMAIL", "这事本可以发邮件"),
        situation: c("A raccoon in a tiny tie announces that the company needs an immediate rebrand.", "一只系着迷你领带的浣熊宣布公司必须立刻品牌升级。"),
        question: c("What should the team approve?", "团队应该批准什么？"),
        choices: [
          choice("A", "Promote the coffee machine", "提拔咖啡机", "The coffee machine accepts and schedules one-on-ones with everyone.", "咖啡机接受提拔，并为每个人安排了一对一谈话。", 18),
          choice("B", "Let the raccoon present", "让浣熊做汇报", "Two more raccoons join the board and expense a small yacht.", "另外两只浣熊加入董事会，并报销了一艘小型游艇。", 34),
          choice("C", "Request a written proposal", "要求提交书面方案", "The meeting pauses while the raccoon learns PowerPoint.", "会议暂时休会，等待浣熊学会 PowerPoint。", 6),
        ],
      },
      {
        headline: c("THE DECK HAS 900 SLIDES", "方案共有九百页"),
        situation: c("Slide 438 reveals the intern owns 51% of the company through a loyalty program.", "第 438 页显示，实习生通过积分计划持有公司 51% 股份。"),
        question: c("Who takes control?", "现在谁来接管公司？"),
        choices: [
          choice("A", "Crown the intern", "拥立实习生", "The intern cancels Fridays and becomes instantly popular.", "实习生取消了星期五，并立刻赢得所有人支持。", 12),
          choice("B", "Delete Tuesday from the calendar", "从日历中删除星期二", "Payroll, gravity, and the legal department stop working every seven days.", "工资系统、重力和法务部开始每七天停工一次。", 35),
          choice("C", "Audit the loyalty points", "审计全部积分", "The company discovers it is technically owned by a sandwich shop.", "公司发现自己在法律上属于一家三明治店。", 9),
        ],
      },
      {
        headline: c("PERFORMANCE REVIEW", "年度绩效面谈"),
        situation: c("The building locks down until someone is named Human of the Quarter.", "办公楼突然封锁，必须选出一名“季度最佳人类”才能解锁。"),
        question: c("Who gets the award?", "这个奖应该颁给谁？"),
        choices: [
          choice("A", "Nominate the haunted printer", "提名闹鬼打印机", "The printer wins, fires management, and prints its own contract.", "打印机获胜，解雇管理层，并打印了自己的合同。", 32),
          choice("B", "Give everyone the award", "给所有人颁奖", "The doors open, but every employee now expects a corner office.", "大门成功打开，但每位员工都要求获得独立办公室。", 15),
          choice("C", "Ask for an external judge", "请外部评委决定", "The food-delivery courier makes a fair decision in under a minute.", "外卖员不到一分钟就做出了公平决定。", 7),
        ],
      },
    ],
  },
  wedding: {
    roles: [c("Best Friend", "头号好友"), c("Suspicious Florist", "可疑花艺师"), c("The Ex", "突然出现的前任"), c("Wedding Detective", "婚礼侦探"), c("Cousin With A Plan", "有计划的表亲"), c("Cake Whisperer", "蛋糕翻译官")],
    rounds: [
      {
        headline: c("THE RINGS ARE GONE", "戒指不见了"),
        situation: c("The ring box contains a subway token and an apology dated tomorrow.", "戒指盒里只有一枚地铁代币，以及一封日期写着明天的道歉信。"),
        question: c("Where do you search first?", "应该先搜索哪里？"),
        choices: [
          choice("A", "Question the cake", "审问婚礼蛋糕", "The cake requests immunity and points a frosting arrow at the band.", "蛋糕要求获得豁免，并用奶油画出一个指向乐队的箭头。", 13),
          choice("B", "Release the nervous doves", "放飞紧张的鸽子", "The doves steal every guest’s jewelry and form a tiny airborne cartel.", "鸽子偷走所有宾客的首饰，组建了一个小型空中犯罪集团。", 34),
          choice("C", "Check the seating chart", "检查座位表", "A hidden acrostic reveals the first clue under table seven.", "座位表中的藏头信息指向七号桌下的第一条线索。", 6),
        ],
      },
      {
        headline: c("THE VENUE IS MOVING", "婚礼场地正在移动"),
        situation: c("A champagne map reveals the entire venue is slowly sailing out to sea.", "香槟投影出的地图显示，整个婚礼场地正在缓慢驶向大海。"),
        question: c("Who should steer?", "应该让谁掌舵？"),
        choices: [
          choice("A", "Trust the wedding planner", "相信婚礼策划师", "The planner produces a nautical backup plan and matching life jackets.", "策划师拿出航海备用方案和配套救生衣。", 8),
          choice("B", "Let the ex take the wheel", "让前任掌舵", "The venue accelerates toward a second, even more awkward wedding.", "场地开始加速驶向另一场更加尴尬的婚礼。", 33),
          choice("C", "Ask the band for directions", "向乐队问路", "The band changes key and navigates by rhythm.", "乐队通过转调开始用节奏导航。", 15),
        ],
      },
      {
        headline: c("SPEAK NOW", "现在请发言"),
        situation: c("The rings fall from the chandelier, followed by invitations bearing everyone’s names.", "戒指从吊灯上落下，随后又掉下写着所有人名字的婚礼请柬。"),
        question: c("How does the ceremony end?", "婚礼应该如何收场？"),
        choices: [
          choice("A", "Free the cake", "释放蛋糕", "The cake escapes in a limousine and leaves a five-star review.", "蛋糕乘豪华轿车逃走，并留下五星好评。", 10),
          choice("B", "Marry everyone at once", "让所有人一起结婚", "The paperwork achieves consciousness and demands its own reception.", "婚姻文件产生自我意识，并要求举办自己的婚宴。", 36),
          choice("C", "Pause for an investigation", "暂停仪式展开调查", "The detective solves the mystery before the DJ finds another song.", "侦探在 DJ 找到下一首歌前破解了谜案。", 7),
        ],
      },
    ],
  },
  space: {
    roles: [c("Night Manager", "夜班经理"), c("Alien Reviewer", "外星差评师"), c("Time-Share Salesperson", "月球产权销售"), c("Runaway Astronaut", "离家宇航员"), c("Cosmic Bellhop", "宇宙行李员"), c("Moon Inspector", "月球质检员")],
    rounds: [
      {
        headline: c("NO VACANCY IN THIS TIMELINE", "本时间线客满"),
        situation: c("Room 8 checks in from tomorrow and refuses to leave yesterday.", "8 号房从明天办理入住，却拒绝离开昨天。"),
        question: c("How do you handle the booking?", "应该怎么处理这笔预订？"),
        choices: [
          choice("A", "Upgrade the timeline", "升级客人的时间线", "The guest accepts a future-facing suite with no present-day bathroom.", "客人接受了一间面向未来、但今天没有浴室的套房。", 14),
          choice("B", "Bribe gravity", "贿赂重力", "Gravity takes the money and switches off every staircase.", "重力收下钱，并关闭了所有楼梯。", 35),
          choice("C", "Call temporal support", "呼叫时间客服", "Support resolves the paradox after a brief 400-year hold.", "客服在短暂等待四百年后解决了悖论。", 8),
        ],
      },
      {
        headline: c("THE MINIBAR IS A PORTAL", "迷你吧台是传送门"),
        situation: c("Every snack removed from the minibar erases one embarrassing memory.", "每从迷你吧台拿走一份零食，就会抹掉一段尴尬记忆。"),
        question: c("What do you do with the portal?", "应该如何处理传送门？"),
        choices: [
          choice("A", "Lock the minibar", "锁上迷你吧台", "The memories stabilize, but room service files a complaint.", "记忆恢复稳定，但客房服务部门提出投诉。", 6),
          choice("B", "Eat the evidence", "吃掉全部证据", "The staff forgets the motel, their jobs, and the concept of doors.", "员工忘记了旅馆、工作以及门这个概念。", 37),
          choice("C", "Charge admission", "开始收取门票", "Tourists arrive from six centuries and leave mixed reviews.", "来自六个世纪的游客蜂拥而至，并留下褒贬不一的评论。", 18),
        ],
      },
      {
        headline: c("LAST CHECKOUT", "宇宙最后退房"),
        situation: c("The moon announces it is leaving orbit and taking the motel’s deposit.", "月球宣布即将脱离轨道，而且要带走旅馆全部押金。"),
        question: c("How do you stop it?", "你们要如何阻止月球？"),
        choices: [
          choice("A", "Negotiate a late checkout", "协商延迟退房", "The moon stays one more night in exchange for free breakfast.", "月球同意再住一晚，条件是提供免费早餐。", 9),
          choice("B", "Move the motel to Earth", "把旅馆搬去地球", "The motel lands in a suburban parking lot during rush hour.", "旅馆在晚高峰期间降落在一处郊区停车场。", 32),
          choice("C", "Post a fake five-star review", "发布虚假五星好评", "The universe notices the fraud and sends an inspector made of light.", "宇宙发现造假，并派来一位由光组成的检查员。", 20),
        ],
      },
    ],
  },
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

function localizeRound(round: PackedRound, locale: Locale, seed: string, index: number): ChaosRound {
  const ordered = rotate(round.choices, hash(`${seed}:choices:${index}`) % round.choices.length);
  return {
    headline: round.headline[locale],
    situation: round.situation[locale],
    question: round.question[locale],
    choices: ordered.map((item) => ({
      id: item.id,
      label: item.label[locale],
      consequence: item.consequence[locale],
      chaos: item.chaos,
    })) as [ChaosChoice, ChaosChoice, ChaosChoice],
  };
}

function sabotageTargets(rounds: [ChaosRound, ChaosRound, ChaosRound]) {
  return rounds.map((round, index) => {
    const target = [...round.choices].sort((left, right) => right.chaos - left.chaos)[0];
    return { round: index + 1, choiceId: target.id, label: target.label };
  });
}

export function prepareSabotageGame(request: SabotageGameRequest): SabotageGame {
  const pack = PACKS[request.theme];
  const rounds = pack.rounds.map((round, index) => localizeRound(round, request.locale, request.sessionSeed, index)) as [ChaosRound, ChaosRound, ChaosRound];
  const targets = sabotageTargets(rounds);
  const saboteurIndex = hash(`${request.sessionSeed}:saboteur`) % request.players.length;
  const orderedRoles = rotate(pack.roles, hash(`${request.sessionSeed}:roles`) % pack.roles.length);

  const cards: SecretCard[] = request.players.map((player, index) => {
    const team = index === saboteurIndex ? "saboteur" : "cast";
    return {
      player,
      team,
      coverRole: orderedRoles[index % orderedRoles.length][request.locale],
      briefing: team === "saboteur"
        ? request.locale === "zh"
          ? "秘密引导讨论，让至少两个标记目标成为多数选择，并在最终指认中隐藏身份。"
          : "Secretly steer at least two marked targets into the majority, then survive the final accusation."
        : request.locale === "zh"
          ? "认真投票、观察谁在推动最危险的选择，并在最后准确找出剧情破坏者。"
          : "Vote carefully, watch who pushes the most dangerous choices, and identify the Plot Saboteur at the end.",
      targets: team === "saboteur" ? targets : [],
    };
  });

  return { cards, rounds, source: "story-pack" };
}

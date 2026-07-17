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
 * Causal, bilingual deduction cases authored directly with Codex.
 * The public game only reads and shuffles this committed data.
 */

type Copy = Record<Locale, string>;
type PackedChoice = {
  id: ChoiceId;
  label: Copy;
  pitch: Copy;
  consequence: Copy;
  clue: Copy;
  progress: number;
  risk: number;
  targetReason?: Copy;
};
type PackedRound = {
  phase: Copy;
  headline: Copy;
  situation: Copy;
  question: Copy;
  choices: [PackedChoice, PackedChoice, PackedChoice];
};
type DeductionPack = {
  goal: Copy;
  stakes: Copy;
  motive: Copy;
  roles: Copy[];
  rounds: [PackedRound, PackedRound, PackedRound];
};

const c = (en: string, zh: string): Copy => ({ en, zh });
const choice = (
  id: ChoiceId,
  label: Copy,
  pitch: Copy,
  consequence: Copy,
  clue: Copy,
  progress: number,
  risk: number,
  targetReason?: Copy,
): PackedChoice => ({ id, label, pitch, consequence, clue, progress, risk, targetReason });

const PACKS: Record<ThemeId, DeductionPack> = {
  heist: {
    goal: c(
      "Recover the stolen master recipe from the Grand Meridian Hotel before its midnight auction.",
      "在午夜拍卖前，从格兰德梅里迪安酒店夺回被偷走的祖传配方。",
    ),
    stakes: c(
      "The recipe and the bakery deed are being sold together. Lose either, and the family bakery closes tomorrow.",
      "配方和烘焙坊房契将被捆绑出售。失去任何一个，家族烘焙坊明天就会关门。",
    ),
    motive: c(
      "A rival bakery paid you to keep the recipe inside the auction case until it leaves by helicopter.",
      "竞争对手收买了你：你必须让配方一直留在拍卖箱里，直到它被直升机运走。",
    ),
    roles: [c("Crew Planner", "行动策划师"), c("Pastry Archivist", "糕点档案员"), c("Hotel Concierge", "酒店礼宾员"), c("Security Contractor", "安保承包商"), c("Auction Scout", "拍卖侦察员"), c("Getaway Driver", "接应司机")],
    rounds: [
      {
        phase: c("TRACE", "追踪"),
        headline: c("FIND THE COURIER", "找到送货人"),
        situation: c(
          "Lobby footage shows the recipe changing hands, but the courier’s face is hidden. The auction begins in 42 minutes.",
          "大厅监控拍到配方完成了交接，但送货人的脸被挡住了。距离拍卖还有 42 分钟。",
        ),
        question: c("How do you identify the courier?", "你们要如何确认送货人？"),
        choices: [
          choice("A", c("Compare staff schedules", "核对员工排班"), c("Slow, quiet, and leaves a clean trail.", "速度慢，但安静，而且证据完整。"), c("The duplicate clock-in exposes a temporary waiter assigned to the east stairwell.", "重复的打卡记录暴露了一名被派往东侧楼梯间的临时侍者。"), c("The courier used an employee badge issued this morning.", "送货人使用的是今天早上才签发的员工证。"), 2, 0),
          choice("B", c("Question the pastry chef", "询问糕点主厨"), c("Use ingredient knowledge to narrow the route.", "利用食材知识缩小行动路线。"), c("The chef recognizes rare vanilla oil on the courier’s sleeve, but the interview alerts hotel management.", "主厨认出送货人袖口上的稀有香草油，但问话惊动了酒店管理层。"), c("That oil is stored beside the east stairwell archive.", "这种香草油就存放在东侧楼梯间旁的档案室。"), 2, 1),
          choice("C", c("Trigger a fire alarm", "触发火警"), c("Force the courier to move before time runs out.", "逼迫送货人在时间耗尽前行动。"), c("The courier runs toward the east stairwell, but security seals every public exit and starts checking faces.", "送货人跑向东侧楼梯间，但安保封锁了所有公共出口，并开始逐一核对身份。"), c("The courier protects a brass key marked K-17.", "送货人护住了一把刻有 K-17 的黄铜钥匙。"), 3, 2, c("The lockdown makes the final extraction much harder while appearing to reveal the courier quickly.", "封锁会让最终撤离困难得多，却看起来能最快找出送货人。")),
        ],
      },
      {
        phase: c("INFILTRATE", "潜入"),
        headline: c("OPEN ARCHIVE K-17", "打开 K-17 档案室"),
        situation: c(
          "The trail now converges on a kitchen archive behind the east stairwell. The courier has moved the recipe into auction case K-17.",
          "现有线索全部指向东侧楼梯后的厨房档案室。送货人已经把配方放进 K-17 拍卖箱。",
        ),
        question: c("How do you enter without losing the case?", "怎样进入档案室，同时不让拍卖箱被转移？"),
        choices: [
          choice("A", c("Clone the manager key", "复制经理钥匙"), c("Use the key ledger and enter as staff.", "利用钥匙登记册，以员工身份进入。"), c("The copied key opens the archive without raising an alarm.", "复制钥匙顺利打开档案室，没有触发警报。"), c("K-17 is scheduled for the rooftop lift at 11:55 PM.", "K-17 将在晚上 11:55 被送往屋顶。"), 2, 0),
          choice("B", c("Bribe the night manager", "收买夜班经理"), c("Buy access and accept one unreliable witness.", "用钱换取通行，但会留下一个不可靠的目击者。"), c("The manager opens the service door, then quietly photographs the crew for insurance.", "经理打开了服务门，随后悄悄拍下团队照片作为保险。"), c("The case requires both a key and the auctioneer’s voiceprint.", "拍卖箱同时需要钥匙和拍卖师的声纹。"), 2, 1),
          choice("C", c("Cut hotel power", "切断酒店电力"), c("Drop every electronic lock at once.", "让所有电子门锁同时失效。"), c("The archive opens, but backup protocol sends K-17 directly to the guarded rooftop.", "档案室打开了，但备用流程把 K-17 直接送往有守卫的屋顶。"), c("The emergency lift bypasses the auction floor entirely.", "紧急升降梯会完全绕过拍卖大厅。"), 3, 2, c("The power cut moves the target closer to the helicopter while masquerading as a fast entry plan.", "断电会把目标直接送近直升机，却能伪装成最快的进入方案。")),
        ],
      },
      {
        phase: c("EXTRACT", "撤离"),
        headline: c("THE ROOFTOP TRANSFER", "屋顶转运"),
        situation: c(
          "K-17 is locked to a courier trolley beside the rooftop lift. The helicopter arrives in six minutes, and the collected evidence reveals the real case markings.",
          "K-17 被锁在屋顶升降梯旁的转运车上。直升机六分钟后到达，现有证据已经揭示了真正拍卖箱的标记。",
        ),
        question: c("How do you recover the recipe and bakery deed?", "怎样夺回配方和烘焙坊房契？"),
        choices: [
          choice("A", c("Swap in a replica case", "换上复制拍卖箱"), c("Use the markings to make a silent exchange.", "利用箱体标记完成无声掉包。"), c("The trolley leaves with the replica while the crew carries the real documents through the service lift.", "转运车带走了复制品，团队则通过服务电梯带走真文件。"), c("The auction buyer never learns when the exchange happened.", "拍卖买家始终不知道掉包发生在何时。"), 2, 0),
          choice("B", c("Expose the theft to bidders", "向买家揭露盗窃"), c("Turn the auction crowd against the seller.", "让拍卖买家共同对抗卖家。"), c("The bidders block the helicopter and demand provenance records, giving the crew time to reclaim K-17.", "买家拦住直升机并要求出示来源记录，为团队夺回 K-17 赢得时间。"), c("The seller’s forged ownership stamp matches the morning badge issuer.", "卖家的伪造所有权印章与早上签发员工证的人一致。"), 2, 1),
          choice("C", c("Take the case and run", "拿起拍卖箱就跑"), c("Trust speed over the evidence trail.", "相信速度，而不是证据链。"), c("The crew gets K-17, but the rooftop cameras capture every face and the hotel freezes the bakery deed in court.", "团队拿到了 K-17，但屋顶摄像头拍下所有人的脸，酒店随后通过诉讼冻结了烘焙坊房契。"), c("The recipe is safe, but legal ownership is now contested.", "配方保住了，但合法所有权陷入争议。"), 3, 2, c("A visible theft destroys the clean ownership trail and can still cost the family its bakery.", "公开抢走拍卖箱会毁掉完整的所有权证据链，家族仍可能失去烘焙坊。")),
        ],
      },
    ],
  },
  office: {
    goal: c(
      "Prove the acquisition forecast was falsified before the board votes at 5 PM.",
      "在下午五点董事会表决前，证明收购案的财务预测遭到篡改。",
    ),
    stakes: c(
      "If the deal passes on false numbers, the company loses its pension fund and 240 jobs.",
      "如果董事会依据假数据通过交易，公司将失去养老基金和 240 个岗位。",
    ),
    motive: c(
      "You altered the forecast for a promised promotion. Destroy the audit trail before the board can verify it.",
      "你为了升职承诺篡改了预测。你必须在董事会核验前毁掉审计记录。",
    ),
    roles: [c("Finance Analyst", "财务分析师"), c("Board Liaison", "董事会联络人"), c("IT Auditor", "IT 审计员"), c("Legal Counsel", "法务顾问"), c("Operations Lead", "运营负责人"), c("Executive Assistant", "高管助理")],
    rounds: [
      {
        phase: c("TRACE", "追踪"),
        headline: c("THE NUMBERS CHANGED AT 2:13", "数据在 2:13 被修改"),
        situation: c(
          "The board deck predicts impossible growth. Version history shows a late-night edit, but the author field is blank.",
          "董事会材料预测了不可能实现的增长。版本记录显示有人深夜修改，但作者栏是空白。",
        ),
        question: c("How do you trace the edit?", "怎样追查这次修改？"),
        choices: [
          choice("A", c("Audit access logs", "审计访问日志"), c("Preserve the system trail before asking questions.", "先保全系统记录，再展开问话。"), c("The logs isolate one executive-floor device used at 2:13 AM.", "日志锁定了一台在凌晨 2:13 使用过的高管楼层设备。"), c("The device authenticated with a temporary finance token.", "该设备使用了一枚临时财务令牌。"), 2, 0),
          choice("B", c("Interview the finance team", "询问财务团队"), c("Compare memories against the official timeline.", "把员工记忆与正式时间线相互核对。"), c("Two analysts remember an emergency forecast request, but word of the inquiry reaches the executive floor.", "两名分析师记得一项紧急预测要求，但调查消息也传到了高管楼层。"), c("The request came from a printer account that should be read-only.", "请求来自一个本应只有读取权限的打印机账户。"), 2, 1),
          choice("C", c("Restore the whole server", "恢复整台服务器"), c("Recover the old forecast in one fast operation.", "通过一次快速操作恢复旧版预测。"), c("The original forecast returns, but the restore overwrites the live access log and breaks chain of custody.", "原始预测恢复了，但恢复操作覆盖了实时访问日志，破坏了证据链。"), c("The numbers are false, but the editor can no longer be tied to a device.", "数据确实是假的，但已经无法把修改者与具体设备关联。"), 3, 2, c("The restore proves a discrepancy while erasing the evidence that identifies who caused it.", "恢复操作能证明数据有差异，却会抹掉确认篡改者身份的关键证据。")),
        ],
      },
      {
        phase: c("SECURE", "保全"),
        headline: c("THE AUDIT TRAIL IS DISAPPEARING", "审计记录正在消失"),
        situation: c(
          "The first clue points to an executive-floor workflow. Someone has now scheduled the finance archive for deletion at 4:30 PM.",
          "第一条线索指向高管楼层的工作流程。现在有人把财务档案的删除时间设在下午 4:30。",
        ),
        question: c("How do you preserve evidence the board will trust?", "怎样保全董事会愿意采信的证据？"),
        choices: [
          choice("A", c("Create signed exports", "生成签名导出文件"), c("Hash every file and record who handled it.", "为每个文件生成哈希，并记录所有经手人。"), c("The team freezes a verifiable copy before the deletion job begins.", "团队在删除任务开始前冻结了一份可验证副本。"), c("The edit and deletion request share the same temporary token.", "修改操作和删除请求使用了同一枚临时令牌。"), 2, 0),
          choice("B", c("Recover the CFO archive", "恢复 CFO 邮件归档"), c("Use correspondence to explain why the model changed.", "利用往来邮件解释模型为何被改动。"), c("The archive reveals pressure to improve the forecast, but accessing it without notice gives legal counsel an objection.", "邮件归档揭示了美化预测的压力，但未经通知访问归档让法务有了反对理由。"), c("A promotion was promised if the acquisition cleared 18% growth.", "有人承诺：只要收购预测达到 18% 增长，就会获得晋升。"), 2, 1),
          choice("C", c("Leak the draft company-wide", "把草稿群发全公司"), c("Make the evidence impossible to delete.", "让证据再也无法被删除。"), c("Copies survive everywhere, but conflicting drafts flood inboxes and the board questions which version is authentic.", "副本确实到处存在，但互相冲突的草稿塞满邮箱，董事会开始质疑哪个版本才是真的。"), c("The real file is now mixed with dozens of edited copies.", "真正的文件已经和几十份修改版混在一起。"), 3, 2, c("The leak contaminates the evidence pool and lets the falsifier dismiss every file as unreliable.", "群发会污染证据池，让篡改者有理由声称所有文件都不可信。")),
        ],
      },
      {
        phase: c("PROVE", "证明"),
        headline: c("THE BOARD IS IN THE ROOM", "董事会已经到场"),
        situation: c(
          "The board vote begins in seven minutes. Your collected clues connect the false model, temporary token, and deletion request.",
          "董事会将在七分钟后表决。你们收集的线索已经把假模型、临时令牌和删除请求联系起来。",
        ),
        question: c("How do you stop the vote?", "怎样阻止表决？"),
        choices: [
          choice("A", c("Run a controlled comparison", "进行受控对比演示"), c("Rebuild one forecast from the signed evidence.", "利用签名证据重新计算一版预测。"), c("The live comparison reproduces the true forecast and the board pauses the acquisition for a formal audit.", "现场对比重现了真实预测，董事会暂停收购并启动正式审计。"), c("Only the falsified model reaches the promised 18% growth.", "只有被篡改的模型才能达到承诺中的 18% 增长。"), 2, 0),
          choice("B", c("Submit a protected report", "提交受保护举报报告"), c("Give the chair evidence, witnesses, and legal context.", "向董事长提交证据、证人和法律背景。"), c("The chair delays the vote and appoints outside investigators, though the accused executive learns who testified.", "董事长推迟表决并任命外部调查员，但被指控的高管也知道了谁作证。"), c("The report preserves a complete chain from edit to motive.", "报告保留了从修改行为到动机的完整证据链。"), 2, 1),
          choice("C", c("Accuse the executive live", "当场指控高管"), c("Force an answer before the vote can start.", "在表决开始前逼迫对方回应。"), c("The confrontation stops the meeting, but the executive calls it personal retaliation and moves the vote to a private session.", "对峙暂时中止会议，但高管把它称为私人报复，并把表决转为闭门进行。"), c("The board hears the allegation without seeing a verified chain of evidence.", "董事会听到了指控，却没有看到经过验证的完整证据。"), 3, 2, c("A dramatic accusation separates the claim from its evidence and gives the falsifier control of the room.", "戏剧化指控会让主张脱离证据，反而把会议控制权交给篡改者。")),
        ],
      },
    ],
  },
  wedding: {
    goal: c(
      "Find the real wedding rings and prove who switched them before the vows begin.",
      "在宣誓开始前找回真正的婚戒，并证明是谁进行了掉包。",
    ),
    stakes: c(
      "The replacement rings are counterfeit, and the jeweler’s insurer will deny the claim if the evidence is contaminated.",
      "替换戒指是假货；如果证据被污染，珠宝商的保险公司将拒绝赔付。",
    ),
    motive: c(
      "A rival jeweler hired you to make the counterfeit exchange look like a careless loss. Keep the real rings out of the ceremony.",
      "竞争珠宝商雇你把掉包伪装成普通遗失。你必须阻止真戒指出现在仪式上。",
    ),
    roles: [c("Wedding Planner", "婚礼策划师"), c("Best Friend", "头号好友"), c("Venue Manager", "场地经理"), c("Band Leader", "乐队领队"), c("Family Jeweler", "家族珠宝师"), c("Photographer", "婚礼摄影师")],
    rounds: [
      {
        phase: c("RECONSTRUCT", "还原"),
        headline: c("THE RING BOX IS WRONG", "戒指盒不对劲"),
        situation: c(
          "Twenty-five minutes before the vows, the ring box contains convincing counterfeits. Four people handled it since breakfast.",
          "距离宣誓还有 25 分钟，戒指盒里却是足以乱真的假货。早餐后共有四个人接触过戒指盒。",
        ),
        question: c("How do you reconstruct the handoff?", "怎样还原戒指盒的交接过程？"),
        choices: [
          choice("A", c("Compare photo timestamps", "核对照片时间戳"), c("Build the route from images nobody can revise.", "利用无法事后修改的照片还原路线。"), c("The timeline shows the real box entering the florist’s van at 10:18 AM.", "时间线显示真戒指盒在上午 10:18 被放进花店货车。"), c("A person wearing a venue badge carried it, but the badge number is hidden.", "搬运者佩戴场地员工证，但编号被挡住了。"), 2, 0),
          choice("B", c("Question the band", "询问乐队成员"), c("They watched the loading dock during soundcheck.", "他们彩排时一直能看到卸货区。"), c("The drummer saw a florist move a small case, but the public questioning reaches the suspect.", "鼓手看到一名花艺师搬走小盒子，但公开询问也惊动了嫌疑人。"), c("The florist changed vans immediately after the handoff.", "花艺师在交接后立刻换了一辆货车。"), 2, 1),
          choice("C", c("Search every guest", "搜查所有宾客"), c("Eliminate the room before the ceremony starts.", "在仪式开始前排除现场所有人。"), c("No guest has the rings, and the angry search scatters witnesses while the florist’s van leaves the loading dock.", "宾客身上没有戒指；愤怒的搜查让证人四散，而花店货车也驶离卸货区。"), c("The switch happened before guests entered the venue.", "掉包发生在宾客进入场地之前。"), 3, 2, c("The search wastes the only window to follow the van and disrupts the witnesses who can prove the handoff.", "搜查会浪费追踪货车的唯一窗口，还会打乱能够证明交接过程的证人。")),
        ],
      },
      {
        phase: c("FOLLOW", "追踪"),
        headline: c("THE FLORIST VAN RETURNED EMPTY", "花店货车空车返回"),
        situation: c(
          "The first clues lead to a delivery van that made an unscheduled stop at the estate greenhouse. The driver claims the route was changed by text.",
          "第一批线索指向一辆曾临时停靠庄园温室的送货车。司机声称自己是收到短信后改道的。",
        ),
        question: c("How do you follow the rings without tipping off the thief?", "怎样继续追踪戒指，同时不惊动掉包者？"),
        choices: [
          choice("A", c("Verify delivery scans", "核验配送扫描记录"), c("Match the van, stop, and sender through signed records.", "通过签名记录核对车辆、停靠点和发信人。"), c("The scan history proves the ring case was unloaded at greenhouse locker 4.", "扫描记录证明戒指盒在温室 4 号储物柜被卸下。"), c("The route-change text came from a venue-issued phone.", "改道短信来自一部场地方配发的手机。"), 2, 0),
          choice("B", c("Follow the florist quietly", "秘密跟踪花艺师"), c("Let the suspect lead you to the next handoff.", "让嫌疑人带你们找到下一个交接点。"), c("The florist opens locker 4, but spots the tail and calls someone inside the venue.", "花艺师打开了 4 号储物柜，却发现被跟踪并给场内某人打了电话。"), c("The locker contains the jeweler’s original velvet wrapping.", "储物柜里留有珠宝商的原装天鹅绒包装。"), 2, 1),
          choice("C", c("Lock down the venue", "封锁整个场地"), c("Stop every person and vehicle before the vows.", "在宣誓前拦住所有人员和车辆。"), c("The gates close, but staff move locker 4 contents into lost property and destroy the location trail.", "大门关闭了，但员工把 4 号柜物品转移到失物招领处，原始位置记录被破坏。"), c("The rings remain on site, mixed with dozens of unlogged valuables.", "戒指还在场内，却与几十件未登记贵重物品混在一起。"), 3, 2, c("The lockdown appears decisive but contaminates the precise location evidence needed to expose the switch.", "封锁看似果断，却会污染证明掉包地点所需的关键证据。")),
        ],
      },
      {
        phase: c("RECOVER", "取回"),
        headline: c("FIVE MINUTES TO THE VOWS", "距离宣誓还有五分钟"),
        situation: c(
          "The trail ends at a greenhouse display containing three near-identical ring boxes. Your clues establish the route, original wrapping, and venue-phone connection.",
          "线索最终指向温室里三个几乎相同的戒指盒。现有证据已经确认了运输路线、原装包装和场地方手机之间的联系。",
        ),
        question: c("How do you recover the real rings and preserve the case?", "怎样找回真戒指并保全证据？"),
        choices: [
          choice("A", c("Match the serial numbers", "核对戒指序列号"), c("Use the jeweler’s sealed registry to identify the pair.", "利用珠宝商密封登记册确认真品。"), c("The serials identify the real rings, and every box is photographed before anyone touches it.", "序列号确认了真戒指，所有戒指盒也在被触碰前完成拍照。"), c("Counterfeit box two carries a partial venue-badge print.", "第二个假戒指盒上留有场地员工证的部分印痕。"), 2, 0),
          choice("B", c("Stage a private confrontation", "进行私下对质"), c("Use the evidence to make the thief reveal the right box.", "用现有证据逼掉包者指出真戒指盒。"), c("The suspect points to the real pair in exchange for discretion, but no independent witness hears the admission.", "嫌疑人以保密为条件指出真戒指，但没有独立证人听到承认。"), c("The venue phone belonged to someone assigned to the ceremony aisle.", "那部场地方手机属于一名负责仪式通道的工作人员。"), 2, 1),
          choice("C", c("Announce the thief publicly", "公开宣布掉包者身份"), c("Pressure the culprit before the ceremony begins.", "在仪式开始前公开施压嫌疑人。"), c("The accusation causes a rush toward the display; the boxes fall, fingerprints overlap, and nobody can prove which pair came from where.", "指控引发众人冲向展台，戒指盒跌落，指纹相互覆盖，再也无法证明每对戒指来自哪里。"), c("The real rings are found, but the insurance claim loses its evidence trail.", "真戒指找到了，但保险理赔失去了证据链。"), 3, 2, c("Public pressure creates the exact contamination needed to make the switch look like an innocent mix-up.", "公开施压会制造证据污染，使掉包看起来像一次普通混乱。")),
        ],
      },
    ],
  },
  space: {
    goal: c(
      "Restore the Moon Motel’s orbit stabilizer before the passenger shuttle enters lunar approach.",
      "在客运穿梭机进入月球进近航线前，修复月球汽车旅馆的轨道稳定器。",
    ),
    stakes: c(
      "Without a stable orbit, the shuttle cannot dock and the motel will drift into a debris corridor.",
      "轨道无法稳定，穿梭机就不能对接，旅馆也会漂入太空碎片带。",
    ),
    motive: c(
      "Your illegal helium-3 siphon caused the failure. Keep it connected until the shuttle forces an evacuation and hides the theft.",
      "你的非法氦-3 抽取装置导致了故障。你必须让它继续运行，直到穿梭机迫使全员撤离并掩盖盗采。",
    ),
    roles: [c("Night Manager", "夜班经理"), c("Orbit Engineer", "轨道工程师"), c("Shuttle Coordinator", "穿梭机协调员"), c("Maintenance Chief", "维修主管"), c("Guest Safety Officer", "住客安全官"), c("Lunar Inspector", "月球质检员")],
    rounds: [
      {
        phase: c("DIAGNOSE", "诊断"),
        headline: c("THE ORBIT IS DECAYING", "轨道正在衰减"),
        situation: c(
          "The stabilizer loses thrust every 90 seconds. The passenger shuttle reaches approach range in 28 minutes.",
          "稳定器每 90 秒就会损失一次推力。客运穿梭机将在 28 分钟后进入进近范围。",
        ),
        question: c("How do you isolate the failure?", "怎样定位故障源？"),
        choices: [
          choice("A", c("Compare engine telemetry", "对比引擎遥测数据"), c("Find where commanded power stops matching output.", "找出指令功率与实际输出开始不符的位置。"), c("The comparison isolates an unregistered power draw below the east service deck.", "对比结果锁定了东侧维修甲板下方的一处未登记耗电源。"), c("The draw pulses exactly before each thrust loss.", "每次推力下降前，这处耗电都会出现脉冲。"), 2, 0),
          choice("B", c("Inspect coolant tunnels", "检查冷却隧道"), c("Follow the physical signs of an overloaded engine.", "沿着引擎过载留下的物理痕迹检查。"), c("Technicians find a warm unauthorized conduit, but opening the tunnel vents one section of guest heating.", "技术员发现一条发热的未授权管线，但打开隧道导致一段客房供暖被排空。"), c("The conduit runs toward an abandoned mining bay.", "管线通向一处废弃采矿舱。"), 2, 1),
          choice("C", c("Restart the core blind", "无诊断重启核心"), c("Clear the fault quickly and recover thrust now.", "迅速清除故障，立刻恢复推力。"), c("Thrust returns for four minutes, but the restart wipes the fault buffer and doubles the hidden power draw.", "推力恢复了四分钟，但重启清空了故障缓冲区，并让隐藏耗电翻倍。"), c("The failure is external to the core, but its original signature is gone.", "故障来自核心外部，但原始特征已经丢失。"), 3, 2, c("The restart erases evidence of the illegal siphon while appearing to solve the immediate thrust problem.", "重启会抹掉非法抽取装置的证据，同时看上去解决了眼前的推力问题。")),
        ],
      },
      {
        phase: c("ISOLATE", "隔离"),
        headline: c("A MINING RIG IS STEALING POWER", "采矿装置正在偷取电力"),
        situation: c(
          "The first clues expose an illegal helium-3 rig beneath the east deck. It shares a live bus with the orbit stabilizer.",
          "第一批线索揭露了东侧甲板下的非法氦-3 采矿装置。它与轨道稳定器共用同一条带电母线。",
        ),
        question: c("How do you disconnect the rig safely?", "怎样安全断开采矿装置？"),
        choices: [
          choice("A", c("Isolate one power bus", "隔离单条电力母线"), c("Trace the breaker map before disconnecting anything.", "先追踪断路器图，再进行断电。"), c("The team separates the rig while keeping the stabilizer online at reduced power.", "团队成功断开采矿装置，同时让稳定器以低功率继续运行。"), c("The breaker was bypassed with a motel maintenance credential.", "断路器旁路使用的是旅馆维修权限。"), 2, 0),
          choice("B", c("Reroute guest-wing power", "改接客房区电力"), c("Buy enough capacity to inspect the rig manually.", "腾出足够电力，以便人工检查装置。"), c("The rig powers down long enough for inspection, but life support begins rationing the occupied wing.", "采矿装置暂时停机，获得了检查窗口，但生命维持系统开始限制有人客房区的供应。"), c("The rig has transmitted ore totals to a private cargo account.", "采矿装置一直把矿物数据发送到一个私人货运账户。"), 2, 1),
          choice("C", c("Overload the mining rig", "让采矿装置过载"), c("Burn out the illegal hardware in one move.", "一次性烧毁非法设备。"), c("The rig fails, but its surge damages the stabilizer inverter and destroys the cargo-account log.", "装置烧毁了，但电涌损坏稳定器逆变器，并毁掉货运账户日志。"), c("Illegal mining is confirmed, but ownership evidence is lost.", "非法采矿得到确认，但所有权证据已经丢失。"), 3, 2, c("The overload destroys both the rig’s ownership record and a critical stabilizer component.", "过载会同时毁掉装置所有权记录和稳定器的关键部件。")),
        ],
      },
      {
        phase: c("STABILIZE", "稳定"),
        headline: c("THE SHUTTLE COMMITS TO APPROACH", "穿梭机开始最终进近"),
        situation: c(
          "The illegal draw is identified, but the motel still needs one precise correction burn. Your clues show how the rig entered the system and who authorized it.",
          "非法耗电源已经确认，但旅馆仍需要一次精确的轨道修正点火。现有线索也揭示了装置如何接入系统、又是谁授权的。",
        ),
        question: c("How do you restore orbit before docking?", "怎样在穿梭机对接前恢复轨道？"),
        choices: [
          choice("A", c("Run a timed correction burn", "执行定时修正点火"), c("Use the recovered telemetry to make one measured burn.", "利用恢复的遥测数据进行一次精确点火。"), c("The motel returns to its docking corridor with fuel and evidence intact.", "旅馆回到对接走廊，燃料和证据都得到保全。"), c("The shuttle records a stable approach and the rig remains available for inspection.", "穿梭机记录到稳定进近，采矿装置也能继续接受检查。"), 2, 0),
          choice("B", c("Negotiate with the rig owner", "与装置所有者谈判"), c("Trade limited immunity for access codes and fuel.", "用有限豁免换取访问代码和燃料。"), c("The owner releases the locked reserve tank, but gains time to erase one remote account.", "所有者释放了被锁定的备用燃料，但也争取到时间删除了一个远程账户。"), c("The maintenance credential and cargo account came from the same operator.", "维修权限和货运账户属于同一个操作者。"), 2, 1),
          choice("C", c("Use full manual thrust", "使用全手动推力"), c("Push the motel back into position immediately.", "立刻把旅馆推回正确位置。"), c("The motel reaches the corridor, but overshoots the docking window and ejects the damaged rig into space with its evidence.", "旅馆回到走廊，却错过对接窗口，并把损坏的采矿装置连同证据一起抛入太空。"), c("The shuttle is safe, but the saboteur’s physical evidence is gone.", "穿梭机安全了，但破坏者的物证消失了。"), 3, 2, c("Manual thrust creates a visible rescue while disposing of the hardware that proves the sabotage.", "手动推力会制造一次显眼的救援，同时处理掉能证明破坏行为的硬件。")),
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
    phase: round.phase[locale],
    headline: round.headline[locale],
    situation: round.situation[locale],
    question: round.question[locale],
    choices: ordered.map((item) => ({
      id: item.id,
      label: item.label[locale],
      pitch: item.pitch[locale],
      consequence: item.consequence[locale],
      clue: item.clue[locale],
      progress: item.progress,
      risk: item.risk,
    })) as [ChaosChoice, ChaosChoice, ChaosChoice],
  };
}

function sabotageTargets(pack: DeductionPack, rounds: [ChaosRound, ChaosRound, ChaosRound], locale: Locale) {
  return rounds.map((round, index) => {
    const target = [...round.choices].sort((left, right) => right.risk - left.risk)[0];
    const packedTarget = pack.rounds[index].choices.find((item) => item.id === target.id)!;
    return {
      round: index + 1,
      choiceId: target.id,
      label: target.label,
      reason: packedTarget.targetReason?.[locale] ?? target.consequence,
    };
  });
}

export function prepareSabotageGame(request: SabotageGameRequest): SabotageGame {
  const pack = PACKS[request.theme];
  const rounds = pack.rounds.map((round, index) => localizeRound(round, request.locale, request.sessionSeed, index)) as [ChaosRound, ChaosRound, ChaosRound];
  const targets = sabotageTargets(pack, rounds, request.locale);
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
          ? `${pack.motive.zh} 暗中推动至少两个标记方案，并在最终指认中隐藏身份。`
          : `${pack.motive.en} Quietly push at least two marked plans, then survive the final accusation.`
        : request.locale === "zh"
          ? `案件目标：${pack.goal.zh} 留意谁总在推动会破坏证据链的高风险捷径。`
          : `Case goal: ${pack.goal.en} Watch for anyone repeatedly pushing risky shortcuts that damage the evidence chain.`,
      targets: team === "saboteur" ? targets : [],
    };
  });

  return {
    goal: pack.goal[request.locale],
    stakes: pack.stakes[request.locale],
    cards,
    rounds,
    source: "story-pack",
  };
}

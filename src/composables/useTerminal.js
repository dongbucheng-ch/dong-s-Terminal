import { ref, computed } from "vue";

const HOME = "/Users/dongbucheng";

const FS = {
  Applications: {},
  Library: {},
  System: {},
  Users: {
    dongbucheng: {
      Desktop: {
        "绝密文件.txt":
          "你真的以为这里会有什么绝密内容吗？\n\n醒醒，这是一个整蛊网站。",
        "resume.md": `# 马至东 - 全栈工程师\n\n## 👨‍💻 基本信息\n- **年龄**: 26岁 / 男\n- **电话**: 17386115596\n- **邮箱**: dong_960010@163.com\n- **教育**: 武昌理工学院 | 智能科学与技术 | 本科 | 2022年毕业\n\n## 🌟 自我评价\n3年前端 + 1年全栈开发经验。近一年转向 **Go** 后端，独立完成广告竞价引擎（OpenRTB）、多租户SaaS平台、分布式事件管道等后端系统的设计与落地。前端以 **Vue/Nuxt** 为主，有 Monorepo 架构下100+包管理与100+生产站点交付经验。深度使用 AI 辅助工程化开发，有 LLM API 产品化落地经验。\n\n## 🛠️ 专业技能\n- **核心语言**: Go、Node.js(TypeScript)、PHP\n- **后端框架**: Gin / fasthttp / Koa / Laravel\n- **前端框架**: Vue 3 / Nuxt（SSR/SSG）/ 微信小程序\n- **数据存储**: MySQL（查询优化、索引设计）/ MongoDB（聚合管道）/ Redis（多级缓存、分布式锁）\n- **工程体系**: Turborepo + pnpm Workspace / Vite 构建优化 / ECharts 数据可视化\n- **基础设施**: Docker + Docker Compose / Jenkins CI/CD / Nginx / Cloudflare R2 / Prometheus\n\n## 💼 工作经历\n### 深圳市帆睿科技有限公司 | 全栈工程师 (2025/5 ～ 2025/12)\n- 负责海外 ADX 广告交易平台全链路开发（Go竞价引擎 + PHP管理后台 + Go数据管道），从架构设计到生产部署\n- 从零搭建多租户内容管理与数据分析平台（Node.js），完成事件采集 → 缓冲处理 → 多维分析全链路\n- 负责多站点内容分发前端工程体系（Nuxt），基于 Monorepo 架构管理 100+ 工作空间包，支撑 100+ 生产站点\n- 搭建 Docker Compose + Jenkins 容器化部署与 CI/CD 流水线\n\n### 广东蕾特恩科技发展有限公司 | 前端开发工程师 (2022/4 ～ 2025/3)\n- 负责多个业务系统的前端开发，覆盖小程序、Web 管理后台、数据大屏等多端场景\n- 搭建 Vue 组件库，抽象通用业务模块，建立代码审查机制\n- 推动阿里云 CI/CD 自动化部署落地，搭建内部技术 Wiki\n\n## 🚀 项目经历\n### 1. 海外 ADX 程序化广告交易平台\n- **技术栈**: Go(Gin/fasthttp/ants) + PHP(Laravel) + MySQL + Redis + Docker + Prometheus\n- **描述**: 基于 OpenRTB 2.5 协议的海外移动广告交易平台，承接 SSP 流量并对接多家 DSP 进行实时竞价（RTB），支持 Banner、视频（VAST 3.0）、原生、激励视频等广告类型。系统分三层：Go 竞价引擎 + PHP 管理后台 + Go 定时任务数据管道。\n- **核心工作**:\n  - **竞价引擎核心链路**: 每次广告请求需并发调用多家 DSP 获取出价。采用 ants 协程池（2048 workers）实现扇出/汇聚模式，结合 context 超时控制，单次竞价在 ~500ms 内完成。选择 fasthttp 替代 net/http 是因为竞价场景连接复用率高、无需 HTTP/2，压测单机达 10000+ QPS\n  - **三级缓存设计**: 初期竞价链路直查 MySQL 读取广告主配置，P99 延迟 >50ms 且连接池频繁打满。设计 go-cache（本地内存）→ Redis → MySQL 三级缓存，通过 Cron 任务每分钟增量同步保证最终一致性，热路径读取延迟从 ~10ms 降至微秒级，核心链路彻底消除数据库访问\n  - **流量过滤引擎**: 基于策略模式设计 Checker 接口链，支持国家 / OS / 广告类型 / 设备等多维度过滤。黑名单匹配采用布谷鸟过滤器（需支持删除操作），相比 HashSet 内存占用降低 90%+，O(1) 查询复杂度\n  - **数据追踪与报表**: 展示/点击事件通过 Redis 原子计数实时累加，Cron 定时聚合写入 MySQL，构建 SSP/DSP 双侧多维度报表（国家 × 广告类型 × OS × 媒体 × 时段）\n  - **反作弊体系**: tkey 令牌防伪验证 + Pixalate 第三方反欺诈 + DMP 黑名单过滤 + QPS 流控限流，多层防御降低作弊流量\n  - **管理后台**: SSP/DSP 配置管理、RBAC 权限体系、VAST 视频广告配置、多维报表查询与导出\n  - **部署与运维**: Docker 多阶段构建优化镜像体积，Docker Compose 编排多服务，基于 signal 监听实现 graceful shutdown，服务更新时在途请求正常处理完毕后再退出\n- **技术决策**:\n  - ants 池 vs 原生 goroutine：压测发现无限制 goroutine 在高峰期暴涨导致 GC 压力，引入协程池后峰值稳定可控\n  - fasthttp vs net/http：竞价场景为高频短连接、无需 HTTP/2，fasthttp 连接池复用效率更高\n  - 布谷鸟过滤器 vs 布隆过滤器：黑名单需要支持动态删除，布谷鸟过滤器支持 Delete 操作\n\n### 2. Pressly - 多租户内容管理与数据分析平台\n- **技术栈**: Koa + MongoDB + Redis + Redlock + Cloudflare R2 + GA4 API + Docker Compose\n- **描述**: 从零搭建的多租户 SaaS 内容管理平台，服务于多站点内容发布与运营数据分析。采用分层架构，Docker Compose 编排 App×3 副本 + Nginx + MongoDB + Redis 生产集群，日均处理 10 万级埋点事件。\n- **核心工作**:\n  - **分层架构设计**: Route → Controller → Service → Model 四层分离，覆盖 17 个业务模块、40+ 个 RESTful API，基于文件系统扫描实现路由自发现与零配置注册\n  - **事件处理管道**: 高频埋点事件直写 MongoDB 导致写入延迟高且连接争抢。设计 Redis List 分桶缓冲方案：事件先写入 Redis，Cron 定时 + 动态阈值（缓冲区半满 / 分桶数 ≥10）双触发批量落盘，背压控制（单桶 50000 上限 + LTRIM 淘汰）防止内存膨胀。选择 Redis List 而非 Kafka 是因为部署环境资源有限、事件量级不需要专业 MQ\n  - **分布式锁与降级**: 3 副本部署下多实例同时消费事件导致重复处理。引入 Redlock 抢锁（TTL 30s + 自动释放），同时设计 Redis 写入失败时自动 fallback 至 MongoDB 直写的降级路径，保证数据不丢\n  - **埋点 SDK（浏览器端）**: 自研 JS SDK，支持 PV / 滚动深度 / 内容点击等 6 类事件采集，Image Pixel / Beacon API 双通道上报，内置 30 分钟会话管理与设备指纹\n  - **多维分析引擎**: 基于 MongoDB $facet 并行聚合管道，实现 IP/UA 异常流量检测、Jaccard 相似度跨站 IP 重合分析、按页面类型的漏斗转化分析\n  - **GA4 数据融合**: 集成 GA4 Data & Admin API，Cron 定时拉取 GA 数据与自有埋点融合，构建留存、同类群组、设备分布等混合报表\n  - **多租户隔离**: 每租户独立 Cloudflare R2 存储凭证（AES-256-CBC 加密），JWT + Redis Session 双重认证，请求级租户隔离\n- **技术决策**:\n  - Redis List vs Kafka：日均 10 万级事件、3 节点部署，Kafka 运维成本过高，Redis List 足够且团队更熟悉\n  - Redlock vs 单节点锁：3 副本部署要求锁在 Redis 单点故障时仍有效，Redlock 提供多节点仲裁\n  - MongoDB vs MySQL：埋点事件 schema 灵活多变，MongoDB 文档模型更适合，聚合管道能力也更强\n\n### 3. 多站点内容分发与广告变现前端平台\n- **技术栈**: Nuxt(Vue 3/SSR/SSG) + TypeScript + Turborepo + pnpm Workspace + SCSS + Vite + Jenkins + Nginx\n- **描述**: 基于 Monorepo 架构的多站点内容分发平台前端工程体系。Turborepo + pnpm Workspace 管理 100+ 工作空间包，通过模板工厂模式实现站点快速复制与部署，支撑 100+ 生产站点。集成 Google Ad Manager + AdSense 广告变现。\n- **核心工作**:\n  - **Monorepo 架构设计**: 100+ 包通过 workspace catalogs 统一核心依赖版本，turbo 任务编排实现增量构建与缓存复用，避免全量构建\n  - **配置工厂模式**: 设计 @nuxt-config 统一提供 SSR、脚本注入、构建优化、GA 接入等基础配置，环境变量驱动 Feature Flags 控制广告开关，新站点接入仅需一个 env 文件\n  - **SSR/SSG 混合渲染**: 首页 / 文章详情页用 SSG 预渲染保障 SEO，搜索等动态页面走 SPA，通过 routeRules 按路由粒度控制渲染策略\n  - **广告基础设施**: 封装 AdUnit 组件支持 Banner/Anchor/Interstitial 多广告类型，IntersectionObserver 懒加载广告位，路由切换自动刷新，按站点动态映射 GPT 广告位\n  - **性能优化**: Terser 压缩 + console 剥离、手动 vendor 分包（将 vue/nuxt 等稳定依赖独立打包利用长缓存）、Brotli/GZIP 双重压缩、图片懒加载、payload extraction 减少水合开销\n  - **CI/CD 流水线**: Jenkins 参数化构建，支持按账户 / 应用 / 域名 / GA ID 灵活配置，自动完成安装 → 构建 → 部署 → 状态回调全链路\n- **技术决策**:\n  - Turborepo vs Nx：项目以构建编排和缓存为主，不需要 Nx 的代码生成等重功能，Turborepo 更轻量\n  - SSG vs 全量 SSR：内容站 SEO 是核心需求，静态内容用 SSG 降低服务端压力，动态交互页降级 SPA\n\n### 4. 企业级数字化业务系统集群\n- **技术栈**: Vue.js + Vuex + Element UI + ECharts + 微信小程序 + 火山引擎 RTC + FastGPT\n- **描述**: 为连锁企业（800+ 门店）开发的数字化系统集群，包含教育培训小程序、远程会诊系统、门店管理平台、实时数据大屏四个产品线。\n- **核心工作**:\n  - **教育培训小程序**: 设计主包/分包拆分策略控制包体积，完成课程学习 → 在线考试 → 支付交易完整业务链路\n  - **远程会诊系统**: 集成火山引擎 RTC SDK 实现 P2P 音视频通话，针对弱网场景设计自动重连（断线 3s 内自动恢复）与降级策略（视频 → 纯音频）\n  - **实时数据大屏**: 基于 ECharts 实现全国门店数据可视化，解决地图组件地理坐标到像素坐标的转换问题，通过自定义 DOM 层叠渲染突破 tooltip 单点显示限制，实现多点数据同屏展示。requestAnimationFrame 调度渲染保证万级数据节点 60fps 流畅展示\n  - **AI 智能问答**: 集成 FastGPT 实现智能客服、短信模板生成、敏感词检测等功能落地\n  - **组件库建设**: 抽象业务通用模块构建 Vue 组件库，建立组件化开发规范`,
        "密码本.txt":
          "WiFi密码: 你被骗了\n银行密码: 做梦吧\n手机密码: 不告诉你\niCloud: 想都别想",
        "不要打开.sh":
          '#!/bin/bash\necho "我都说了不要打开，你怎么就是不听呢？"\nexit 1',
      },
      Documents: {
        "工资单.xlsx":
          "[错误] 无法读取二进制文件 .xlsx\n\n开玩笑的，这里根本没有工资单。\n你还真信了？",
        "人生规划.md":
          "# 人生规划\n\n1. 别再点验证码了\n2. 关掉这个网页\n3. 反思一下为什么会被骗到这里\n4. 把链接转发给下一个受害者\n5. 重复第 4 步",
      },
      Downloads: {
        "免费VPN.dmg":
          "[警告] 这就是你经常中招的原因。\n不要随便下载来路不明的文件！\n\n—— 一个善意的提醒",
        "绝密视频.mp4":
          "[此视频已被 FBI 没收]\n\n如需取回请拨打: 110\n接线员会告诉你下一步该怎么做",
        "totally-not-a-virus.exe":
          "你居然敢打开一个 .exe 文件？\n在 Mac 上？\n你的勇气令人敬佩。",
      },
      ".secret": {
        "truth.txt":
          "真相只有一个：\n\n你完成的每一个验证码都是假的。\n但是这个终端是真的能用。\n至少，你找到了这个隐藏文件。\n\n—— 来自一个快乐的开发者",
        ".hidden_msg":
          "你居然找到了隐藏文件里的隐藏文件\n\n既然你这么有探索精神，我就告诉你一个秘密：\n千万不要在这个终端里尝试最高权限的删除命令（比如 sudo rm -rf /）。\n\n绝对不要。",
      },
      Music: {},
      Pictures: {
        "自拍.jpg": "[无法显示图片]\n\n反正也不是你的自拍。放心。",
      },
      "README.md":
        "# 欢迎来到虚假终端 v2.0\n\n恭喜你发现了这个彩蛋终端。\n这里没有任何有价值的信息。\n\n可用命令: ls, cd, cat, pwd, whoami, clear, help, neofetch\n\nP.S. 如果你觉得无聊，也许可以尝试执行 `play snake` 杀一下时间 :)",
      ".zshrc":
        '# ~/.zshrc\nexport PATH="/usr/local/bin:$PATH"\nexport PRANK="true"\n# 你在看什么？这也是假的。',
    },
    Shared: {},
  },
  etc: {
    hosts: "127.0.0.1\tlocalhost\n::1\t\tlocalhost\n127.0.0.1\tdongbucheng.com",
    passwd:
      "root:*:0:0:System Administrator:/var/root:/bin/sh\ndong:*:501:20:被骗的人:/Users/dongbucheng:/bin/zsh",
  },
  tmp: {
    ".debug.log":
      "[2026-02-26 14:00:00] 检测到新的受害者\n[2026-02-26 14:00:01] 开始第一轮虚假验证\n[2026-02-26 14:02:30] 受害者仍在点击\n[2026-02-26 14:05:00] 五轮验证全部完成，启动终端\n[2026-02-26 14:05:01] 受害者开始怀疑人生",
  },
  var: {
    root: {
      ".bash_history": "rm -rf /\nsudo rm -rf /\nls\nwhoami\nhelp\nplay snake",
      "admin_notes.txt":
        "这里是 macOS 的真实 root 目录。\n但我怎么可能把真东西放在这里呢？",
    },
  },
  root: {
    "hello.txt":
      "你想找 root 目录？\n\n提示：这是一个模拟 macOS 的终端。\n在 macOS 中，root 用户的家目录其实在 /var/root，而不是 /root。\n\n不过既然你找来了，送你一个金币 🪙",
  },
};

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function useTerminal() {
  const lines = ref([]);
  const cwd = ref(HOME);
  const cmdHistory = ref([]);
  const historyIdx = ref(-1);
  const ready = ref(false);
  const triggerGlitch = ref(false);
  const isGaming = ref(false);

  let gameInterval = null;
  let snake = [];
  let food = null;
  let direction = null;
  let gameScore = 0;
  let gameStartLineIdx = 0;

  function initGame() {
    isGaming.value = true;
    snake = [
      [10, 10],
      [10, 11],
      [10, 12],
    ];
    direction = "UP";
    gameScore = 0;
    spawnFood();
    outHtml('<span class="t-cyan t-bold">=== SNAKE GAME ===</span>');
    outHtml(
      '<span class="t-mute">Use W/A/S/D or Arrow keys to move. Press Q or Ctrl+C to quit.</span>',
    );
    gameStartLineIdx = lines.value.length;
    for (let i = 0; i < 20; i++) lines.value.push(""); // Reserve space for board
    gameInterval = setInterval(gameLoop, 150);
  }

  function stopGame() {
    isGaming.value = false;
    clearInterval(gameInterval);
    outHtml(`<span class="t-yellow">Game Over. Score: ${gameScore}</span>`);
    if (gameScore >= 50) {
      outHtml(
        `<span class="t-green">Your logic is as solid as my code. Let's talk: dong_960010@163.com</span>`,
      );
    }
  }

  function spawnFood() {
    while (true) {
      food = [Math.floor(Math.random() * 20), Math.floor(Math.random() * 20)];
      if (
        !snake.some(
          (segment) => segment[0] === food[0] && segment[1] === food[1],
        )
      )
        break;
    }
  }

  function gameLoop() {
    const head = snake[0];
    let newHead = [...head];
    if (direction === "UP") newHead[1]--;
    if (direction === "DOWN") newHead[1]++;
    if (direction === "LEFT") newHead[0]--;
    if (direction === "RIGHT") newHead[0]++;

    // Wall collision
    if (
      newHead[0] < 0 ||
      newHead[0] >= 20 ||
      newHead[1] < 0 ||
      newHead[1] >= 20
    ) {
      stopGame();
      return;
    }

    // Self collision
    if (
      snake.some(
        (segment) => segment[0] === newHead[0] && segment[1] === newHead[1],
      )
    ) {
      stopGame();
      return;
    }

    snake.unshift(newHead);

    // Eat food
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      gameScore += 10;
      spawnFood();
    } else {
      snake.pop();
    }

    renderGame();
  }

  function renderGame() {
    for (let y = 0; y < 20; y++) {
      let row = "";
      for (let x = 0; x < 20; x++) {
        if (food[0] === x && food[1] === y) {
          row += '<span class="t-red">██</span>';
        } else if (
          snake.some((segment) => segment[0] === x && segment[1] === y)
        ) {
          row += '<span class="t-green">██</span>';
        } else {
          row += '<span class="t-mute">· </span>';
        }
      }
      lines.value[gameStartLineIdx + y] = row;
    }
  }

  function handleGameInput(key) {
    if (["ArrowUp", "w", "W"].includes(key) && direction !== "DOWN")
      direction = "UP";
    if (["ArrowDown", "s", "S"].includes(key) && direction !== "UP")
      direction = "DOWN";
    if (["ArrowLeft", "a", "A"].includes(key) && direction !== "RIGHT")
      direction = "LEFT";
    if (["ArrowRight", "d", "D"].includes(key) && direction !== "LEFT")
      direction = "RIGHT";
    if (["q", "Q"].includes(key)) stopGame();
  }

  function cmdPlay(args) {
    if (args[0] === "snake") {
      initGame();
    } else {
      outHtml('<span class="t-red">用法: play snake</span>');
    }
  }

  const displayDir = computed(() => {
    if (cwd.value === HOME) return "~";
    if (cwd.value.startsWith(HOME + "/"))
      return "~" + cwd.value.slice(HOME.length);
    return cwd.value;
  });

  const promptHtml = computed(() => {
    return `<span class="t-green">dongbucheng@MacBook-Pro</span> <span class="t-blue">${escapeHtml(displayDir.value)}</span> <span class="t-mute">%</span> `;
  });

  // ── Path resolution ──
  function resolvePath(input) {
    let p = input.trim();
    if (p === "~" || p === "") return HOME;
    if (p.startsWith("~/")) p = HOME + p.slice(1);
    if (!p.startsWith("/")) p = cwd.value + "/" + p;
    const parts = p.split("/").filter(Boolean);
    const resolved = [];
    for (const part of parts) {
      if (part === ".") continue;
      if (part === "..") {
        resolved.pop();
        continue;
      }
      resolved.push(part);
    }
    return "/" + resolved.join("/");
  }

  function getNode(absPath) {
    if (absPath === "/") return FS;
    const parts = absPath.split("/").filter(Boolean);
    let node = FS;
    for (const part of parts) {
      if (typeof node !== "object" || node === null || !(part in node))
        return null;
      node = node[part];
    }
    return node;
  }

  function isDir(node) {
    return typeof node === "object" && node !== null;
  }

  // ── Output helpers ──
  function out(text) {
    lines.value.push(text);
  }
  function outHtml(html) {
    lines.value.push(html);
  }

  // ── Welcome message ──
  function init() {
    out("恭喜你完成了五轮验证，但这里从来没有放行入口。");
    out("你刚刚点过的每一个验证码，都只是流程演出的一部分。");
    outHtml(
      '现在，欢迎体验你的"奖励" —— 一个<s class="t-mute">什么都没有</s><span class="t-yellow t-bold">藏满秘密</span>的终端。',
    );
    out("");

    const progressLineId = Date.now();
    lines.value.push(
      `<span id="prog-${progressLineId}" class="t-mute">系统载入中 [........................................] 0%</span>`,
    );
    const progressIdx = lines.value.length - 1;
    let p = 0;

    const interval = setInterval(() => {
      p += 2;
      const blocks = Math.floor(p / 2.5);
      const empty = 40 - blocks;
      const blockStr = "█".repeat(blocks);
      const emptyStr = "░".repeat(empty);

      // Update the progress line safely
      lines.value[progressIdx] =
        `<span id="prog-${progressLineId}" class="t-mute">系统载入中 [</span><span class="t-yellow">${blockStr}</span><span class="t-mute">${emptyStr}] ${String(p).padStart(3, " ")}%</span>`;

      if (p >= 100) {
        clearInterval(interval);
        // Completely hide the progress line after completion
        lines.value[progressIdx] = "";
        setTimeout(showAscii, 200);
      }
    }, 40);

    function showAscii() {
      // Remove empty lines above ASCII to close the gap created by hiding the progress bar
      if (lines.value[lines.value.length - 1] === "") {
        lines.value.pop();
      }

      outHtml(
        '<span class="t-mute">========================================================================</span>',
      );
      const art = [
        '<span class="t-cyan t-bold"> ____   ___  _   _  ____ ____  _   _  ____ _   _ _____ _   _  ____ </span>',
        '<span class="t-cyan t-bold">|  _ \\ / _ \\| \\ | |/ ___| __ )| | | |/ ___| | | | ____| \\ | |/ ___|</span>',
        '<span class="t-cyan t-bold">| | | | | | |  \\| | |  _|  _ \\| | | | |   | |_| |  _| |  \\| | | \\_ </span>',
        '<span class="t-cyan t-bold">| |_| | |_| | |\\  | |_| | |_) | |_| | |___|  _  | |___| |\\  | |_| |</span>',
        '<span class="t-cyan t-bold">|____/ \\___/|_| \\_|\\____|____/ \\___/ \\____|_| |_|_____|_| \\_|\\____|</span>',
      ];
      art.forEach((a) => outHtml(a));
      out("");
      outHtml(
        '<span class="t-mute">========================================================================</span>',
      );
      out("");

      const now = new Date();
      const dateStr = now.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      outHtml(`<span class="t-mute">Last login: ${dateStr} on ttys002</span>`);
      setTimeout(() => {
        const uuid =
          "b7a3f8c2-19e4-4d2a-8b11-" + Math.random().toString(16).slice(2, 14);
        outHtml(`<span class="t-mute">Restored session: ${uuid}</span>`);
        setTimeout(() => {
          outHtml(
            '<span class="t-yellow">⚠ 所有操作将被记录。输入 help 查看可用命令。</span>',
          );
          outHtml(
            '<span class="t-blue">💡 提示: 输入 </span><span class="t-green">cat Desktop/resume.md</span><span class="t-blue"> 查看我的简历。</span>',
          );
          out("");
          ready.value = true;
        }, 400);
      }, 300);
    }
  }

  // ── Command execution ──
  function exec(raw) {
    const trimmed = raw.trim();
    // Always add the prompt line
    outHtml(promptHtml.value + escapeHtml(trimmed));

    if (!trimmed) return;

    cmdHistory.value.push(trimmed);
    historyIdx.value = cmdHistory.value.length;

    const spaceIdx = trimmed.indexOf(" ");
    const cmd = spaceIdx === -1 ? trimmed : trimmed.slice(0, spaceIdx);
    const argStr = spaceIdx === -1 ? "" : trimmed.slice(spaceIdx + 1).trim();
    const args = argStr ? argStr.split(/\s+/) : [];

    const handlers = {
      ls: cmdLs,
      cd: cmdCd,
      cat: cmdCat,
      pwd: cmdPwd,
      whoami: cmdWhoami,
      clear: cmdClear,
      help: cmdHelp,
      echo: cmdEcho,
      date: cmdDate,
      sudo: cmdSudo,
      rm: cmdRm,
      exit: cmdExit,
      neofetch: cmdNeofetch,
      history: cmdHistoryCmd,
      uname: cmdUname,
      id: cmdId,
      mkdir: cmdReadonly,
      touch: cmdReadonly,
      mv: cmdReadonly,
      cp: cmdReadonly,
      chmod: cmdReadonly,
      chown: cmdReadonly,
      vim: cmdVim,
      nano: cmdVim,
      vi: cmdVim,
      ssh: cmdSsh,
      ping: cmdPing,
      curl: cmdCurl,
      open: cmdOpen,
      say: cmdSay,
      chat: cmdChat,
      play: cmdPlay,
      screenfetch: cmdNeofetch,
    };

    const handler = handlers[cmd];
    if (handler) {
      handler(args, argStr);
    } else {
      out(`zsh: command not found: ${escapeHtml(cmd)}`);
    }
  }

  // ── Commands ──

  function cmdLs(args) {
    const showAll =
      args.includes("-a") ||
      args.includes("-la") ||
      args.includes("-al") ||
      args.includes("-l");
    const pathArg = args.find((a) => !a.startsWith("-")) || ".";
    const absPath = pathArg === "." ? cwd.value : resolvePath(pathArg);
    const node = getNode(absPath);
    if (node === null) {
      out(`ls: ${escapeHtml(pathArg)}: No such file or directory`);
      return;
    }
    if (!isDir(node)) {
      out(pathArg.split("/").pop());
      return;
    }
    let entries = Object.keys(node);
    if (!showAll) entries = entries.filter((e) => !e.startsWith("."));
    if (showAll) entries = [".", "..", ...entries];
    if (entries.length === 0) return;
    const colored = entries.map((e) => {
      if (e === "." || e === "..")
        return `<span class="t-bold t-blue">${e}</span>`;
      const child = node[e];
      return isDir(child)
        ? `<span class="t-bold t-blue">${escapeHtml(e)}</span>`
        : escapeHtml(e);
    });
    outHtml(colored.join("  "));
  }

  function cmdCd(args) {
    const target = args[0] || "~";
    const absPath = resolvePath(target);
    const node = getNode(absPath);
    if (node === null) {
      out(`cd: no such file or directory: ${escapeHtml(target)}`);
      return;
    }
    if (!isDir(node)) {
      out(`cd: not a directory: ${escapeHtml(target)}`);
      return;
    }
    cwd.value = absPath;
  }

  function cmdCat(args) {
    if (args.length === 0) {
      out("cat: 用法: cat <文件名>");
      return;
    }
    const target = args[0];
    const absPath = resolvePath(target);
    const node = getNode(absPath);
    if (node === null) {
      out(`cat: ${escapeHtml(target)}: No such file or directory`);
      return;
    }
    if (isDir(node)) {
      out(`cat: ${escapeHtml(target)}: Is a directory`);
      return;
    }
    let contentHtml = "";
    if (target.endsWith(".md")) {
      // Basic Markdown formatting for terminal
      contentHtml = node
        .split("\n")
        .map((line) => {
          let l = escapeHtml(line);
          if (l.startsWith("# "))
            return `<span class="t-bold t-blue" style="font-size: 1.2em;">${l.substring(2)}</span>`;
          if (l.startsWith("## "))
            return `<span class="t-bold t-cyan">${l.substring(3)}</span>`;
          if (l.startsWith("### "))
            return `<span class="t-bold t-green">${l.substring(4)}</span>`;
          if (l.startsWith("- ") || l.startsWith("* "))
            return `<span class="t-yellow">●</span> ${l.substring(2)}`;
          // Bold parsing (**text**)
          l = l.replace(/\*\*(.*?)\*\*/g, '<span class="t-bold">$1</span>');
          return l || "<br>"; // Preserve empty lines
        })
        .join("<br>");
      outHtml(`<div style="padding: 10px 0;">${contentHtml}</div>`);
    } else {
      node.split("\n").forEach((line) => out(escapeHtml(line)));
    }
  }

  function cmdPwd() {
    out(cwd.value);
  }
  function cmdWhoami() {
    out("dongbucheng (被骗的人)");
  }

  function cmdClear() {
    lines.value = [];
  }

  function cmdHelp() {
    outHtml('<span class="t-yellow">可用命令:</span>');
    const cmds = [
      ["ls [路径]", "列出目录内容 (-a 显示隐藏文件)"],
      ["cd <路径>", "切换目录"],
      ["cat <文件>", "查看文件内容"],
      ["pwd", "显示当前目录"],
      ["whoami", "显示当前用户"],
      ["neofetch", "显示系统信息"],
      ["echo <文本>", "输出文本"],
      ["date", "显示日期"],
      ["history", "查看命令历史"],
      ["uname -a", "显示系统信息"],
      ["clear", "清空终端"],
      ["help", "显示此帮助"],
      ["chat <文本>", "建立安全连接与管理员对话"],
      ["play <...>", "??? (HIDDEN_PROTOCOL)"],
    ];
    cmds.forEach(([cmd, desc]) => {
      outHtml(
        `  <span class="t-green">${cmd.padEnd(18)}</span> <span class="t-mute">${desc}</span>`,
      );
    });
  }

  function cmdEcho(args, argStr) {
    out(escapeHtml(argStr));
  }

  function cmdDate() {
    out(
      new Date().toLocaleString("zh-CN", {
        dateStyle: "full",
        timeStyle: "long",
      }),
    );
  }

  function cmdSudo(args, argStr) {
    if (argStr.trim() === "rm -rf /" || argStr.trim() === "rm -rf /*") {
      outHtml(
        '<span class="t-red t-bold">⚠️ FATAL: INITIATING SYSTEM PURGE...</span>',
      );
      triggerGlitch.value = true;
      return;
    }

    outHtml('<span class="t-red">Password: </span>********');
    outHtml(
      `<span class="t-red">dong is not in the sudoers file. This incident will be reported.</span>`,
    );
    out("");
    outHtml('<span class="t-mute">你以为自己是管理员？在这个假终端里？</span>');
  }

  function cmdRm(args) {
    outHtml(`<span class="t-red">rm: Operation not permitted</span>`);
    out("别想删除证据，一切都已记录在案。");
  }

  function cmdExit() {
    out("logout");
    out("");
    outHtml('<span class="t-yellow">你以为你能逃离这个终端？</span>');
    outHtml(
      '<span class="t-mute">刷新页面也没用，你还得再做五轮验证 :)</span>',
    );
  }

  function cmdNeofetch() {
    const art = [
      `<span class="t-green">                    'c.          </span> <span class="t-bold">dong</span>@<span class="t-bold">MacBook-Pro</span>`,
      `<span class="t-green">                 ,xNMM.          </span> <span class="t-mute">──────────────────────</span>`,
      `<span class="t-yellow">               .OMMMMo           </span> <span class="t-bold">OS:</span> macOS Prank 14.0 &#x1F921;`,
      `<span class="t-yellow">               OMMM0,            </span> <span class="t-bold">Host:</span> 骗你的 MacBook Pro`,
      `<span class="t-red">     .;loddo:' loolloddol;.     </span> <span class="t-bold">Kernel:</span> Troll 23.6.0`,
      `<span class="t-red">   cKMMMMMMMMMMNWMMMMMMMMMM0:   </span> <span class="t-bold">Uptime:</span> 从你被骗开始算起`,
      `<span class="t-magenta">  .KMMMMMMMMMMMMMMMMMMMMMMMWd.  </span> <span class="t-bold">Shell:</span> zsh 5.9 (假的)`,
      `<span class="t-magenta">  XMMMMMMMMMMMMMMMMMMMMMMMX.   </span> <span class="t-bold">Terminal:</span> 虚假终端 v2.0`,
      `<span class="t-blue"> ;MMMMMMMMMMMMMMMMMMMMMMMM:    </span> <span class="t-bold">CPU:</span> 整蛊处理器 M4 (16) @ 4.00GHz`,
      `<span class="t-blue"> :MMMMMMMMMMMMMMMMMMMMMMMM:    </span> <span class="t-bold">Memory:</span> 0B / ∞B`,
      `<span class="t-cyan"> .MMMMMMMMMMMMMMMMMMMMMMMMX.   </span> <span class="t-bold">GPU:</span> 不存在的显卡 16GB`,
      `<span class="t-cyan">  kMMMMMMMMMMMMMMMMMMMMMMMMWd.  </span> <span class="t-bold">Disk:</span> 0% of 0GB`,
      `<span class="t-green">   .XMMMMMMMMMMMMMMMMMMMMK.    </span>`,
      `<span class="t-green">     kMMMMMMMMMMMMMMMMMMd.     </span> <span class="t-yellow">你被耍了 :)</span>`,
    ];
    art.forEach((line) => outHtml(line));
  }

  function cmdHistoryCmd() {
    cmdHistory.value.forEach((cmd, i) => {
      outHtml(
        `  <span class="t-mute">${String(i + 1).padStart(4)}</span>  ${escapeHtml(cmd)}`,
      );
    });
  }

  function cmdUname(args) {
    if (args.includes("-a")) {
      out(
        "Darwin MacBook-Pro.local 23.6.0 Darwin Kernel Version 23.6.0 (FAKE): root:xnu-1337/RELEASE_ARM64_T6000 arm64",
      );
    } else {
      out("Darwin");
    }
  }

  function cmdId() {
    out("uid=501(dong) gid=20(staff) groups=20(staff),被骗的人");
  }

  function cmdReadonly(args) {
    outHtml(
      '<span class="t-red">Operation not permitted: 这是一个只读文件系统</span>',
    );
    out("你觉得在一个假终端里创建文件有什么意义吗？");
  }

  function cmdVim() {
    outHtml('<span class="t-yellow">正在启动编辑器...</span>');
    out("");
    out("开玩笑的。这里连 vim 都没有。");
    out("就算有，你也退不出来的。");
  }

  function cmdSsh() {
    outHtml(
      '<span class="t-red">ssh: connect to host: Connection refused</span>',
    );
    out("你想连到哪里去？这里是一个假终端。");
  }

  function cmdPing(args) {
    const host = args[0] || "localhost";
    outHtml(`PING ${escapeHtml(host)}: 56 data bytes`);
    outHtml(
      `64 bytes from nowhere: icmp_seq=0 ttl=64 time=<span class="t-yellow">999.999</span> ms`,
    );
    outHtml(
      `64 bytes from nowhere: icmp_seq=1 ttl=64 time=<span class="t-yellow">∞</span> ms`,
    );
    out("");
    outHtml(
      `<span class="t-mute">--- ${escapeHtml(host)} ping statistics ---</span>`,
    );
    out("2 packets transmitted, 0 packets received, 100.0% packet loss");
    out("(因为这是假的)");
  }

  function cmdCurl() {
    outHtml(
      '<span class="t-red">curl: (7) Failed to connect: 你在一个假终端里</span>',
    );
  }

  function cmdOpen() {
    out("没有什么可以打开的。这里什么都没有。");
    out("就像你完成的那五轮验证一样 —— 毫无意义。");
  }

  function cmdSay(args, argStr) {
    if (!argStr) {
      out("say: 你想让我说什么？");
      return;
    }
    outHtml(`<span class="t-cyan">🔊 "${escapeHtml(argStr)}"</span>`);
    outHtml('<span class="t-mute">(并没有真的发出声音)</span>');
  }

  function cmdChat(args, argStr) {
    if (!argStr) {
      outHtml('<span class="t-yellow">Usage: chat &lt;message&gt;</span>');
      return;
    }
    
    // Simulate thinking delay
    isGaming.value = true; // Temporarily block input while "admin" is typing
    outHtml(`<span class="t-mute">Connecting to secure channel...</span>`);
    
    setTimeout(() => {
      outHtml(`<span class="t-green">Connection established.</span>`);
      
      setTimeout(() => {
        let reply = "";
        const msg = argStr.toLowerCase();
        
        if (msg.includes("hello") || msg.includes("hi") || msg.includes("你好")) {
          reply = "System Administrator is currently AFK... Wait, who are you and how did you get here?";
        } else if (msg.includes("who are you") || msg.includes("你是谁")) {
          reply = "I'm the watchdog of this server. You shouldn't be here.";
        } else if (msg.includes("admin") || msg.includes("root")) {
          reply = "Nice try. Access denied.";
        } else if (msg.includes("fuck") || msg.includes("shit") || msg.includes("sb")) {
          reply = "Language! Your IP has been logged and reported to the cyber police.";
        } else {
          reply = `I am receiving your message: "${escapeHtml(argStr)}", but I have strict orders not to engage with intruders.`;
        }

        outHtml(`<span class="t-red t-bold">&gt; Admin:</span> <span class="t-red">${reply}</span>`);
        isGaming.value = false; // Release input block
      }, 1500); // Admin "typing" time
    }, 800); // Connection time
  }

  function injectAdminMessage() {
    outHtml('<span class="t-red t-bold">&gt; System Admin:</span> <span class="t-red">Are you still there? The connection is getting stale...</span>');
  }

  // ── History navigation ──
  function historyUp() {
    if (cmdHistory.value.length === 0) return null;
    if (historyIdx.value > 0) historyIdx.value--;
    return cmdHistory.value[historyIdx.value] || "";
  }

  function historyDown() {
    if (historyIdx.value < cmdHistory.value.length - 1) {
      historyIdx.value++;
      return cmdHistory.value[historyIdx.value];
    }
    historyIdx.value = cmdHistory.value.length;
    return "";
  }

  // ── Tab completion ──
  function tabComplete(input) {
    const parts = input.split(" ");
    if (parts.length === 0) return null;
    const lastPart = parts[parts.length - 1];

    // We only support auto-completing files/directories in the current dir for now
    // to keep it simple for the prank
    if (lastPart.includes("/")) return null; // Too complex for fake FS right now

    const node = getNode(cwd.value);
    if (!isDir(node)) return null;

    const entries = Object.keys(node);
    const matches = entries.filter((e) => e.startsWith(lastPart));

    if (matches.length === 1) {
      parts[parts.length - 1] =
        matches[0] + (isDir(node[matches[0]]) ? "/" : "");
      return parts.join(" ");
    }
    // If multiple matches, we don't complete (could print them but keep it simple)
    return null;
  }

  init();

  return {
    lines,
    cwd,
    displayDir,
    promptHtml,
    exec,
    historyUp,
    historyDown,
    tabComplete,
    ready,
    triggerGlitch,
    isGaming,
    handleGameInput,
    injectAdminMessage,
  };
}

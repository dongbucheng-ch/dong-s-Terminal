import { ref, computed } from "vue";

const HOME = "/Users/dong";

const FS = {
  Applications: {},
  Library: {},
  System: {},
  Users: {
    dong: {
      Desktop: {
        "绝密文件.txt":
          "你真的以为这里会有什么绝密内容吗？\n\n醒醒，这是一个整蛊网站。",
        "resume.md": `# 马至东 (全栈工程师)\n\n## 👨‍💻 基本信息\n- **年龄**: 26岁 / 男\n- **电话**: 17386115596\n- **邮箱**: dong_960010@163.com\n- **教育**: 武昌理工学院 | 智能科学与技术 | 本科 | 2022年毕业\n\n## 🌟 自我评价\n3年前端 + 1年全栈开发经验。近一年转向 **Go** 后端，独立完成广告竞价引擎（**OpenRTB**）、多租户 **SaaS** 平台、分布式事件管道等后端系统的设计与落地。前端以 **Vue/Nuxt** 为主，有 **Monorepo** 架构下100+包管理与100+生产站点交付经验。深度使用 **AI** 辅助工程化开发，有 **LLM API** 产品化落地经验。\n\n## 🛠️ 专业技能\n- **核心语言**: Go、Node.js(TypeScript)、PHP\n- **后端框架**: Gin / fasthttp / Koa / Laravel\n- **前端框架**: Vue 3 / Nuxt（SSR/SSG）/ 微信小程序\n- **数据存储**: MySQL（查询优化、索引设计）/ MongoDB（聚合管道）/ Redis（多级缓存、分布式锁）\n- **工程体系**: Turborepo + pnpm Workspace / Vite 构建优化 / ECharts 数据可视化\n- **基础设施**: Docker + Docker Compose / Jenkins CI/CD / Nginx / Cloudflare R2 / Prometheus\n\n## 💼 工作经历\n### 深圳市帆睿科技有限公司 | 全栈工程师 (2025/5 ～ 2025/12)\n- 负责海外 ADX 广告交易平台全链路开发（Go竞价引擎 + PHP管理后台 + Go数据管道），从架构设计到生产部署。\n- 从零搭建多租户内容管理与数据分析平台（Node.js），完成事件采集 → 缓冲处理 → 多维分析全链路。\n- 负责多站点内容分发前端工程体系（Nuxt），基于 Monorepo 架构管理 100+ 工作空间包，支撑 100+ 生产站点。\n- 搭建 Docker Compose + Jenkins 容器化部署与 CI/CD 流水线。\n\n### 广东蕾特恩科技发展有限公司 | 前端开发工程师 (2022/4 ～ 2025/3)\n- 负责多个业务系统的前端开发，覆盖小程序、Web 管理后台、数据大屏等多端场景。\n- 搭建 Vue 组件库，抽象通用业务模块，建立代码审查机制。\n- 推动阿里云 CI/CD 自动化部署落地，搭建内部技术 Wiki。\n\n## 🚀 项目经历\n### 1. 海外 ADX 程序化广告交易平台\n- **技术栈**: Go(Gin/fasthttp/ants) + PHP(Laravel) + MySQL + Redis + Docker + Prometheus\n- **描述**: 基于 OpenRTB 2.5协议的海外移动广告交易平台，承接 SSP 流量并对接多家 DSP 进行实时竞价（RTB），支持 Banner、视频（VAST 3.0）、原生、激励视频等广告类型。系统分三层：Go 竞价引擎 + PHP 管理后台 + Go 定时任务数据管道。\n- **核心工作**: 采用 ants 协程池实现扇出/汇聚模式，单次竞价 ~500ms；设计三级缓存（内存 -> Redis -> MySQL），热路径读取延迟降至微秒级；采用布谷鸟过滤器进行黑名单匹配。\n\n### 2. Pressly - 多租户内容管理与数据分析平台\n- **技术栈**: Koa + MongoDB + Redis + Redlock + Cloudflare R2 + Docker Compose\n- **描述**: 从零搭建的多租户SaaS内容管理平台，日均处理10万级埋点事件。\n- **核心**: 基于 Redis List 设计分桶缓冲方案处理高频埋点；引入 Redlock 抢锁处理多实例并发消费；基于 MongoDB $facet 并行聚合管道实现多维分析引擎。\n\n### 3. 多站点内容分发与广告变现前端平台\n- **技术栈**: Nuxt(Vue 3/SSR/SSG) + TypeScript + Turborepo + pnpm Workspace + Vite\n- **描述**: 基于 Monorepo 架构的多站点内容分发平台前端工程体系，支撑 100+ 生产站点。\n- **核心**: 设计 @nuxt-config 统一提供基础配置，环境变量驱动 Feature Flags；首页/文章详情页用 SSG 预渲染保障 SEO；封装 AdUnit 组件支持多种广告类型懒加载。\n\n### 4. 企业级数字化业务系统集群\n- **技术栈**: Vue.js + Vuex + Element UI + ECharts + 微信小程序 + 火山引擎 RTC + FastGPT\n- **描述**: 为连锁企业（800+门店）开发的数字化系统集群。\n- **核心**: 拆分小程序包体积；集成 RTC SDK 实现 P2P 音视频通话与弱网降级策略；基于 ECharts 实现全国门店万级数据节点 60fps 流畅展示；集成 FastGPT 实现智能客服。`,
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
          "真相只有一个：\n\n这个网站从来就没有任何内容。\n你完成的每一个验证码都是假的。\n这个终端也是假的。\n一切都是假的。\n\n你被耍了 :)\n\n—— 来自一个快乐的开发者",
        ".hidden_msg":
          "你居然找到了隐藏文件里的隐藏文件\n\n尊重！但这里也什么都没有。",
      },
      Music: {},
      Pictures: {
        "自拍.jpg": "[无法显示图片]\n\n反正也不是你的自拍。放心。",
      },
      "README.md":
        "# 欢迎来到虚假终端 v2.0\n\n恭喜你发现了这个彩蛋终端。\n这里没有任何有价值的信息。\n\n可用命令: ls, cd, cat, pwd, whoami, clear, help, neofetch\n\n祝你玩得开心 :)",
      ".zshrc":
        '# ~/.zshrc\nexport PATH="/usr/local/bin:$PATH"\nexport PRANK="true"\n# 你在看什么？这也是假的。',
    },
    Shared: {},
  },
  etc: {
    hosts:
      "127.0.0.1\tlocalhost\n::1\t\tlocalhost\n127.0.0.1\tyou-got-pranked.com",
    passwd:
      "root:*:0:0:System Administrator:/var/root:/bin/sh\ndong:*:501:20:被骗的人:/Users/dong:/bin/zsh",
  },
  tmp: {
    ".debug.log":
      "[2026-02-26 14:00:00] 检测到新的受害者\n[2026-02-26 14:00:01] 开始第一轮虚假验证\n[2026-02-26 14:02:30] 受害者仍在点击\n[2026-02-26 14:05:00] 五轮验证全部完成，启动终端\n[2026-02-26 14:05:01] 受害者开始怀疑人生",
  },
  var: {},
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

  const displayDir = computed(() => {
    if (cwd.value === HOME) return "~";
    if (cwd.value.startsWith(HOME + "/"))
      return "~" + cwd.value.slice(HOME.length);
    return cwd.value;
  });

  const promptHtml = computed(() => {
    return `<span class="t-green">dong@MacBook-Pro</span> <span class="t-blue">${escapeHtml(displayDir.value)}</span> <span class="t-mute">%</span> `;
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
    out('现在，欢迎体验你的"奖励" —— 一个什么都没有的终端。');
    out("");

    lines.value.push("系统载入中 [....................] 0%");
    const progressIdx = lines.value.length - 1;
    let p = 0;

    const interval = setInterval(() => {
      p += 4;
      const blocks = Math.floor(p / 5);
      const empty = 20 - blocks;
      lines.value[progressIdx] =
        `系统载入中 [${"#".repeat(blocks)}${".".repeat(empty)}] ${p}%`;
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(showAscii, 400);
      }
    }, 60);

    function showAscii() {
      out("");
      const art = [
        '<span class="t-cyan"> ____   ___  _   _  ____ ____  _   _  ____ _   _ _____ _   _  ____ </span>',
        '<span class="t-cyan">|  _ \\ / _ \\| \\ | |/ ___| __ )| | | |/ ___| | | | ____| \\ | |/ ___|</span>',
        '<span class="t-cyan">| | | | | | |  \\| | |  _|  _ \\| | | | |   | |_| |  _| |  \\| | | \\_ </span>',
        '<span class="t-cyan">| |_| | |_| | |\\  | |_| | |_) | |_| | |___|  _  | |___| |\\  | |_| |</span>',
        '<span class="t-cyan">|____/ \\___/|_| \\_|\\____|____/ \\___/ \\____|_| |_|_____|_| \\_|\\____|</span>',
      ];
      art.forEach((a) => outHtml(a));
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
    out("dong (被骗的人)");
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
  };
}

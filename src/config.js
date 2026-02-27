// ═══════════════════════════════════════════
//  配置区域 — 替换为你自己的密钥
// ═══════════════════════════════════════════

export const CFG = {
  siteName: "Dong's-Terminal",

  // Cloudflare Turnstile 站点密钥
  // 测试密钥（总是通过）: 1x00000000000000000000AA
  // 生产环境请到 https://dash.cloudflare.com/ 获取真实密钥
  // turnstileKey: "0x4AAAAAACipA082J-j9iniR",
  turnstileKey: "1x00000000000000000000AA",

  // Google reCAPTCHA v2 站点密钥
  // 测试密钥（总是通过）: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
  // 生产环境请到 https://www.google.com/recaptcha/admin 获取真实密钥
  // recaptchaKey: "6Lefo3gsAAAAAOnwBnb8QjyLE5NcWc18bA1oUPRj",
  recaptchaKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",

  // Supabase
  supabaseUrl: "https://chchrhcihgylwmrkacog.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY2hyaGNpaGd5bHdtcmthY29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzkxNjIsImV4cCI6MjA4Nzc1NTE2Mn0.diuMotv4mc4WgZFYRvSbjqyj1028tMpbnGXXRy864bo",
};

export const STEPS = [
  {
    badge: "安全网关",
    title: `${CFG.siteName}的个人主页`,
    desc: "检测到当前会话存在风险特征，请先完成一次行为验证。",
    widget: "turnstile",
    hint: "通常仅需一次验证，完成后系统将自动处理后续流程。",
  },
  {
    badge: "二次校验",
    title: "继续验证",
    desc: "网络环境命中轻度风险标记，需要额外的 Turnstile 验证。",
    widget: "turnstile",
    hint: "完成本轮后将自动切换到最终验证方式。",
  },
  {
    badge: "高级验证",
    title: "图像识别校验",
    desc: "系统已切换为 Google reCAPTCHA，请按提示完成图像选择。",
    widget: "recaptcha",
    hint: "建议按图中要求精确选择，通常 1 至 2 组即可通过。",
  },
  {
    badge: "进度 66%",
    title: "核验进行中",
    desc: "系统正在交叉校验识别结果，请继续完成下一组。",
    widget: "recaptcha",
    hint: "已接近完成，保持当前验证节奏即可。",
  },
  {
    badge: "进度 98%",
    title: "最终校验",
    desc: "最后一轮验证正在执行，完成后将进行最终判定。",
    widget: "recaptcha",
    hint: "请耐心完成本轮，系统会自动给出结果。",
  },
];

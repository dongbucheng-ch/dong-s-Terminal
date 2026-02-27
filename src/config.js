export const CFG = {
  siteName: "Dong's-Terminal",
  turnstileKey: import.meta.env.VITE_TURNSTILE_KEY,
  recaptchaKey: import.meta.env.VITE_RECAPTCHA_KEY,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
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

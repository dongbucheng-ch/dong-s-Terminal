import { createApp } from "vue";
import App from "./App.vue";

// ── 禁用开发者工具 ──

// 1. 禁用右键菜单
document.addEventListener("contextmenu", (e) => e.preventDefault());

// 2. 禁用常见快捷键 (F12, Ctrl/Cmd+Shift+I/J/C, Ctrl/Cmd+U)
document.addEventListener("keydown", (e) => {
  if (e.key === "F12") {
    e.preventDefault();
    return;
  }
  if (
    (e.ctrlKey || e.metaKey) &&
    e.shiftKey &&
    ["I", "i", "J", "j", "C", "c"].includes(e.key)
  ) {
    e.preventDefault();
    return;
  }
  if ((e.ctrlKey || e.metaKey) && (e.key === "u" || e.key === "U")) {
    e.preventDefault();
  }
});

// 3. DevTools 检测 — 利用 debugger 时间差
(function detectDevTools() {
  const threshold = 160;
  setInterval(() => {
    const start = performance.now();
    // debugger 在 devtools 打开时会造成明显延迟
    // eslint-disable-next-line no-debugger
    debugger;
    if (performance.now() - start > threshold) {
      document.title = "请关闭开发者工具";
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:24px;color:#ff4400;font-family:monospace;text-align:center;padding:20px;">⚠ 检测到开发者工具已打开<br>请关闭后刷新页面</div>';
    }
  }, 1000);
})();

createApp(App).mount("#app");

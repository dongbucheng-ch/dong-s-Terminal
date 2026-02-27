import { ref } from "vue";
import { supabase } from "../lib/supabase.js";

const COLORS = [
  "rgba(229, 255, 0, 0.4)",
  "rgba(0, 255, 85, 0.4)",
  "rgba(255, 68, 0, 0.4)",
  "rgba(0, 212, 255, 0.4)",
  "rgba(255, 110, 180, 0.4)",
  "rgba(255, 165, 0, 0.4)",
  "rgba(123, 104, 238, 0.4)",
  "rgba(255, 255, 255, 0.35)",
];

const COLOR_REGEX = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*[\d.]+\s*)?\)$/;
const FALLBACK_COLOR = "rgba(255, 255, 255, 0.35)";

function safeColor(color) {
  return COLOR_REGEX.test(color) ? color : FALLBACK_COLOR;
}

export function useDanmaku() {
  const danmakuList = ref([]);
  let channel = null;

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  async function loadHistory() {
    const { data } = await supabase
      .from("danmaku")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) {
      danmakuList.value = data.reverse().map((d) => ({
        ...d,
        color: safeColor(d.color),
      }));
    }
  }

  function subscribe(onNewDanmaku) {
    channel = supabase
      .channel("danmaku-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "danmaku" },
        (payload) => {
          const safe = { ...payload.new, color: safeColor(payload.new.color) };
          danmakuList.value.push(safe);
          if (onNewDanmaku) onNewDanmaku(safe);
        }
      )
      .subscribe();
  }

  async function send(content) {
    const text = content.trim().slice(0, 50);
    if (!text) return false;
    const color = randomColor();
    const { data, error } = await supabase.rpc("send_danmaku", {
      p_content: text,
      p_color: color,
    });
    if (error) console.error("[danmaku] send failed:", error);
    return !error && data === true;
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  }

  return { danmakuList, loadHistory, subscribe, send, unsubscribe };
}

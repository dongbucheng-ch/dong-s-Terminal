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
      danmakuList.value = data.reverse();
    }
  }

  function subscribe(onNewDanmaku) {
    channel = supabase
      .channel("danmaku-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "danmaku" },
        (payload) => {
          danmakuList.value.push(payload.new);
          if (onNewDanmaku) onNewDanmaku(payload.new);
        }
      )
      .subscribe();
  }

  async function send(content) {
    const text = content.trim().slice(0, 50);
    if (!text) return false;
    const color = randomColor();
    const { error } = await supabase
      .from("danmaku")
      .insert({ content: text, color });
    return !error;
  }

  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  }

  return { danmakuList, loadHistory, subscribe, send, unsubscribe };
}

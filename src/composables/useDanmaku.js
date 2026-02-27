import { ref } from "vue";
import { supabase } from "../lib/supabase.js";

const COLORS = [
  "#e5ff00", "#00ff55", "#ff4400", "#00d4ff",
  "#ff6eb4", "#ffa500", "#7b68ee", "#ffffff",
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

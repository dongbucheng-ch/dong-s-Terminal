import { ref } from "vue";
import { supabase } from "../lib/supabase.js";

const visitCount = ref(null);

export function useVisitCounter() {
  async function incrementAndGet() {
    if (sessionStorage.getItem("visit_counted")) {
      const { data } = await supabase
        .from("visit_counter")
        .select("count")
        .eq("id", 1)
        .single();
      if (data) visitCount.value = data.count;
      return;
    }

    const { data, error } = await supabase.rpc("increment_visit");
    if (!error && data !== null) {
      visitCount.value = data;
      sessionStorage.setItem("visit_counted", "1");
    }
  }

  return { visitCount, incrementAndGet };
}

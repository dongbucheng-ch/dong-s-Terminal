import { ref, watch } from "vue";

// Global state
const isDark = ref(true);
const isGlitching = ref(false);

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value;
    if (isDark.value) {
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
    }
  }

  function triggerGlitch() {
    isGlitching.value = true;
    document.documentElement.classList.add("glitch-mode");

    // Auto recover after some time or redirect
    setTimeout(() => {
      window.location.href = "https://www.dongbucheng.fun";
    }, 4500);
  }

  return {
    isDark,
    isGlitching,
    toggleTheme,
    triggerGlitch,
  };
}

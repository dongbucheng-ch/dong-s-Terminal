import { ref, watch } from 'vue'

// Global state
const isDark = ref(true)

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.remove('light-theme')
    } else {
      document.documentElement.classList.add('light-theme')
    }
  }

  return {
    isDark,
    toggleTheme
  }
}

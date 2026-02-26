<template>
  <BackgroundLayer />
  <Transition name="page" mode="out-in">
    <SecurityGateway v-if="phase === 'verify'" key="verify" @complete="onComplete" />
    <RevealPage v-else key="reveal" />
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import BackgroundLayer from './components/BackgroundLayer.vue'
import SecurityGateway from './components/SecurityGateway.vue'
import RevealPage from './components/RevealPage.vue'

const phase = ref('verify')

function onComplete() {
  phase.value = 'reveal'
  document.title = '你被耍了 :)'
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; overflow: hidden; }
body {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #080c18;
  color: #f0f2f8;
  transition: background 0.5s, color 0.5s;
}
html.light-theme body {
  background: #ffffff;
  color: #111;
}
#app {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
}

.page-enter-active { animation: pageIn 0.55s cubic-bezier(.22,1,.36,1) both; }
.page-leave-active { animation: pageOut 0.35s ease-in both; }
@keyframes pageIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes pageOut {
  to { opacity: 0; transform: translateY(-14px) scale(0.98); }
}
</style>

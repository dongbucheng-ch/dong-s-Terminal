<template>
  <BackgroundLayer />
  <Transition name="page" mode="out-in">
    <SecurityGateway v-if="phase === 'verify'" key="verify" @complete="onComplete" />
    <RevealPage v-else key="reveal" :skipped-verify="skippedVerify" />
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import BackgroundLayer from './components/BackgroundLayer.vue'
import SecurityGateway from './components/SecurityGateway.vue'
import RevealPage from './components/RevealPage.vue'

const phase = ref('verify')
const skippedVerify = ref(false)

function onComplete() {
  phase.value = 'reveal'
  document.title = '你被耍了 :)'
}

function handleGlobalKeydown(e) {
  if (e.key === 'x' && (e.ctrlKey || e.metaKey)) {
    e.preventDefault()
    if (phase.value !== 'reveal') {
      skippedVerify.value = true
      onComplete()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; overflow: auto; }
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
  width: 100%; min-height: 100%;
  display: flex; align-items: center; justify-content: center;
  padding: 40px 0;
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

/* --- Global Glitch Mode --- */
html.glitch-mode body {
  animation: glitch-bg 0.2s linear infinite;
}
html.glitch-mode #app {
  animation: glitch-shake 0.3s cubic-bezier(.36,.07,.19,.97) infinite;
  filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="glitch"><feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" /></filter></svg>#glitch');
}
html.glitch-mode .card, html.glitch-mode .terminal {
  box-shadow: -10px 0 0 rgba(255,0,0,0.8), 10px 0 0 rgba(0,255,255,0.8);
  animation: rgb-shift 0.1s infinite alternate;
}

@keyframes glitch-bg {
  0% { background: #000; }
  50% { background: #080c18; }
  100% { background: #1a0000; }
}
@keyframes glitch-shake {
  0% { transform: translate(2px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(0px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(2px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(2px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}
@keyframes rgb-shift {
  0% { transform: skewX(0deg); }
  10% { transform: skewX(-2deg); }
  20% { transform: skewX(0deg); }
  30% { transform: skewX(1deg); }
  40% { transform: skewX(0deg); }
}
</style>

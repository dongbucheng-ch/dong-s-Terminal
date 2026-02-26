<template>
  <div class="card" ref="cardRef" :class="{ shake: isShaking }">
    <div class="scanline"></div>
    <Transition name="step" mode="out-in" @after-enter="onAfterEnter">
      <div class="step-inner" :key="stepKey">
        <div class="hdr">
          <div class="badge">{{ currentStep.badge }}</div>
          <div class="moon-btn" @click="toggleTheme">
            <svg v-if="isDark" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg v-else viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </div>
        </div>
        <h1 class="title">{{ currentStep.title }}</h1>
        <p class="desc">{{ currentStep.desc }}</p>
        <div class="widget-wrap">
          <div class="wg-box" ref="wgBox"></div>
          <p class="warn" :class="{ show: showWarning, 'error-color': isErrorColor }">{{ warningText }}</p>
          <div class="status-indicator">
            <span v-if="isLoading" class="status-text loading">正在建立安全连接...</span>
            <span v-if="isFailed" class="status-text failed">组件加载失败或环境异常</span>
          </div>
        </div>
        <hr class="sep">
        <p class="hint">{{ currentStep.hint }}</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { STEPS, CFG } from '../config.js'
import { useTilt } from '../composables/useTilt.js'
import { useTheme } from '../composables/useTheme.js'

const { isDark, toggleTheme } = useTheme()
const emit = defineEmits(['complete'])

const cardRef = ref(null)
useTilt(cardRef)

const stepIdx = ref(0)
const stepKey = ref(0)
const showWarning = ref(false)
const warningText = ref('')
const isShaking = ref(false)
const isErrorColor = ref(false)
const wgBox = ref(null)
const transitioning = ref(false)
const isLoading = ref(true)
const isFailed = ref(false)

let turnstileReady = false
let recaptchaReady = false
let turnstileQueue = []
let recaptchaQueue = []

const currentStep = computed(() => STEPS[stepIdx.value])

function loadSDKs() {
  window.onTurnstileReady = () => {
    turnstileReady = true
    turnstileQueue.forEach(fn => fn())
    turnstileQueue = []
  }
  const ts = document.createElement('script')
  ts.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=onTurnstileReady'
  ts.async = true
  document.head.appendChild(ts)

  window.onRecaptchaReady = () => {
    recaptchaReady = true
    recaptchaQueue.forEach(fn => fn())
    recaptchaQueue = []
  }
  const rc = document.createElement('script')
  rc.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaReady&render=explicit&hl=zh-CN'
  rc.async = true
  document.head.appendChild(rc)
}

function renderWidget() {
  const box = wgBox.value
  if (!box) return
  box.innerHTML = ''
  const el = document.createElement('div')
  el.id = 'wg-' + stepIdx.value + '-' + Date.now()
  box.appendChild(el)

  isLoading.value = true
  isFailed.value = false

  const s = currentStep.value
  if (s.widget === 'turnstile') {
    const go = () => {
      try {
        window.turnstile.render(el, {
          sitekey: CFG.turnstileKey,
          callback: onVerified,
          'error-callback': () => { isFailed.value = true; isLoading.value = false },
          'expired-callback': () => { isFailed.value = true; isLoading.value = false },
          theme: isDark.value ? 'dark' : 'light',
          language: 'zh-cn',
        })
        // Turnstile doesn't have a reliable generic load callback before render completes in some network states, 
        // so we'll just optimistically hide the loader after a short delay assuming the iframe popped in
        setTimeout(() => { isLoading.value = false }, 800)
      } catch (e) { 
        console.warn('Turnstile error:', e)
        isFailed.value = true
        isLoading.value = false
      }
    }
    turnstileReady ? go() : turnstileQueue.push(go)
  } else {
    const go = () => {
      try {
        window.grecaptcha.render(el.id, {
          sitekey: CFG.recaptchaKey,
          callback: onVerified,
          'error-callback': () => { isFailed.value = true; isLoading.value = false },
          theme: isDark.value ? 'dark' : 'light',
        })
        setTimeout(() => { isLoading.value = false }, 800)
      } catch (e) { 
        console.warn('reCAPTCHA error:', e) 
        isFailed.value = true
        isLoading.value = false
      }
    }
    recaptchaReady ? go() : recaptchaQueue.push(go)
  }
}

function onVerified() {
  if (transitioning.value) return
  transitioning.value = true

  setTimeout(() => {
    warningText.value = '置信度不足，请继续完成下一轮验证...'
    showWarning.value = true
    isShaking.value = true
    isErrorColor.value = true
    
    setTimeout(() => { 
      isShaking.value = false
      isErrorColor.value = false 
    }, 300)

    setTimeout(() => {
      if (stepIdx.value >= STEPS.length - 1) {
        emit('complete')
      } else {
        showWarning.value = false
        warningText.value = ''
        stepIdx.value++
        stepKey.value++
        transitioning.value = false
      }
    }, 2000)
  }, 600)
}

function onAfterEnter() {
  renderWidget()
}

onMounted(() => {
  loadSDKs()
  renderWidget()
})
</script>

<style scoped>
.card {
  position: relative; z-index: 1;
  width: 92%; max-width: 760px; min-height: 500px;
  padding: 44px 52px 36px;
  border-radius: 8px; /* Sharper edges */
  background: rgba(10, 12, 16, 0.9); /* Darker, more opaque */
  border: 3px solid rgba(229, 255, 0, 0.2); /* ZZZ Yellow accent border */
  box-shadow: 0 0 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(229, 255, 0, 0.05);
  display: flex; flex-direction: column; overflow: hidden;
  transition: all 0.5s ease-in-out;
}
/* Industrial top bar accent */
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: #e5ff00;
  z-index: 2;
  transition: all 0.5s ease-in-out;
}
.step-inner { display: flex; flex-direction: column; flex: 1; }

.step-enter-active { animation: sIn 0.45s cubic-bezier(.22,1,.36,1) both; }
.step-leave-active { animation: sOut 0.3s ease-in both; }
@keyframes sIn { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
@keyframes sOut { to { opacity:0; transform:translateY(-10px); } }

.hdr { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; }
.badge {
  display:inline-flex; align-items:center;
  padding:7px 18px; border-radius:18px;
  background:rgba(50,70,120,0.35); border:3px solid rgba(90,130,210,0.25);
  font-size:13px; font-weight:500; color:rgba(190,210,255,0.8);
  letter-spacing:0.6px; white-space:nowrap;
  transition: all 0.5s ease-in-out;
}
.moon-btn {
  width:42px; height:42px; border-radius:50%;
  background:rgba(255,255,255,0.04); border:3px solid rgba(255,255,255,0.08);
  display:flex; align-items:center; justify-content:center; cursor:pointer;
  transition: all 0.5s ease-in-out;
}
.moon-btn:hover { background:rgba(255,255,255,0.08); }
.moon-btn svg { width:18px; height:18px; fill:none; stroke:rgba(200,215,240,0.5); stroke-width:2; stroke-linecap:round; stroke-linejoin:round; transition: stroke 0.5s ease-in-out; }
.title { font-size:34px; font-weight:900; line-height:1.35; margin-bottom:10px; letter-spacing:-0.3px; transition: color 0.5s ease-in-out; }
.desc { font-size:15.5px; color:rgba(200,210,230,0.55); line-height:1.65; margin-bottom:36px; transition: color 0.5s ease-in-out; }
.widget-wrap { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; min-height:120px; position: relative; }
.wg-box { display:flex; align-items:center; justify-content:center; min-height:74px; }
.status-indicator { position: absolute; bottom: 0; left: 0; }
.status-text { font-size: 11px; font-family: monospace; letter-spacing: 0.5px; opacity: 0.6; transition: color 0.5s ease; }
.status-text.loading { color: #57c7ff; animation: pulse 1.5s infinite; }
.status-text.failed { color: #ff5a6e; }
:global(.light-theme .status-text.loading) { color: #0b72ba; }
:global(.light-theme .status-text.failed) { color: #d62f2f; }
@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
.warn {
  font-size:15px; font-weight:500; color:#f0a050;
  min-height:24px; text-align:center;
  opacity:0; transform:translateY(6px);
  transition: opacity 0.5s, transform 0.5s, color 0.3s, background 0.3s;
}
.warn.error-color { color: #ff5a6e; }
.warn.show { opacity:1; transform:translateY(0); }
.sep { border:none; border-top:1px dashed rgba(140,170,220,0.12); margin:auto 0 14px 0; width:100%; transition: border-color 0.5s ease-in-out; }
.hint { font-size:13.5px; color:rgba(160,175,200,0.35); line-height:1.6; transition: color 0.5s ease-in-out; }

.shake {
  animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d(6px, 0, 0); }
}

.scanline {
  position: absolute; left: 0; right: 0; top: 0; height: 120px;
  background: linear-gradient(to bottom, transparent, rgba(100, 150, 255, 0.05) 50%, rgba(150, 200, 255, 0.15) 100%);
  opacity: 0.6; pointer-events: none; z-index: 0;
  animation: scan 4s linear infinite;
}
@keyframes scan {
  0% { transform: translateY(-120px); }
  100% { transform: translateY(800px); }
}

/* --- Light Theme --- */
:global(.light-theme .card) {
  background: #FFFFFF;
  border: 3px solid #333333;
  box-shadow: 4px 4px 0 #1A1A1A;
  border-radius: 0; /* Brutalist sharp edges */
}
:global(.light-theme .badge) {
  background: #333333;
  border: none;
  color: #FFFFFF;
  font-family: monospace;
  border-radius: 2px;
}
:global(.light-theme .moon-btn) {
  background: transparent;
  border: 2px solid #333333;
  border-radius: 0;
}
:global(.light-theme .moon-btn:hover) { background: rgba(51, 51, 51, 0.05); }
:global(.light-theme .moon-btn svg) { stroke: #333333; }
:global(.light-theme .title) { 
  color: #1A1A1A; 
  font-style: italic;
  font-weight: 900;
  letter-spacing: -0.05em;
}
:global(.light-theme .desc) { color: #666666; font-family: monospace; }
:global(.light-theme .sep) { border-top: 2px dashed rgba(51, 51, 51, 0.15); }
:global(.light-theme .hint) { color: #999999; font-family: monospace; }
:global(.light-theme .card::before) { background: #FF9800; height: 6px; } /* Orange accent */
:global(.light-theme .warn) { color: #FF9800; font-family: monospace; font-weight: 900; }
:global(.light-theme .warn.error-color) { color: #1A1A1A; background: #FF9800; display: inline-block; padding: 2px 8px; }

@media (max-width:640px) {
  .card { padding:32px 24px 28px; min-height:440px; border-radius:18px; }
  .title { font-size:26px; }
  .desc { font-size:14px; margin-bottom:24px; }
}
</style>

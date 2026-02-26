<template>
  <div class="terminal" ref="terminalRef" @click="focusInput">
    <!-- Title bar -->
    <div class="title-bar">
      <div class="traffic-lights">
        <span class="light close"></span>
        <span class="light minimize"></span>
        <span class="light maximize"></span>
      </div>
      <span class="title-text">Dong's Terminal — zsh — 80×24</span>
      <div class="title-spacer"></div>
    </div>
    <!-- Body -->
    <div class="body" ref="bodyRef">
      <div v-for="(line, i) in terminal.lines.value" :key="i" class="line" v-html="line"></div>
      <!-- Input line -->
      <div class="line input-line" v-if="terminal.ready.value">
        <span v-html="terminal.promptHtml.value"></span>
        <span>{{ currentInput }}</span>
        <span class="cursor" :class="{ blink: focused }">█</span>
      </div>
    </div>
    <!-- Hidden input for keyboard capture -->
    <input
      ref="inputRef"
      class="hidden-input"
      v-model="currentInput"
      @keydown="onKeyDown"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
    />
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useTerminal } from '../composables/useTerminal.js'
import { useTilt } from '../composables/useTilt.js'

const terminal = useTerminal()
const currentInput = ref('')
const focused = ref(true)
const bodyRef = ref(null)
const inputRef = ref(null)

const terminalRef = ref(null)
useTilt(terminalRef)

function focusInput() {
  inputRef.value?.focus()
}

function scrollToBottom() {
  nextTick(() => {
    const el = bodyRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

function onKeyDown(e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    terminal.exec(currentInput.value)
    currentInput.value = ''
    scrollToBottom()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    const prev = terminal.historyUp()
    if (prev !== null) currentInput.value = prev
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    const next = terminal.historyDown()
    if (next !== null) currentInput.value = next
  } else if (e.key === 'c' && e.ctrlKey) {
    e.preventDefault()
    terminal.exec(currentInput.value + '^C')
    currentInput.value = ''
    scrollToBottom()
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault()
    terminal.exec('clear')
    scrollToBottom()
  }
}

function onFocus() { focused.value = true }
function onBlur() { focused.value = false }

watch(() => terminal.lines.value.length, scrollToBottom)

onMounted(() => {
  inputRef.value?.addEventListener('focus', onFocus)
  inputRef.value?.addEventListener('blur', onBlur)
  // Auto focus
  setTimeout(() => focusInput(), 100)
})

onUnmounted(() => {
  inputRef.value?.removeEventListener('focus', onFocus)
  inputRef.value?.removeEventListener('blur', onBlur)
})
</script>

<style scoped>
.terminal {
  width: 100%;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 12px 48px rgba(0,0,0,0.8), 0 0 0 3px rgba(229,255,0,0.15);
  display: flex; flex-direction: column;
  background: #080a0e;
  cursor: text;
  transition: all 0.5s ease-in-out;
}

/* ── Title bar ── */
.title-bar {
  height: 32px;
  background: #12141a;
  display: flex; align-items: center;
  padding: 0 14px;
  flex-shrink: 0;
  user-select: none;
  border-bottom: 3px solid rgba(229,255,0,0.1);
  transition: all 0.5s ease-in-out;
}
.traffic-lights { display: flex; gap: 8px; }
.light {
  width: 10px; height: 10px; border-radius: 2px; /* Square lights for industrial feel */
  transition: all 0.5s ease-in-out;
}
.light.close { background: #ff4400; }
.light.minimize { background: #e5ff00; }
.light.maximize { background: #00ff55; }
.title-text {
  flex: 1; text-align: center;
  font-size: 11px; color: #a0a5b5;
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  transition: color 0.5s ease-in-out;
}
.title-spacer { width: 52px; }

/* ── Body ── */
.body {
  flex: 1;
  padding: 10px 14px;
  overflow-y: auto;
  font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.55;
  color: #ccc;
  min-height: 200px;
  max-height: 360px;
  transition: color 0.5s ease-in-out;
}
.body::-webkit-scrollbar { width: 6px; }
.body::-webkit-scrollbar-track { background: transparent; }
.body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; transition: background 0.5s ease-in-out; }

.line {
  white-space: pre-wrap;
  word-break: break-all;
  min-height: 1.55em;
}

.input-line {
  display: flex;
  flex-wrap: wrap;
  transition: color 0.5s ease-in-out;
}

/* ── Cursor ── */
.cursor {
  color: #ccc;
  font-weight: normal;
  transition: color 0.5s ease-in-out;
}
.cursor.blink {
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ── Hidden input ── */
.hidden-input {
  position: fixed;
  top: -100px; left: -100px;
  width: 1px; height: 1px;
  opacity: 0;
  border: none; outline: none;
}

/* --- Light Theme --- */
:global(.light-theme .terminal) {
  background: #FFFFFF;
  border: 3px solid #333333;
  border-radius: 0; /* Brutalist sharp edges */
  box-shadow: 4px 4px 0 #1A1A1A;
}
:global(.light-theme .title-bar) {
  background: #FFFFFF;
  border-bottom: 3px solid #333333;
}
:global(.light-theme .light) { border-radius: 0; border: 2px solid #333333; width: 12px; height: 12px; }
:global(.light-theme .light.close) { background: #FF9800; } /* Accent orange */
:global(.light-theme .light.minimize) { background: #FFFFFF; }
:global(.light-theme .light.maximize) { background: #1A1A1A; }
:global(.light-theme .title-text) { 
  color: #1A1A1A; 
  font-family: monospace; 
  letter-spacing: 0.1em; 
  font-size: 14px; 
  font-weight: 900; 
  font-style: italic;
}
:global(.light-theme .body) { color: #333333; font-family: monospace; font-weight: 700; }
:global(.light-theme .input-line) { color: #1A1A1A; }
:global(.light-theme .body::-webkit-scrollbar-thumb) { background: rgba(51,51,51,0.2); border-radius: 0; }
:global(.light-theme .cursor) { color: #FF9800; } /* Orange cursor */

/* ── Terminal colors ── */
:deep(.t-green) { color: #5af78e; }
:global(.light-theme) :deep(.t-green) { color: #333333; }
:deep(.t-blue) { color: #57c7ff; }
:global(.light-theme) :deep(.t-blue) { color: #1A1A1A; text-decoration: underline; }
:deep(.t-red) { color: #ff6b6b; }
:global(.light-theme) :deep(.t-red) { color: #FFFFFF; background: #FF9800; display: inline-block; padding: 0 4px; }
:deep(.t-yellow) { color: #f3f99d; }
:global(.light-theme) :deep(.t-yellow) { color: #FF9800; font-weight: 900; }
:deep(.t-magenta) { color: #ff6ac1; }
:global(.light-theme) :deep(.t-magenta) { color: #1A1A1A; background: rgba(255,152,0,0.2); }
:deep(.t-cyan) { color: #9aedfe; }
:global(.light-theme) :deep(.t-cyan) { color: #333333; font-style: italic; }
:deep(.t-mute) { color: #666; }
:global(.light-theme) :deep(.t-mute) { color: #999999; }
:deep(.t-bold) { font-weight: bold; color: #fff; }
:global(.light-theme) :deep(.t-bold) { color: #1A1A1A; font-weight: 900; }

@media (max-width: 640px) {
  .body { font-size: 11px; max-height: 280px; padding: 8px 10px; }
  .title-bar { height: 30px; }
  .light { width: 10px; height: 10px; }
  .title-text { font-size: 11px; }
}
</style>

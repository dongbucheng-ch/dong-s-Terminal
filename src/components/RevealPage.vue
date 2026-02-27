<template>
  <vue-danmaku
    ref="danmakuRef"
    v-model:danmus="danmakuList"
    class="danmaku-container"
    loop
    :speeds="120"
    :channels="0"
    randomChannel
    :debounce="200"
    :z-index="999"
  >
    <template #danmu="{ danmu }">
      <span class="danmaku-text" :style="{ color: danmu.color }">{{
        danmu.content
      }}</span>
    </template>
  </vue-danmaku>
  <DanmakuInput
    @send="onSendDanmaku"
    @toggle-visible="toggleDanmaku"
    :danmaku-visible="danmakuVisible"
  />
  <div class="card reveal-card" ref="cardRef">
    <div class="hdr">
      <!-- <div class="spacer"></div> -->
      <div class="badge danger">Access Denied</div>
      <h1 class="title">YOU GOT PRANKED</h1>
      <div class="spacer end">
        <div class="moon-btn" @click="toggleTheme">
          <svg v-if="isDark" viewBox="0 0 24 24">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <svg v-else viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </div>
      </div>
    </div>

    <MacTerminal
      style="flex: 1; min-height: 500px"
      :skipped-verify="skippedVerify"
    />
  </div>
  <p class="visit-count" v-if="visitCount !== null">
    第 {{ visitCount }} 位<s>被整</s>陷入欢愉的人 · 什么是欢愉?! 这！就是欢愉
  </p>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import vueDanmaku from "vue-danmaku";
import MacTerminal from "./MacTerminal.vue";
import DanmakuInput from "./DanmakuInput.vue";
import { useTilt } from "../composables/useTilt.js";
import { useTheme } from "../composables/useTheme.js";
import { useDanmaku } from "../composables/useDanmaku.js";
import { useVisitCounter } from "../composables/useVisitCounter.js";

const props = defineProps({
  skippedVerify: Boolean,
});

const { isDark, toggleTheme } = useTheme();
const cardRef = ref(null);
const danmakuVisible = ref(true);
const danmakuRef = ref(null);
useTilt(cardRef);

const { danmakuList, loadHistory, subscribe, send, unsubscribe } = useDanmaku();
const { visitCount, incrementAndGet } = useVisitCounter();

function onSendDanmaku(content) {
  send(content);
}

function toggleDanmaku() {
  danmakuVisible.value = !danmakuVisible.value;
  if (danmakuVisible.value) {
    danmakuRef.value?.show();
  } else {
    danmakuRef.value?.hide();
  }
}

onMounted(() => {
  incrementAndGet();
  loadHistory().then(() => {
    subscribe((newDanmu) => {
      danmakuRef.value?.insert(newDanmu);
    });
  });
});

onUnmounted(() => {
  unsubscribe();
});
</script>

<style scoped>
.danmaku-container {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  pointer-events: none;
}
.danmaku-text {
  font-family: "Maple Mono", monospace;
  font-size: 16px;
  white-space: nowrap;
}

.card {
  position: relative;
  z-index: 1001;
  width: 92%;
  max-width: 800px;
  padding: 20px 30px 30px;
  border-radius: 8px; /* Sharper edges */
  background: rgba(10, 12, 16, 0.9); /* Darker, more opaque */
  border: 3px solid rgba(255, 68, 0, 0.2); /* Hot Orange accent border */
  box-shadow:
    0 0 30px rgba(0, 0, 0, 0.8),
    inset 0 0 20px rgba(255, 68, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.5s ease-in-out;
}
/* Industrial top bar accent */
.card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #ff4400; /* Hot Orange */
  z-index: 2;
  transition: all 0.5s ease-in-out;
}

.hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height: 45px;
}
/* .spacer {
  flex: 1;
} */
.spacer.end {
  display: flex;
  justify-content: flex-end;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 7px 18px;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.6px;
  white-space: nowrap;
  transition: all 0.5s ease-in-out;
}
.badge.danger {
  background: rgba(220, 60, 80, 0.18);
  border: 3px solid rgba(255, 90, 110, 0.35);
  color: #ffa0b0;
}

.moon-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 3px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s ease-in-out;
}
.moon-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}
.moon-btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: rgba(200, 215, 240, 0.5);
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 0.5s ease-in-out;
}

.title {
  font-size: 30px;
  font-weight: 900;
  font-style: italic;
  text-align: center;
  margin-bottom: 6px;
  letter-spacing: -0.3px;
  line-height: 45px;
  transition: color 0.5s ease-in-out;
}

.visit-count {
  position: fixed;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  text-align: center;
  font-size: 12px;
  color: rgba(200, 210, 230, 0.35);
  font-weight: 400;
  letter-spacing: 0.5px;
  transition: color 0.5s ease-in-out;
  white-space: nowrap;
}
.visit-count s {
  text-decoration: line-through;
  opacity: 0.7;
}

/* --- Light Theme --- */
:global(.light-theme .card) {
  background: #ffffff;
  border: 3px solid #333333;
  box-shadow: 4px 4px 0 #1a1a1a;
  border-radius: 0;
}
:global(.light-theme .badge.danger) {
  background: #ff9800;
  border: 2px solid #333333;
  color: #1a1a1a;
  font-family: monospace;
  font-weight: 900;
  border-radius: 0;
}
:global(.light-theme .moon-btn) {
  background: transparent;
  border: 2px solid #333333;
  border-radius: 0;
}
:global(.light-theme .moon-btn:hover) {
  background: rgba(51, 51, 51, 0.05);
}
:global(.light-theme .moon-btn svg) {
  stroke: #333333;
}
:global(.light-theme .title) {
  color: #1a1a1a;
  font-style: italic;
  font-weight: 900;
  letter-spacing: -0.05em;
}
:global(.light-theme .visit-count) {
  color: rgba(0, 0, 0, 0.3);
  font-family: monospace;
}
:global(.light-theme .card::before) {
  background: #ff9800;
  height: 6px;
}

@media (max-width: 640px) {
  .card {
    padding: 28px 20px 28px;
    border-radius: 18px;
    max-width: 100%;
  }
  .title {
    font-size: 30px;
  }
  .reveal-text p {
    font-size: 13px;
  }
}
</style>

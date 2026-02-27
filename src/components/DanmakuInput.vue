<template>
  <div class="danmaku-fab-wrapper">
    <!-- 输入框区域 -->
    <div class="danmaku-input-area" :class="{ open }">
      <input
        ref="inputRef"
        v-model="text"
        class="danmaku-input"
        placeholder="发一条弹幕..."
        maxlength="50"
        @keydown.enter="handleSend"
        @keydown.esc="open = false"
      />
    </div>
    <!-- 圆形按钮 -->
    <button class="danmaku-fab" :class="{ active: open }" @click="toggleOpen">
      <svg v-if="!open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";

const emit = defineEmits(["send"]);
const text = ref("");
const sending = ref(false);
const open = ref(false);
const inputRef = ref(null);

function toggleOpen() {
  open.value = !open.value;
  if (open.value) {
    nextTick(() => inputRef.value?.focus());
  }
}

async function handleSend() {
  if (!text.value.trim() || sending.value) return;
  sending.value = true;
  emit("send", text.value);
  text.value = "";
  setTimeout(() => {
    sending.value = false;
  }, 1000);
}
</script>

<style scoped>
.danmaku-fab-wrapper {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 1002;
  display: flex;
  align-items: center;
  gap: 0;
}

/* 输入框区域 */
.danmaku-input-area {
  overflow: hidden;
  width: 0;
  opacity: 0;
  transform: translateX(20px) scale(0.8);
  transition:
    width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease,
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.danmaku-input-area.open {
  width: 260px;
  opacity: 1;
  transform: translateX(0) scale(1);
  pointer-events: auto;
  margin-right: 12px;
}

.danmaku-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 24px;
  background: rgba(10, 12, 16, 0.85);
  backdrop-filter: blur(12px);
  color: #f0f2f8;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.danmaku-input:focus {
  border-color: rgba(229, 255, 0, 0.5);
}
.danmaku-input::placeholder {
  color: rgba(200, 210, 230, 0.3);
}

/* 圆形 FAB 按钮 */
.danmaku-fab {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(229, 255, 0, 0.3);
  background: rgba(10, 12, 16, 0.85);
  backdrop-filter: blur(12px);
  color: #e5ff00;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    background 0.2s,
    border-color 0.2s;
}
.danmaku-fab:hover {
  background: rgba(229, 255, 0, 0.15);
  border-color: rgba(229, 255, 0, 0.6);
  transform: scale(1.1);
}
.danmaku-fab:active {
  transform: scale(0.92);
}
.danmaku-fab.active {
  background: rgba(229, 255, 0, 0.1);
  border-color: rgba(229, 255, 0, 0.5);
}
.danmaku-fab svg {
  width: 22px;
  height: 22px;
}

/* Light Theme */
:global(.light-theme) .danmaku-input {
  border: 2px solid #333;
  background: rgba(255, 255, 255, 0.95);
  color: #1a1a1a;
  border-radius: 0;
}
:global(.light-theme) .danmaku-input:focus {
  border-color: #ff9800;
}
:global(.light-theme) .danmaku-input::placeholder {
  color: #999;
}
:global(.light-theme) .danmaku-fab {
  border: 2px solid #333;
  background: #ff9800;
  color: #1a1a1a;
}
:global(.light-theme) .danmaku-fab:hover {
  background: #ffb74d;
  border-color: #333;
}
:global(.light-theme) .danmaku-fab.active {
  background: #ff9800;
  border-color: #333;
  color: #1a1a1a;
}
:global(.light-theme) .danmaku-fab.active:hover {
  background: #ffb74d;
}

/* 移动端适配 */
@media (max-width: 640px) {
  .danmaku-fab-wrapper {
    bottom: 20px;
    right: 20px;
  }
  .danmaku-input-area.open {
    width: 200px;
  }
  .danmaku-fab {
    width: 44px;
    height: 44px;
  }
}
</style>

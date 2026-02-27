<template>
  <div class="danmaku-input-bar">
    <input
      v-model="text"
      class="danmaku-input"
      placeholder="发一条弹幕..."
      maxlength="50"
      @keydown.enter="handleSend"
    />
    <button class="danmaku-send-btn" @click="handleSend" :disabled="sending">
      {{ sending ? "..." : "发送" }}
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["send"]);
const text = ref("");
const sending = ref(false);

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
.danmaku-input-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.danmaku-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
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

.danmaku-send-btn {
  padding: 8px 20px;
  border: 1px solid rgba(229, 255, 0, 0.4);
  border-radius: 4px;
  background: rgba(229, 255, 0, 0.1);
  color: #e5ff00;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.danmaku-send-btn:hover:not(:disabled) {
  background: rgba(229, 255, 0, 0.2);
}
.danmaku-send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Light Theme */
:global(.light-theme) .danmaku-input-bar {
  background: rgba(0, 0, 0, 0.03);
  border-top: 2px solid #333;
}
:global(.light-theme) .danmaku-input {
  border: 2px solid #333;
  background: #fff;
  color: #1a1a1a;
  border-radius: 0;
}
:global(.light-theme) .danmaku-input:focus {
  border-color: #ff9800;
}
:global(.light-theme) .danmaku-input::placeholder {
  color: #999;
}
:global(.light-theme) .danmaku-send-btn {
  border: 2px solid #333;
  background: #ff9800;
  color: #1a1a1a;
  font-weight: 900;
  border-radius: 0;
}
:global(.light-theme) .danmaku-send-btn:hover:not(:disabled) {
  background: #ffb74d;
}
</style>

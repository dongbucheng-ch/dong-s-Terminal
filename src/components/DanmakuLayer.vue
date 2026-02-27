<template>
  <div class="danmaku-layer" ref="layerRef" v-show="visible">
    <div
      v-for="item in activeItems"
      :key="item.uid"
      class="danmaku-item"
      :style="{
        color: item.color,
        top: item.top + 'px',
        animationDuration: item.duration + 's',
      }"
      @animationend="removeItem(item.uid)"
    >
      {{ item.content }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  danmakuList: { type: Array, default: () => [] },
  visible: { type: Boolean, default: true },
});

const layerRef = ref(null);
const activeItems = ref([]);
let uidCounter = 0;
let historyTimer = null;

function getLayerHeight() {
  return layerRef.value?.clientHeight || window.innerHeight * 0.5;
}

function addToScreen(item) {
  const height = getLayerHeight();
  const top = Math.random() * (height - 30);
  const duration = 8 + Math.random() * 4;
  activeItems.value.push({
    ...item,
    uid: uidCounter++,
    top,
    duration,
  });
}

function removeItem(uid) {
  activeItems.value = activeItems.value.filter((i) => i.uid !== uid);
}

// 历史弹幕池，包含历史 + 后续新增的弹幕，循环播放
let pool = [];

function startLoop() {
  if (historyTimer) return;
  let index = 0;
  historyTimer = setInterval(() => {
    if (pool.length === 0) return;
    addToScreen(pool[index % pool.length]);
    index++;
  }, 500);
}

let lastLength = 0;
watch(
  () => props.danmakuList.length,
  (newLen) => {
    if (newLen > lastLength) {
      if (lastLength === 0) {
        pool = [...props.danmakuList.slice(0, newLen)];
        startLoop();
      } else {
        for (let i = lastLength; i < newLen; i++) {
          pool.push(props.danmakuList[i]);
          addToScreen(props.danmakuList[i]);
        }
      }
    }
    lastLength = newLen;
  }
);

onUnmounted(() => {
  if (historyTimer) clearInterval(historyTimer);
});
</script>

<style scoped>
.danmaku-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 999;
}

.danmaku-item {
  position: absolute;
  right: 0;
  white-space: nowrap;
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  font-weight: 400;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.9);
  animation: danmaku-scroll linear forwards;
  transform: translateX(100%);
}

@keyframes danmaku-scroll {
  from {
    transform: translateX(100%);
    right: 0;
  }
  to {
    transform: translateX(0);
    right: 100%;
  }
}
</style>

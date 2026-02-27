<template>
  <div class="danmaku-layer" ref="layerRef">
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
import { ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  danmakuList: { type: Array, default: () => [] },
});

const layerRef = ref(null);
const activeItems = ref([]);
let uidCounter = 0;
let historyTimer = null;

function getLayerHeight() {
  return layerRef.value?.clientHeight || 300;
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

function playHistory(list) {
  let index = 0;
  historyTimer = setInterval(() => {
    if (index >= list.length) {
      clearInterval(historyTimer);
      historyTimer = null;
      return;
    }
    addToScreen(list[index]);
    index++;
  }, 300);
}

let lastLength = 0;
watch(
  () => props.danmakuList.length,
  (newLen) => {
    if (newLen > lastLength && lastLength > 0) {
      for (let i = lastLength; i < newLen; i++) {
        addToScreen(props.danmakuList[i]);
      }
    }
    lastLength = newLen;
  }
);

onMounted(() => {
  if (props.danmakuList.length > 0) {
    lastLength = props.danmakuList.length;
    playHistory(props.danmakuList);
  }
});

onUnmounted(() => {
  if (historyTimer) clearInterval(historyTimer);
});
</script>

<style scoped>
.danmaku-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
}

.danmaku-item {
  position: absolute;
  right: 0;
  white-space: nowrap;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
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

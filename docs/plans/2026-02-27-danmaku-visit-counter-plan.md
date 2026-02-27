# 评论弹幕 + 访问计数 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为整蛊网站添加 Supabase 驱动的实时弹幕评论和访问计数功能

**Architecture:** 使用 Supabase 作为 BaaS，前端通过 `@supabase/supabase-js` SDK 与 Supabase 交互。弹幕通过 Realtime 订阅实现实时推送，访问计数通过 RPC 函数原子递增。

**Tech Stack:** Vue 3 + Composition API, Supabase (Realtime + RPC), CSS Animations

**Design Doc:** `docs/plans/2026-02-27-danmaku-visit-counter-design.md`

---

### Task 1: Supabase 数据库初始化

**说明：** 在 Supabase 控制台中手动执行以下 SQL，创建表、RPC 函数和 RLS 策略。本任务无代码提交，但需要将 SQL 保存为参考文档。

**Files:**
- Create: `docs/supabase-schema.sql`

**Step 1: 创建 SQL 文件**

```sql
-- ==========================================
-- 弹幕表
-- ==========================================
create table danmaku (
  id bigint generated always as identity primary key,
  content text not null check (char_length(content) <= 50),
  color text not null default '#ffffff',
  created_at timestamptz not null default now()
);

-- RLS
alter table danmaku enable row level security;

create policy "Anyone can read danmaku"
  on danmaku for select
  to anon
  using (true);

create policy "Anyone can insert danmaku"
  on danmaku for insert
  to anon
  with check (char_length(content) <= 50);

-- ==========================================
-- 访问计数表
-- ==========================================
create table visit_counter (
  id int primary key default 1 check (id = 1),
  count bigint not null default 0
);

-- 插入初始行
insert into visit_counter (id, count) values (1, 0);

-- RLS
alter table visit_counter enable row level security;

create policy "Anyone can read visit_counter"
  on visit_counter for select
  to anon
  using (true);

-- ==========================================
-- RPC: 原子递增访问计数
-- ==========================================
create or replace function increment_visit()
returns bigint
language sql
security definer
as $$
  update visit_counter set count = count + 1 where id = 1 returning count;
$$;
```

**Step 2: 在 Supabase 控制台 SQL Editor 中执行上述 SQL**

**Step 3: 确认 Realtime 已开启**

在 Supabase 控制台 -> Database -> Replication 中，确保 `danmaku` 表的 Insert 事件已启用 Realtime。

**Step 4: Commit**

```bash
git add docs/supabase-schema.sql
git commit -m "docs: add supabase schema SQL for danmaku and visit counter"
```

---

### Task 2: 安装依赖 + Supabase 客户端初始化

**Files:**
- Modify: `package.json`（npm install 自动修改）
- Create: `src/lib/supabase.js`
- Modify: `src/config.js`

**Step 1: 安装 Supabase SDK**

Run: `npm install @supabase/supabase-js`

**Step 2: 在 config.js 中添加 Supabase 配置**

在 `src/config.js` 的 `CFG` 对象中添加：

```js
// Supabase
supabaseUrl: "https://YOUR_PROJECT.supabase.co",
supabaseAnonKey: "YOUR_ANON_KEY",
```

> 注意：需要用户提供实际的 Supabase URL 和 anon key。

**Step 3: 创建 Supabase 客户端**

```js
// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";
import { CFG } from "../config.js";

export const supabase = createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
```

**Step 4: 验证依赖安装成功**

Run: `npm run dev`
Expected: 项目正常启动，无报错

**Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/supabase.js src/config.js
git commit -m "feat: add supabase client initialization"
```

---

### Task 3: 访问计数 composable

**Files:**
- Create: `src/composables/useVisitCounter.js`

**Step 1: 实现 useVisitCounter**

```js
// src/composables/useVisitCounter.js
import { ref } from "vue";
import { supabase } from "../lib/supabase.js";

const visitCount = ref(null);

export function useVisitCounter() {
  async function incrementAndGet() {
    // 防止同一会话重复计数
    if (sessionStorage.getItem("visit_counted")) {
      // 已经计数过，只获取当前值
      const { data } = await supabase
        .from("visit_counter")
        .select("count")
        .eq("id", 1)
        .single();
      if (data) visitCount.value = data.count;
      return;
    }

    const { data, error } = await supabase.rpc("increment_visit");
    if (!error && data !== null) {
      visitCount.value = data;
      sessionStorage.setItem("visit_counted", "1");
    }
  }

  return { visitCount, incrementAndGet };
}
```

**Step 2: Commit**

```bash
git add src/composables/useVisitCounter.js
git commit -m "feat: add visit counter composable"
```

---

### Task 4: 弹幕 composable

**Files:**
- Create: `src/composables/useDanmaku.js`

**Step 1: 实现 useDanmaku**

```js
// src/composables/useDanmaku.js
import { ref } from "vue";
import { supabase } from "../lib/supabase.js";

const COLORS = [
  "#e5ff00", "#00ff55", "#ff4400", "#00d4ff",
  "#ff6eb4", "#ffa500", "#7b68ee", "#ffffff",
];

export function useDanmaku() {
  const danmakuList = ref([]);
  let channel = null;

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  // 加载最近 100 条历史弹幕
  async function loadHistory() {
    const { data } = await supabase
      .from("danmaku")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) {
      danmakuList.value = data.reverse();
    }
  }

  // 订阅 Realtime 新弹幕
  function subscribe() {
    channel = supabase
      .channel("danmaku-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "danmaku" },
        (payload) => {
          danmakuList.value.push(payload.new);
        }
      )
      .subscribe();
  }

  // 发送弹幕
  async function send(content) {
    const text = content.trim().slice(0, 50);
    if (!text) return false;
    const color = randomColor();
    const { error } = await supabase
      .from("danmaku")
      .insert({ content: text, color });
    return !error;
  }

  // 清理订阅
  function unsubscribe() {
    if (channel) {
      supabase.removeChannel(channel);
      channel = null;
    }
  }

  return { danmakuList, loadHistory, subscribe, send, unsubscribe };
}
```

**Step 2: Commit**

```bash
git add src/composables/useDanmaku.js
git commit -m "feat: add danmaku composable with realtime subscription"
```

---

### Task 5: 弹幕渲染层组件 DanmakuLayer.vue

**Files:**
- Create: `src/components/DanmakuLayer.vue`

**Step 1: 实现弹幕飘屏组件**

弹幕从右到左飘过，随机高度，CSS animation 驱动。组件接收弹幕数组，自动播放历史弹幕并处理新弹幕。

```vue
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
  const duration = 8 + Math.random() * 4; // 8-12 秒飘过
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

// 播放历史弹幕：逐条加入，间隔 300ms
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

// 监听新弹幕（realtime 推送的）
let lastLength = 0;
watch(
  () => props.danmakuList.length,
  (newLen) => {
    // 只处理新增的弹幕
    if (newLen > lastLength && lastLength > 0) {
      for (let i = lastLength; i < newLen; i++) {
        addToScreen(props.danmakuList[i]);
      }
    }
    lastLength = newLen;
  }
);

onMounted(() => {
  // 初始播放历史
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
```

**Step 2: Commit**

```bash
git add src/components/DanmakuLayer.vue
git commit -m "feat: add DanmakuLayer component for scrolling danmaku display"
```

---

### Task 6: 弹幕输入组件 DanmakuInput.vue

**Files:**
- Create: `src/components/DanmakuInput.vue`

**Step 1: 实现弹幕输入框**

```vue
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
  // 简单的防刷：发送后短暂禁用
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
```

**Step 2: Commit**

```bash
git add src/components/DanmakuInput.vue
git commit -m "feat: add DanmakuInput component"
```

---

### Task 7: 集成到 RevealPage

**Files:**
- Modify: `src/components/RevealPage.vue`

**Step 1: 将弹幕、访问计数、输入框集成到 RevealPage**

修改 `RevealPage.vue`：
- 引入 `DanmakuLayer`、`DanmakuInput`、`useDanmaku`、`useVisitCounter`
- 在 `.title` 区域上方放置弹幕层
- 在终端下方放置弹幕输入框
- 在标题旁边或下方显示访问计数

关键改动点：

1. `<script setup>` 中添加 imports 和初始化逻辑
2. template 中添加 `<DanmakuLayer>` 覆盖在 card 上方
3. template 中在终端后添加 `<DanmakuInput>`
4. 标题下方添加访问计数文案

**Step 2: 验证功能**

Run: `npm run dev`
Expected:
- 页面正常显示弹幕飘过
- 输入框可以发送弹幕
- 显示"第 N 位被整的人"
- 新弹幕实时出现

**Step 3: Commit**

```bash
git add src/components/RevealPage.vue
git commit -m "feat: integrate danmaku and visit counter into RevealPage"
```

---

### Task 8: 最终验证 + 构建

**Step 1: 全功能测试**

Run: `npm run dev`

验证清单：
- [ ] 进入 RevealPage 后弹幕开始飘过
- [ ] 输入弹幕并发送，弹幕在屏幕上出现
- [ ] 另一个浏览器窗口也能看到新弹幕（Realtime）
- [ ] 访问计数数字显示正确
- [ ] 刷新页面，计数不重复增加（同一 session）
- [ ] 新窗口打开，计数递增
- [ ] 暗色/亮色主题切换正常
- [ ] 终端功能不受影响

**Step 2: 构建**

Run: `npm run build`
Expected: 构建成功，无错误

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: build for production"
```

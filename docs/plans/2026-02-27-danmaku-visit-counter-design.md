# 评论弹幕 + 访问计数功能设计

## 概述

为整蛊网站 prank-homepage 添加两个功能：
1. **评论弹幕**：被整的人完成验证后，在揭晓页面看到实时飘过的弹幕评论，并可以自己发送弹幕
2. **访问计数**：记录有多少人被整过，在页面上展示"第 N 位被整的人"

## 技术选型

- **BaaS**：Supabase（免费层足够）
- **实时通信**：Supabase Realtime（基于 WebSocket）
- **前端框架**：延续项目现有的 Vue 3 + Composition API

## 数据库设计

### `danmaku` 表

| 字段       | 类型           | 说明                   |
|------------|----------------|------------------------|
| id         | bigint (PK)    | 自增主键               |
| content    | text           | 弹幕内容（限 50 字）   |
| color      | text           | 弹幕颜色               |
| created_at | timestamptz    | 创建时间，默认 now()   |

### `visit_counter` 表

| 字段  | 类型        | 说明               |
|-------|-------------|--------------------|
| id    | int (PK)    | 固定为 1，单行表   |
| count | bigint      | 访问总数           |

### RPC 函数

`increment_visit()`：原子递增 visit_counter.count 并返回新值。

### RLS 策略

- `danmaku`：anon 可 select / insert，禁止 update / delete
- `visit_counter`：anon 可 select，递增通过 RPC 函数

## 前端架构

```
src/
├── lib/
│   └── supabase.js          # Supabase 客户端初始化
├── composables/
│   ├── useDanmaku.js         # 弹幕逻辑：加载历史、订阅 Realtime、发送
│   └── useVisitCounter.js    # 访问计数：RPC 递增、获取当前值
├── components/
│   ├── DanmakuLayer.vue      # 弹幕渲染层：CSS 动画从右到左飘屏
│   └── DanmakuInput.vue      # 弹幕输入框 + 发送按钮
```

## 弹幕交互设计

- 位置：RevealPage 的 "YOU GOT PRANKED" 标题区域，从右向左飘过
- 页面加载时拉取最近 100 条弹幕循环播放
- 新弹幕通过 Supabase Realtime 实时推送
- 页面底部提供输入框 + 发送按钮
- 弹幕颜色从预设亮色中随机选取
- 内容限制 50 字

## 访问计数设计

- 触发时机：进入 RevealPage 时递增一次
- 展示文案："第 N 位被整的人"
- 用 sessionStorage 防止同一会话重复计数

## 安全性

- Supabase anon key + RLS，前端只做长度校验
- 整蛊网站流量小，不需要复杂的内容审核

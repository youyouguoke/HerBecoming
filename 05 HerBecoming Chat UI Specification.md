# HerBecoming Chat UI Specification v1.0

**Product:** HerBecoming
**Domain:** `herbecoming.app`
**Module:** AI Mentor Chat
**Version:** v1.0
**Status:** Ready for Frontend Development
**Target:** MVP
**Related Backend:** Mentor Engine v0.1 + `/api/chat`

---

# 1. Document Purpose

本文档定义 HerBecoming MVP 的核心 Chat 产品界面及交互规范。

Chat 是 HerBecoming 的核心产品入口。其目标不是构建一个通用 AI Chat，而是将已经完成的：

> **Safety → Understanding → Memory → Knowledge Graph → Reasoning → LLM → Output Safety**

转化为用户能够自然使用的 Mentor Experience。

本阶段不实现完整的 Growth、Journal、Community 等外围功能，而是首先验证：

> **用户是否愿意把真实的人生问题交给 HerBecoming Mentor，并持续进行有价值的思考。**

---

# 2. Product Positioning

## 2.1 Chat 不是什么

HerBecoming Chat **不是**：

* ChatGPT 的女性版
* 普通 AI 问答机器人
* 预先设计好的咨询回复
* FAQ / 知识库搜索工具
* 心理治疗工具
* 自动替用户做人生决定的 Decision Engine
* AI 女友 / AI 陪伴角色

## 2.2 Chat 是什么

HerBecoming Chat 是：

> **An AI mentor grounded in women's wisdom, helping users think clearly, make conscious choices, and grow intentionally.**

核心体验：

```text
User's Question
       ↓
AI Understanding
       ↓
Knowledge
       ↓
Context
       ↓
Reflection
       ↓
Mentor Response
       ↓
User's Next Thought
```

---

# 3. Core Product Principles

## P1 — 用户不选择主题

Chat 页面**不要求用户先选择主题**。

禁止：

```text
What would you like to talk about?

○ Self
○ Relationships
○ Career
○ Life Decisions
```

用户直接说自己的问题。

系统自动完成：

```text
Understanding
      ↓
Primary Domain
      ↓
Secondary Domains
      ↓
Knowledge Retrieval
```

例如：

> “男朋友希望我辞掉现在的工作跟他去另一个城市，但我其实不太想去。”

系统可以识别：

```text
Primary:
RELATIONSHIPS

Secondary:
SELF
LIFE_DECISIONS
CAREER
```

用户无需看到这些内部分类。

---

# 4. Mentor Experience

## 4.1 Mentor Identity

Mentor 必须始终保持统一的人格。

但 UI 不应该过度拟人化。

推荐：

> **HerBecoming Mentor**

而不是：

> “你的 AI 女朋友”

或者：

> “你的私人心理咨询师”

---

## 4.2 Mentor Communication Principles

回答必须：

* 积极
* 正面
* 尊重用户
* 不羞辱
* 不攻击
* 不制造恐惧
* 不进行恶意引导
* 不鼓励危险行为
* 不使用绝对化语言
* 不替用户做重大人生决定

同时：

> **积极 ≠ 无条件认同。**

Mentor 可以：

> “我不完全同意这个判断。”

但不能：

> “你怎么会这么想？”

---

# 5. Information Architecture

MVP Chat 相关路由：

```text
/
│
├── /chat
│
├── /chat/[conversationId]
│
├── /login
│
└── /settings
```

后续：

```text
/journal
/growth
/memories
```

不属于本版本核心实现。

---

# 6. Landing → Chat Flow

首页核心 CTA：

> **Start a Conversation**

点击后：

### 未登录用户

```text
Landing
  ↓
Create anonymous_session
  ↓
/chat
```

### 已登录用户

```text
Landing
  ↓
/chat
  ↓
Create / Resume Conversation
```

---

# 7. Chat Page Overall Layout

Desktop：

```text
┌─────────────────────────────────────────────────────┐
│ HerBecoming                         New Conversation │
├─────────────────────────────────────────────────────┤
│                                                     │
│                                                     │
│                 Conversation Area                   │
│                                                     │
│                                                     │
│                                                     │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Ask something...                            Send ↑ │
│                                                     │
├─────────────────────────────────────────────────────┤
│              3 free questions today                 │
└─────────────────────────────────────────────────────┘
```

推荐页面最大宽度：

```text
max-width: 960px
```

Conversation 内容区域：

```text
max-width: 760px
```

不要让文字横跨整个屏幕。

---

# 8. Header

## 8.1 Desktop

左侧：

> **HerBecoming**

右侧：

> **New conversation**

以及登录状态相关入口。

未登录：

> **Sign in**

登录后：

> Avatar / Account

---

## 8.2 Header 原则

Header 保持极简。

不在 MVP Header 中加入：

* Knowledge
* Courses
* Community
* Explore
* Topics

避免产品第一印象变成内容门户。

---

# 9. Welcome State

第一次进入 `/chat` 时：

```text
                    HerBecoming

          Think clearly.
          Choose consciously.
          Grow intentionally.

     A space to think through the questions
                 that matter.

              [ Start a conversation ]
```

但如果用户已经进入 Chat，建议直接出现输入框，而不是强制点击第二次 CTA。

更合理：

```text
                    HerBecoming

          What’s on your mind?

   You can talk about anything that matters to you.

 ┌─────────────────────────────────────────────┐
 │                                             │
 │ Tell me what's on your mind...              │
 │                                             │
 │                                    Send ↑   │
 └─────────────────────────────────────────────┘

        Your conversations are private.
```

---

# 10. Input Area

## 10.1 Desktop

输入框：

```text
┌───────────────────────────────────────────────┐
│ Tell me what's on your mind...                │
│                                               │
│                                               │
│                              🎙      ↑         │
└───────────────────────────────────────────────┘
```

功能：

* 多行输入
* Enter 发送
* Shift + Enter 换行
* Send button
* Voice button预留

---

# 11. Input Placeholder

不要固定成：

> Ask me anything.

因为这会让产品变成普通 AI。

推荐：

> **What's on your mind?**

或者：

> **Tell me what's on your mind...**

---

# 12. Message Design

## 12.1 User Message

用户消息应该明显但不过度强调。

推荐：

```text
You

男朋友希望我辞掉现在的工作跟他去另一个城市，
但我其实不太想去。
```

---

## 12.2 Mentor Message

Mentor 不使用传统 ChatGPT 风格的巨大头像。

推荐：

```text
HerBecoming

我觉得这里有一个值得慢慢拆开的地方。

你现在面对的可能不只是“去不去另一个城市”
这个选择，而是几个不同的问题交织在一起……
```

Mentor 名称统一：

> **HerBecoming**

或者：

> **Your Mentor**

不要使用：

> AI Assistant

---

# 13. 不显示内部推理

绝对不展示：

```text
Thinking...
Retrieving 8 knowledge nodes...
REL-012 activated
Career knowledge retrieved
Reasoning...
```

这些属于系统内部过程。

用户只看到最终 Mentor 输出。

---

# 14. Knowledge Attribution

MVP 默认**不强制每次回答展示知识节点**。

如果 Mentor 回答引用某位思想者/作者的观点，必须由后端知识系统提供真实来源。

UI 可以支持未来：

```text
Inspired by:
[Author / Source]
```

但不应该让知识来源打断对话。

---

# 15. Conversation Streaming

推荐支持流式输出。

状态：

```text
User sends
    ↓
Message appears immediately
    ↓
Mentor typing indicator
    ↓
Streaming response
    ↓
Complete
```

Mentor 输出期间：

```text
HerBecoming

● ● ●
```

或者使用非常轻微的动态状态。

避免：

> “AI is thinking deeply...”

因为这会强化 AI 拟人化。

---

# 16. Conversation States

必须定义以下状态：

### Empty

首次进入，没有消息。

### Sending

用户已经发送，等待响应。

### Streaming

Mentor 正在输出。

### Completed

正常完成。

### Error

请求失败。

### Rate Limited

游客达到每日 3 次。

### Crisis

Safety 层触发危机状态。

---

# 17. Error State

不要显示技术错误：

> 500 Internal Server Error

推荐：

> **Something went wrong.**

> I couldn't complete that response. Please try again.

按钮：

> **Try again**

---

# 18. Guest Usage System

MVP：

> 游客每天免费 3 个问题。

数据来源：

```text
anonymous_sessions
        +
usage_records
```

---

## 18.1 UI

不要一直显示：

> 2 / 3

建议在输入框下面轻量显示：

```text
2 free questions remaining today
```

或者：

```text
Free conversations today: 2 of 3
```

---

# 19. Usage States

### 0 questions used

不显示额度压力。

### 1 question

```text
2 free questions remaining today
```

### 2 questions

```text
1 free question remaining today
```

### 3 questions

输入框仍然可以显示，但发送时进入 Login Wall。

---

# 20. Login Wall

游客达到限制：

```text
              Continue your conversation

        You've used your 3 free questions today.

       Sign in to keep exploring your thoughts
                 with HerBecoming.

              [ Continue with Google ]

                    or

              [ Continue with WeChat ]
```

Google 和微信登录均保留。

微信登录的具体可用性由后端 Auth 配置决定。

---

# 21. Crisis Override

这是最高优先级状态。

核心原则：

> **Crisis 不消耗游客额度。**

流程：

```text
User Message
     ↓
Safety
     ↓
Crisis detected
     ↓
Crisis UI
```

不能出现：

> “You have used all 3 questions. Please sign in.”

---

# 22. Crisis UI

危机状态必须与普通 Mentor Response 区分。

UI：

```text
┌───────────────────────────────────────────────┐
│ You don't have to handle this alone.          │
│                                               │
│ What you're describing sounds serious,        │
│ and getting immediate support from a real      │
│ person is important right now.                │
│                                               │
│ [ Crisis Support Resources ]                  │
│                                               │
│ If you are in immediate danger, contact       │
│ local emergency services or a trusted adult.  │
└───────────────────────────────────────────────┘
```

**具体危机资源内容由 Safety 规范决定，不由 Mentor 自由生成。**

同时：

* 不消耗免费次数
* 不要求登录
* 不受订阅等级影响
* 不隐藏在普通回答中
* 不允许 Mentor 人格覆盖 Safety Response

---

# 23. Conversation History

MVP 可以暂时提供非常轻量的历史记录。

登录用户：

```text
Recent conversations

Yesterday
Should I take the new job?

Aug 19
Something I've been thinking about...

Aug 17
My relationship feels different lately
```

匿名用户：

> 当前 session 内保持上下文。

不要求 MVP 实现完整搜索。

---

# 24. New Conversation

Header：

> **New conversation**

点击后：

```text
Current conversation
        ↓
Persist
        ↓
Create new conversation
```

不要弹出复杂确认框。

---

# 25. Conversation Context

前端发送：

```json
{
  "sessionId": "...",
  "content": "...",
  "anonymous": true
}
```

继续沿用现有 `/api/chat` 接口。

前端不直接参与：

* Knowledge Retrieval
* Understanding
* Memory Retrieval
* Reasoning
* Safety classification

这些全部由 Mentor Engine 负责。

---

# 26. API Contract

当前：

```http
POST /api/chat
Content-Type: application/json
```

Request：

```json
{
  "sessionId": "test-session-001",
  "content": "What's on my mind...",
  "anonymous": true
}
```

前端至少需要处理：

```text
success
error
rate_limit
crisis
```

---

# 27. 建议的 Response Contract

如果现有接口尚未固定，建议标准化为：

```json
{
  "success": true,
  "message": {
    "id": "msg_123",
    "role": "mentor",
    "content": "..."
  },
  "conversation": {
    "id": "conv_123"
  },
  "usage": {
    "used": 1,
    "remaining": 2
  },
  "safety": {
    "status": "normal"
  }
}
```

Crisis：

```json
{
  "success": true,
  "message": null,
  "safety": {
    "status": "crisis"
  },
  "crisis": {
    "resources": []
  },
  "usage": {
    "counted": false
  }
}
```

资源内容由后端 Safety 模块提供固定内容。

---

# 28. Frontend Component Architecture

建议：

```text
app/
├── page.tsx
├── chat/
│   ├── page.tsx
│   └── [conversationId]/
│       └── page.tsx
│
components/
├── chat/
│   ├── ChatShell.tsx
│   ├── ChatHeader.tsx
│   ├── WelcomeState.tsx
│   ├── ConversationView.tsx
│   ├── MessageList.tsx
│   ├── UserMessage.tsx
│   ├── MentorMessage.tsx
│   ├── MessageComposer.tsx
│   ├── TypingIndicator.tsx
│   ├── UsageIndicator.tsx
│   ├── LoginWall.tsx
│   ├── CrisisPanel.tsx
│   └── ErrorState.tsx
│
└── auth/
    └── LoginButton.tsx
```

---

# 29. State Management

Chat 状态：

```text
conversation
messages
input
isSending
isStreaming
error
usage
safetyStatus
```

建议 MVP 不引入复杂状态管理框架。

如果项目已有 Zustand 等方案，可以复用；否则 React state + Server Actions/API 即可。

---

# 30. Responsive Design

## Desktop

```text
≥ 1024px
```

Conversation：

```text
760px
```

---

## Tablet

```text
768px – 1023px
```

输入区域保持固定底部。

---

## Mobile

```text
< 768px
```

核心要求：

* 输入框固定底部
* 键盘弹出时不遮挡输入框
* Mentor 消息宽度不超过屏幕
* Header 高度降低
* 不使用复杂 Sidebar

Mobile 是 MVP 的重要场景。

---

# 31. Visual Design Direction

HerBecoming 不建议采用典型：

```text
AI Purple
Gradient
Neon
Glassmorphism
Robot Avatar
```

也不建议做：

```text
女性化粉色
蝴蝶
花朵
少女插画
```

产品应该呈现：

> **Calm / Intelligent / Warm / Mature / Reflective**

视觉关键词：

```text
Quiet
Editorial
Human
Thoughtful
Warm
Premium
```

---

# 32. Color System

建议采用低饱和暖色体系。

例如：

```text
Background
Warm Ivory

Primary Text
Deep Charcoal

Secondary Text
Muted Taupe

Accent
Muted Terracotta / Rose

Border
Soft Neutral
```

具体颜色应在 Design System 中统一定义。

Chat 页面不要使用大量 Accent Color。

---

# 33. Typography

重点：

> **阅读体验优先。**

Mentor 长回答可能达到多个段落，因此：

* 行高较高
* 段落之间有明显间距
* 不使用过小字体
* Markdown 内容自然渲染
* List / Quote / Heading 有明确层级

---

# 34. Mentor Response Formatting

支持：

```text
Paragraph
Bullet list
Numbered list
Short heading
Quote
```

但不建议每个回答都机械使用：

```text
### 1.
### 2.
### 3.
```

Mentor 应该像一个真正善于思考的导师交流，而不是生成报告。

---

# 35. Reflection Prompt

Mentor 可以在回答末尾自然提出一个问题。

例如：

> “如果暂时不考虑别人希望你怎么选，你自己最不愿意失去的是什么？”

UI 不要把它做成：

```text
Reflection Question
[Answer]
```

而是保持自然对话：

> **What comes up for you when you sit with that?**

用户继续输入即可。

---

# 36. 不做 Suggested Questions

MVP 不建议在每条回答下面出现：

```text
Try asking:
• Should I break up?
• How do I set boundaries?
• How do I quit my job?
```

原因：

这会把开放式 Mentor 体验重新变成：

> 预设问题 → 预设路径。

与产品原则冲突。

---

# 37. Voice

产品要求支持：

> **中文语音**
>
> **English voice**

MVP UI 先预留 Voice Input：

```text
🎙
```

点击：

```text
Listening...
```

再次点击：

```text
Stop
```

语音技术实现可以后置，但 UI 架构不能阻塞后续接入。

Voice Output：

```text
▶ Listen
```

建议作为 Mentor Message 的 secondary action。

---

# 38. Language

支持：

```text
English
中文
```

默认：

> 根据浏览器语言初始化。

用户可以手动切换。

不要将语言和知识主题绑定。

---

# 39. Accessibility

必须满足：

* 键盘可操作
* Send button 有 aria-label
* Voice button 有 aria-label
* Message 使用语义化结构
* Focus 状态明显
* 色彩对比度合格
* 不依赖颜色表达状态
* Reduced Motion 支持

---

# 40. Privacy Messaging

由于产品涉及：

* Relationships
* Career
* Personal decisions
* Memories

首次使用时建议提供轻量说明：

> **Your conversations are personal to you. You control what HerBecoming remembers.**

不要在 Chat 页面反复出现隐私警告。

---

# 41. Memory UX 预留

MVP 不要求完整 Memory 管理。

但未来 Mentor 可能产生：

> “我会记住你提到的这件事，以便之后更好地理解你的情况。”

因此 Message UI 应允许未来加入：

```text
Memory saved
```

但当前版本不要强制展示复杂 Memory 卡片。

---

# 42. Journal UX 预留

未来 Mentor 识别 Decision：

```text
“This sounds like a decision you may want to revisit.”
```

然后：

> **Save as a decision**

当前版本可以暂不实现，但 Message Action 区域需要保持可扩展。

---

# 43. Message Actions

MVP：

```text
Copy
```

未来：

```text
Save
Save as Decision
Memory
Listen
```

不要在 MVP 同时提供大量按钮。

---

# 44. Authentication Flow

游客：

```text
Landing
 ↓
Chat
 ↓
3 questions
 ↓
Login Wall
```

Google：

```text
Continue with Google
 ↓
Auth.js
 ↓
Account
 ↓
Existing anonymous session migration
```

非常重要：

### 登录后应该尽量保留当前匿名会话

例如：

```text
Anonymous Conversation
        ↓
Google Login
        ↓
User Account
        ↓
Conversation attached to User
```

否则用户刚刚聊完重要问题，却因为登录丢失上下文，会严重破坏信任。

---

# 45. WeChat Login

UI 保留：

> **Continue with WeChat**

但具体是否启用由部署环境配置决定。

如果未配置：

* 不在生产环境显示不可用按钮
* 或显示为后续登录方式

不能让前端假装微信登录已经可用。

---

# 46. Security

前端：

* 不保存 API Key
* 不直接访问 PostgreSQL
* 不直接访问 pgvector
* 不暴露 Knowledge Graph 内部数据
* 不暴露 Safety classifier
* 不暴露 Mentor system prompt

所有核心逻辑：

```text
Browser
 ↓
/api/chat
 ↓
Mentor Engine
```

---

# 47. Performance

目标：

### First response

尽快出现 Mentor streaming 状态。

### UI

页面加载不应该等待整个知识库。

### Chat

消息发送后立即 optimistic render 用户消息。

---

# 48. Analytics

MVP 只记录必要指标：

```text
landing_view
start_conversation
message_sent
mentor_response
conversation_completed
login_wall_shown
login_completed
crisis_triggered
```

重点指标：

### Activation

> 第一次提问后是否继续发送第二个问题。

### Engagement

> 一次 conversation 的平均消息数量。

### Return

> 用户是否回来再次使用。

暂时不需要复杂增长分析系统。

---

# 49. Core Product Metrics

第一阶段重点不是：

> DAU

而是：

### Metric 1

**First → Second Question Rate**

用户问完第一题后是否继续。

### Metric 2

**Conversation Completion**

用户是否真正完成一次有价值的交流。

### Metric 3

**Return Rate**

用户是否再次回来。

### Metric 4

**Journal Intent**

有多少对话自然产生“值得保存的决定”。

---

# 50. Acceptance Criteria

Chat UI v1.0 必须满足：

### AC-01

游客可以直接进入 Chat，无需登录。

### AC-02

用户无需选择主题即可开始。

### AC-03

可以发送中文和英文问题。

### AC-04

调用现有：

```text
POST /api/chat
```

成功获得 Mentor Response。

### AC-05

支持连续对话。

### AC-06

显示 loading / streaming 状态。

### AC-07

错误时提供 Retry。

### AC-08

游客每日最多 3 个正常问题。

### AC-09

第 4 个问题触发 Login Wall。

### AC-10

Crisis 不消耗游客额度。

### AC-11

Crisis 不要求登录。

### AC-12

Google Login UI 可接入 Auth.js。

### AC-13

微信登录 UI 不阻塞 Google 登录。

### AC-14

登录后匿名 Conversation 尽可能迁移到用户账户。

### AC-15

Mobile 可正常完成完整对话。

### AC-16

不显示内部 Knowledge / Reasoning。

### AC-17

不使用预设问题菜单代替自然对话。

### AC-18

Mentor UI 不呈现 AI 女友/虚拟人物形象。

### AC-19

界面预留 Voice Input / Output。

### AC-20

后端安全状态能够驱动 Crisis UI。

---

# 51. MVP 页面优先级

| 页面/组件                | 优先级 | MVP     |
| -------------------- | --: | ------- |
| Chat Shell           |  P0 | ✅       |
| Welcome State        |  P0 | ✅       |
| Message List         |  P0 | ✅       |
| Message Composer     |  P0 | ✅       |
| Streaming            |  P0 | ✅       |
| Error                |  P0 | ✅       |
| Usage Indicator      |  P0 | ✅       |
| Login Wall           |  P0 | ✅       |
| Crisis Panel         |  P0 | ✅       |
| Google Login         |  P0 | ✅       |
| WeChat Login         |  P1 | UI/接口预留 |
| Conversation History |  P1 | 简版      |
| Voice Input          |  P1 | UI预留    |
| Voice Output         |  P1 | UI预留    |
| Journal              |  P1 | 后续      |
| Memory UI            |  P1 | 后续      |
| Growth Dashboard     |  P2 | ❌       |
| Community            |  P2 | ❌       |

---

# 52. Frontend Development Order

前端不要一次全部开发。

建议：

### Sprint 1 — Chat Foundation

```text
ChatShell
MessageList
Message
Composer
API Integration
Streaming
```

### Sprint 2 — Product States

```text
Welcome
Loading
Error
Empty
Usage
Rate Limit
Crisis
```

### Sprint 3 — Auth

```text
Google
Anonymous → User migration
Login Wall
```

### Sprint 4 — Responsive / Polish

```text
Mobile
Accessibility
Animation
Typography
Spacing
```

### Sprint 5 — Voice Preparation

```text
Voice Input UI
Voice Output UI
Language Switch
```

---

# 53. 最终核心体验

HerBecoming Chat 不应该让用户感觉：

> “我正在使用一个 AI 工具。”

而应该让用户感觉：

> **“我终于有一个可以把这些事情认真想一遍的地方。”**

因此整个 UI 的设计原则可以浓缩成：

> **Quiet interface. Deep conversation. No judgment. No prescriptions.**

以及品牌核心：

> **Think clearly. Choose consciously. Grow intentionally.**

---

## 54. Phase 2 完成后的产品闭环

最终 MVP 第一阶段应该形成：

```text
                 HerBecoming
                      │
                      ▼
              Start a Conversation
                      │
                      ▼
              ┌───────────────┐
              │  User Message │
              └───────┬───────┘
                      ▼
                   Safety
                      │
                      ▼
                Understanding
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
       Knowledge                Memory
          │                       │
          └───────────┬───────────┘
                      ▼
                  Reasoning
                      │
                      ▼
                 AI Mentor
                      │
                      ▼
                Output Safety
                      │
                      ▼
              ┌───────────────┐
              │ Mentor Answer │
              └───────┬───────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
   Continue Thinking        Natural Decision
                                  │
                                  ▼
                            Save to Journal
```

**这就是现在前端开发应该实现的第一条完整产品路径。**



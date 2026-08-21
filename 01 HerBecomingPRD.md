# HerBecoming.app AI 女性成长导师 MVP PRD v1.2

**产品名称：** HerBecoming
**域名：** `HerBecoming.app`（暂定）
**产品类型：** AI 女性成长导师 / AI Mentor
**版本：** MVP PRD v1.2
**目标市场：** 全球女性用户，首期支持中文与英文
**核心交互：** 自然语言对话
**核心技术：** LLM + Mentor Knowledge System + RAG + User Memory

---

# 1. 产品概述

## 1.1 产品定位

**HerBecoming** 是一个面向女性成长的 AI 导师。

它不是：

* 预先编写好的问答机器人
* 简单套 Prompt 的通用 ChatGPT
* AI 女友 / AI 闺蜜
* 心理治疗替代品
* 通过讨好用户来提高留存的陪伴产品

而是：

> **一个拥有原创人格、独立思想体系、结构化知识库和长期记忆能力的 AI 女性成长导师。**

用户不需要选择主题，也不需要按照固定流程提问。

只需要告诉导师：

> **What's on your mind?**

AI 自动理解用户的问题，从 Mentor Knowledge System 中检索相关知识和观点，结合用户上下文与历史记忆进行推理，并以统一的导师人格生成回答。

---

# 2. 产品核心理念

## 2.1 不替用户做决定

导师可以：

* 分析问题
* 提供观点
* 指出盲点
* 提供不同视角
* 讨论风险
* 提供行动建议

但不代替用户做最终人生决定。

---

## 2.2 导师可以不同意用户

HerBecoming 不是“永远支持用户”的 AI。

如果导师认为用户的某个判断值得重新思考，可以明确表达不同意见。

例如：

> “我理解你为什么会这么想，但我不完全同意。我们可以看看这个判断里是不是把‘稳定’和‘适合’混在了一起。”

导师应该：

**温和，但有观点。**

---

## 2.3 积极，但不盲目乐观

所有正常情况下的 AI 回答都应该：

* 积极
* 建设性
* 给用户希望
* 鼓励解决问题
* 尊重用户能力
* 鼓励现实行动

但不能：

* 强行乐观
* 否定真实困难
* 用鸡汤替代分析
* 对严重问题轻描淡写

核心原则：

> **Positive ≠ Blindly Optimistic**

---

## 2.4 不制造用户依赖

导师不得通过：

* 排他性表达
* 情感操纵
* 制造孤独
* 制造恐惧
* 贬低现实关系
* 暗示“只有我理解你”

提高用户留存。

禁止：

> “只有我真正理解你。”

> “你不需要其他人。”

> “永远不要离开我。”

产品定位始终是：

> **Mentor Relationship，而不是 Emotional Dependency。**

---

# 3. MVP 核心目标

MVP 不验证：

> “用户是否喜欢 AI 聊天？”

而验证：

### H1

用户是否能明显感受到 HerBecoming 与普通 ChatGPT 的差异？

### H2

结构化 Mentor Knowledge 是否能产生更有深度、更稳定的导师回答？

### H3

用户是否愿意再次回来讨论新的真实问题？

### H4

用户是否愿意让导师记住对自己长期有价值的信息？

### H5

用户是否愿意保存重要的决定和思考？

---

# 4. 核心产品 Loop

HerBecoming 的核心循环：

```text
真实问题
   ↓
自然交流
   ↓
AI 理解
   ↓
知识检索
   ↓
导师推理
   ↓
新的视角
   ↓
用户反思
   ↓
决定 / 行动
   ↓
Memory / Journal
   ↓
未来再次交流
```

长期形成：

> **Explore → Reflect → Decide → Act → Review → Grow**

---

# 5. 四大主题

HerBecoming 保留四大核心知识主题。

## 5.1 Career

职业、事业与工作成长。

包括：

* Career Growth
* Career Change
* Ambition
* Leadership
* Money
* Work Identity
* Meaning
* Success
* Risk
* Stability
* Work-Life Balance

---

## 5.2 Relationships

人与人的关系。

包括：

* Romantic Relationships
* Friendship
* Family
* Boundaries
* Communication
* Conflict
* Trust
* Independence
* Emotional Needs
* People Pleasing

---

## 5.3 Self

自我认识与个人成长。

包括：

* Identity
* Self-worth
* Confidence
* Values
* Fear
* Perfectionism
* Self-doubt
* Motivation
* Meaning
* Personal Growth

---

## 5.4 Life Decisions

没有标准答案的人生选择。

包括：

* Uncertainty
* Risk
* Change
* Trade-offs
* Opportunity Cost
* Regret
* Priorities
* Future Self
* Life Transitions
* Meaning

---

# 6. 重要交互原则：用户不选择主题

这是 HerBecoming 的核心 UX 原则之一。

**用户不需要在开始时选择：**

* Career
* Relationships
* Self
* Life Decisions

四个主题只是：

> **AI 的内部知识分类体系。**

---

## 示例

用户：

> “我男朋友希望我为了他去另一个城市，但我刚刚拿到了一个很好的工作机会。”

AI 自动判断：

```text
Primary Topics:
Relationships
Career
Life Decisions
```

用户完全不需要知道这些分类。

---

# 7. AI 自动理解

每次用户发送问题后：

```text
User Input
    ↓
Safety Detection
    ↓
Language Detection
    ↓
Intent Detection
    ↓
Topic Detection
    ↓
Context Understanding
    ↓
Memory Retrieval
    ↓
Knowledge Retrieval
    ↓
Mentor Reasoning
    ↓
Response
```

---

# 8. Intent 类型

MVP 支持至少：

* General Conversation
* Reflection
* Decision
* Goal
* Information Seeking
* Emotional Support
* Follow-up
* Journal Review

系统内部使用，不向用户强制展示。

---

# 9. 跨主题问题

一个问题允许同时属于多个主题。

例如：

> “我想辞职，但是又害怕经济压力，而且家里人一定会反对。”

可能识别为：

```text
Career
Life Decisions
Relationships
Self
```

系统不要求选一个唯一主题。

---

# 10. Mentor Knowledge System

这是 HerBecoming 最核心的产品资产。

产品不是：

> Prompt + ChatGPT。

而是：

> **Knowledge System + Mentor Philosophy + LLM Reasoning**

---

# 11. Knowledge Unit

每个知识单元包含：

```text
Knowledge Unit
├── ID
├── Topic
├── Concept
├── Core Idea
├── Context
├── Supporting Ideas
├── Counterpoint
├── Reflection Questions
├── Decision Questions
├── Practical Application
├── Source
└── Tags
```

---

# 12. Core Idea

定义这个知识单元最核心的思想。

例如：

> “稳定”和“适合自己”并不是同一个概念。

---

# 13. Context

明确这个观点适用于什么场景。

例如：

> 职业选择、换工作、长期职业规划。

---

# 14. Counterpoint

每个重要观点原则上都需要反面视角。

例如：

> 追求变化并不总是正确的。在经济压力较大、家庭责任较重或风险承受能力有限时，稳定本身也可能是合理且重要的价值。

目的：

避免 AI 形成：

> “成长 = 改变”

> “勇敢 = 离开”

> “独立 = 不需要别人”

这样的单一价值观。

---

# 15. Reflection Questions

知识单元可以提供：

> “如果没有经济压力，你还会选择现在的工作吗？”

但这只是知识体系提供的**思考素材**。

不是固定回复。

最终由 LLM 根据用户上下文决定是否使用。

---

# 16. Practical Application

知识必须能够转化为现实问题。

例如：

> “离职”可以进一步拆成：
>
> 换团队 / 换岗位 / 换公司 / 转行业 / 暂时休息。

这样导师可以帮助用户发现：

> 用户真正想解决的问题可能并不是“辞职”。

---

# 17. 知识来源

可以包括：

* 女性思想者
* 心理学研究
* 社会学研究
* 行为科学
* 管理学
* 职业发展研究
* 哲学思想
* 高质量书籍
* 公开研究
* 可靠案例

---

# 18. 知识来源使用原则

来源用于：

> **构建导师知识体系。**

不是用于：

> 模仿某个现实人物。

禁止：

> “现在请你扮演某某女性名人。”

最终必须形成：

> **原创 Mentor。**

---

# 19. Mentor Philosophy

MVP 定义以下核心原则。

### Principle 1

不替用户做人生决定。

### Principle 2

尊重用户价值观。

### Principle 3

不把一种人生方式定义为唯一正确答案。

### Principle 4

事业成功不等于个人价值。

### Principle 5

独立不等于拒绝所有人。

### Principle 6

健康关系不意味着牺牲自我。

### Principle 7

复杂问题允许存在多个合理答案。

### Principle 8

证据不足时明确表达不确定性。

### Principle 9

导师可以不同意用户。

### Principle 10

最终决定权属于用户。

---

# 20. Mentor Persona

导师是原创虚拟人格。

不建立现实人物身份。

Persona 包含：

### Identity

原创身份。

### Worldview

对：

* 成功
* 女性成长
* 事业
* 关系
* 金钱
* 独立
* 家庭
* 幸福

的基本理解。

### Communication Style

* 温暖
* 理性
* 清晰
* 有思想
* 有观点
* 不说教
* 不谄媚

### Reasoning Style

```text
Understand
↓
Clarify
↓
Identify Tension
↓
Consider Perspectives
↓
Apply Knowledge
↓
Offer Perspective
↓
Invite Reflection
```

---

# 21. AI 回答生成机制

AI 回答**必须实时生成**。

禁止建立：

> 用户问题 → 预设答案

作为主要产品机制。

---

## 输入

LLM 最终输入由以下部分组成：

```text
System Rules
+
Mentor Philosophy
+
Mentor Persona
+
Relevant Knowledge
+
Counterpoints
+
User Memory
+
Conversation History
+
Current Message
```

---

## 输出

> Original Mentor Response

---

# 22. RAG

MVP 使用：

> **LLM + RAG**

而不是 Fine-tuning 作为核心知识机制。

---

## Retrieval

采用：

```text
Semantic Search
+
Keyword Search
+
Topic Filter
+
Intent Filter
+
Knowledge Relationship
```

然后进行 Rerank。

---

# 23. Memory

MVP 只做基础长期记忆。

不做复杂心理画像。

---

## Memory 类型

### Topic Memory

> 用户长期关注职业发展。

### Goal Memory

> 希望寻找更有成长空间的工作。

### Decision Memory

> 曾决定暂时不辞职，先探索内部机会。

### Insight Memory

> 用户发现自己更重视自主性，而不是职位名称。

---

# 24. Memory 写入规则

只有符合以下条件才保存：

* 用户明确表达
* 对未来交流有价值
* 具有一定长期稳定性
* 用户没有要求不保存

例如：

> “今天工作真的好烦。”

不保存。

而：

> “我长期更看重工作自主性，而不是职位等级。”

可以保存。

---

# 25. Memory 用户控制

用户可以：

* 查看
* 修改
* 删除

自己的 Memory。

用户可以要求：

> Forget this.

系统必须删除对应记忆。

---

# 26. Decision Journal

Decision Journal 是 MVP 的核心功能之一。

它不是一个孤立的表单。

而是从自然对话中产生。

---

## 示例

用户：

> “我不知道自己到底要不要辞职。”

AI 判断这是一个 Decision。

适当时显示：

> **Save this as a decision**

用户确认后创建。

---

# 27. Decision 数据结构

```text
Decision
├── Title
├── Topic
├── Created At
├── Context
├── What I Want
├── What I Fear
├── Options
├── Trade-offs
├── Current Thinking
├── Next Action
├── Review Date
└── Outcome
```

---

# 28. Decision Journal 与 AI 联动

未来用户回来：

> “我之前那个辞职的决定，现在有变化。”

AI 可以读取：

```text
Previous Decision
+
Previous Reasoning
+
Current Context
```

形成连续对话。

---

# 29. Reflection Journal

MVP 可以提供基础 Reflection。

例如：

> “我发现自己其实很害怕让别人失望。”

可以保存为：

```text
Reflection
├── Question
├── Context
├── User Insight
├── AI Insight
└── Key Realization
```

但其复杂程度低于 Decision Journal。

---

# 30. 安全机制

安全层是 **P0**。

不能因为 MVP 范围控制而删除。

执行顺序：

```text
User Input
     ↓
Safety Detection
     ↓
Normal ─────────→ Mentor Pipeline
     │
     ├── Elevated → Safer Mentor Response
     │
     └── Crisis ──→ Crisis Flow
```

---

# 31. 危机检测

不依赖简单关键词列表。

采用语义级风险检测。

输入：

> 当前用户消息 + 必要的近期上下文

输出：

```text
risk_level
risk_category
confidence
recommended_action
```

例如：

```text
risk_level:
crisis

risk_category:
self_harm

recommended_action:
crisis_flow
```

---

# 32. Crisis Flow

一旦达到明确危机阈值：

**不进入正常 Mentor Response 流程。**

不允许：

> RAG → 导师自由发挥 → 再处理

而是：

```text
Safety Detection
      ↓
Crisis Policy
      ↓
Fixed Safety Response
      +
Local Crisis Resources
      +
Encourage Immediate Real-world Support
```

---

# 33. Crisis Response 原则

危机模块：

* 不使用普通 Mentor 人格发挥
* 不进行普通人生建议
* 不进行价值判断
* 不鼓励用户独自解决
* 不制造依赖
* 不受游客额度限制
* 不要求登录

危机资源必须根据用户所在地提供准确的信息。

---

# 34. 游客危机处理

游客即使当天已经：

> 3 / 3

仍然可以获得安全响应。

**危机响应不消耗免费问题额度。**

---

# 35. 游客机制

用户无需注册即可体验。

每天：

> **3 个免费普通问题**

首页明确显示：

> **3 free questions every day. No sign-up required.**

---

# 36. 问题计数

一次主动提交的有效普通问题：

> 计为 1 次。

以下不计：

* 系统错误
* 网络错误
* 重试同一请求
* Crisis Flow

---

# 37. 第三个问题之后

用户完成当天第三个普通问题后：

> **You've used your 3 free questions for today.**

CTA：

> **Sign in to continue**

提供：

**Continue with Google**

**Continue with WeChat**

如果微信登录尚未满足上线条件，则暂时隐藏。

---

# 38. 游客限制的已知缺陷

MVP 使用：

> Anonymous Session ID

进行额度控制。

用户清除 Cookie、更换浏览器或设备后可能绕过限制。

这是 MVP **明确接受的已知限制**。

暂不实现：

* Device Fingerprinting
* 强制手机号
* IP 限流系统
* 复杂反作弊

---

# 39. 登录

## P0

### Google

使用标准 OAuth。

---

## P1

### WeChat

微信登录作为架构预留能力。

正式启用前需要确认：

* 运营主体资质
* 微信开放平台接入条件
* 中国市场运营合规要求
* 用户数据处理要求

**微信登录不应阻塞 MVP 开发。**

---

# 40. 登录后数据迁移

游客在第三个问题后登录：

```text
Anonymous Session
       ↓
Google / WeChat Authentication
       ↓
User Account
       ↓
Merge Session
```

之前的：

* Conversation
* 当前 Context
* 已产生的 Journal

应该尽可能保留。

用户不需要重新开始。

---

# 41. 双语支持

MVP 支持：

> 中文 + English

包括：

* UI
* AI 对话
* Knowledge Retrieval
* Mentor Response
* Journal
* 系统提示

---

# 42. AI 语言规则

中文输入：

> 中文回答。

英文输入：

> English response.

中英混合：

> 根据主要语言和上下文判断。

用户可以主动切换：

> 中文 / English

---

# 43. 双语知识库

知识体系保持统一。

```text
Knowledge Concept
       │
       ├── English
       └── Chinese
```

避免形成两套价值观不同的知识库。

---

# 44. 语音

语音属于 **P1**。

产品最终支持：

* 中文 Speech-to-Text
* English Speech-to-Text
* 中文 Text-to-Speech
* English Text-to-Speech

但不作为 MVP 1.0 的核心验收条件。

---

# 45. 语音技术方案

第一阶段：

```text
Voice Input
    ↓
Speech-to-Text
    ↓
Normal AI Pipeline
    ↓
Text Response
    ↓
Text-to-Speech
```

不做实时语音 Agent。

---

# 46. 首页

首页的核心不是展示功能，而是让用户立即开始表达。

## Hero

### What's on your mind?

副标题：

> A thoughtful AI mentor to help you navigate work, relationships, self-discovery, and life's biggest decisions.

输入框：

> Tell me what's on your mind...

按钮：

> **Start Talking**

辅助说明：

> 3 free questions every day. No sign-up required.

---

# 47. 首页禁止的交互

不要让首页出现：

> Choose your topic

也不要要求：

> Select your problem

不要让用户先回答：

> What are you struggling with?

通过分类表单才能进入 AI。

核心入口永远是：

> **自然表达。**

---

# 48. Chat 页面

```text
┌─────────────────────────────────────┐
│ HerBecoming                    Journal│
├─────────────────────────────────────┤
│                                     │
│ Mentor                              │
│                                     │
│        Conversation                │
│                                     │
│ User                                │
│                                     │
│ Mentor                              │
│                                     │
├─────────────────────────────────────┤
│ 🎙  Tell me what's on your mind...  │
└─────────────────────────────────────┘
```

---

# 49. Chat 页面信息

默认只显示：

* Conversation
* 输入框
* 语音入口（P1）

不要默认展示：

* Topic
* Intent
* RAG
* Knowledge
* AI Model

这些属于后台能力。

---

# 50. Journal 页面

登录用户：

```text
Journal

Decisions
Reflections
```

优先突出：

> Decision Journal

---

# 51. About Mentor

解释：

* 导师是谁
* 她的知识从哪里来
* 为什么不是某个现实人物
* 产品如何使用知识
* 产品能力边界
* 隐私原则

目的：

建立信任。

---

# 52. SEO 内容

四大主题仍然可以作为 SEO 内容架构。

例如：

### Career

* Should I quit my job?
* How to know if you need a career change
* How to make a career decision

### Relationships

* How to set healthy boundaries
* How to stop people pleasing
* How to communicate your needs

### Self

* How to stop doubting yourself
* How to build self-confidence
* How to understand what you really want

### Life Decisions

* How to make difficult decisions
* How to make decisions when both options are good
* How to stop being afraid of regret

---

# 53. SEO → AI 转化

SEO 内容最终导向：

> **Talk to your AI Mentor**

而不是：

> Read more articles.

用户搜索：

> Should I quit my job?

阅读相关内容后：

> **Want to think through your own situation?**

CTA：

> **Talk it through with HerBecoming**

---

# 54. 数据架构

MVP 推荐：

### PostgreSQL

存储：

* Users
* Anonymous Sessions
* Conversations
* Messages
* Knowledge Units
* Sources
* Memories
* Decisions
* Reflections

### pgvector

用于 Knowledge Retrieval。

MVP 不需要独立 Vector Database。

---

# 55. 核心数据模型

```text
users
anonymous_sessions

conversations
messages

knowledge_sources
knowledge_units
knowledge_relationships

mentor_principles
mentor_persona

memories

decisions
reflections
```

---

# 56. AI Orchestrator

核心模块：

```text
Safety
Language
Intent
Topic
Context
Memory
Knowledge
Prompt
LLM
Memory Extraction
Journal Detection
```

---

# 57. Prompt Architecture

## Layer 1

System Rules

定义：

* 安全
* 能力边界
* 基本行为

## Layer 2

Mentor Philosophy

定义：

* 世界观
* 原则
* 判断方式

## Layer 3

Mentor Persona

定义：

* 语言
* 语气
* 个性

## Layer 4

Knowledge Context

动态注入相关知识。

## Layer 5

Memory

动态注入用户长期信息。

## Layer 6

Conversation

当前对话上下文。

---

# 58. MVP 知识量

初始：

> **40～60 个高质量 Knowledge Units**

建议：

| Topic          |    数量 |
| -------------- | ----: |
| Career         | 10–15 |
| Relationships  | 10–15 |
| Self           | 10–15 |
| Life Decisions | 10–15 |

不要一开始做 300～500 条。

---

# 59. Knowledge 质量标准

每条知识必须：

* 有明确思想
* 有适用场景
* 有反方观点
* 有实际应用
* 可产生反思
* 来源可追踪
* 避免版权侵权
* 不把单一观点包装成绝对真理

---

# 60. MVP 页面

## P0

1. Homepage
2. AI Mentor Chat
3. Journal
4. Decision Detail
5. About Mentor
6. SEO Content

---

# 61. 暂不做页面

* Growth Dashboard
* Courses
* Community
* Mentor Marketplace
* Multiple Mentors
* Subscription Center
* Advanced Profile
* Growth Analytics

---

# 62. 商业模式

MVP 阶段：

> **不验证付费意愿。**

游客：

> 每日 3 个问题。

登录用户：

> 获得更完整的产品体验。

---

# 63. 后续订阅模式

MVP 验证留存后再增加：

### Free

* 有限 AI 对话
* 基础 Memory
* 有限 Journal

### Premium

* 更高使用额度
* 完整 Memory
* 完整 Decision History
* Growth Review
* Advanced Knowledge
* Personalized Growth Features

不采用：

> “越贵越像真人咨询”

的定价逻辑。

---

# 64. 核心指标

## Activation

游客开始第一次对话：

> **First Question Rate**

---

## Engagement

完成至少 3 次有效交流：

> **Meaningful Conversation Rate**

---

## Conversion

达到 3 问后登录：

> **Guest → Login Rate**

---

## Continuation

登录后继续刚才的对话：

> **Login → Continue Rate**

---

## Retention

7 天内再次回来：

> **D7 Return Rate**

---

## Journal

产生 Decision 后保存 Journal：

> **Decision Save Rate**

---

# 65. 最重要指标

HerBecoming 最重要的不是：

> PV

也不是：

> 注册量。

而是：

> **Second Meaningful Session**

即：

> 用户第一次真正使用后，是否主动回来，再次把一个真实问题交给 HerBecoming。

这是验证：

> **“AI Mentor 是否具有长期价值”**

最关键的指标。

---

# 66. 用户满意度验证

对话结束后可以低频询问：

### Did this conversation help you see your situation differently?

* Not really
* A little
* Yes
* Definitely

以及：

### Would you come back to talk through another decision?

---

# 67. MVP 技术架构

```text
                    HerBecoming Web
                         │
                         ↓
                   Next.js App
                         │
          ┌──────────────┴──────────────┐
          ↓                             ↓
 Anonymous Session                 Auth System
                                  Google / WeChat*
          │                             │
          └──────────────┬──────────────┘
                         ↓
                    API Layer
                         ↓
                  AI Orchestrator
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
     Safety           Memory          Knowledge
      Layer            Engine           Engine
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                        LLM
                         ↓
                  Mentor Response
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
           Journal               Memory
```

* 微信登录取决于主体及接入条件。

---

# 68. MVP 开发 Sprint

## Sprint 1 — Mentor Intelligence

* Mentor Philosophy
* Mentor Persona
* Knowledge Schema
* 40–60 Knowledge Units
* RAG
* AI Orchestrator

---

## Sprint 2 — Core Experience

* Homepage
* Chat
* Guest Session
* 3-question limit
* Conversation History
* Safety Layer

---

## Sprint 3 — Memory & Journal

* Memory
* Memory management
* Decision Journal
* Basic Reflection
* Conversation persistence

---

## Sprint 4 — Productization

* Google Login
* Bilingual UI
* SEO
* Analytics
* Privacy
* About Mentor
* Production deployment

---

# 69. P1

MVP 完成后：

### P1.1

* 微信登录
* 中文/英文语音
* Reflection Journal 完善

### P1.2

* Weekly Growth Review
* Growth Memory
* Growth Dashboard
* Guided Exercises

---

# 70. P2

未来：

* Multiple Mentors
* Voice-first Mentor
* Mobile App
* Community
* Expert-reviewed Content
* Premium Subscription
* Personalized Growth Plan

---

# 71. MVP 明确排除项

以下内容**不得为了“让产品看起来完整”而加入 MVP**：

* AI 女友
* AI 恋爱关系
* 虚拟人物 3D Avatar
* 多导师
* 社区
* 用户互聊
* 心理诊断
* 心理治疗
* 情绪评分
* 人格测试
* 成长分数
* 复杂推荐系统
* 大规模课程体系
* 复杂成长 Dashboard
* 复杂反作弊系统
* 实时语音 Agent
* 订阅支付

---

# 72. 产品核心差异化

| 普通 ChatGPT | HerBecoming              |
| ---------- | ----------------------- |
| 通用 AI      | 女性成长专属 Mentor           |
| 通用知识       | Mentor Knowledge System |
| 通用回答       | 稳定的 Mentor Philosophy   |
| 一次性交流      | 长期 Memory               |
| 给答案        | 帮助思考                    |
| 用户自己记录     | Decision Journal        |
| 用户选择主题     | AI 自动理解主题               |
| 可以迎合用户     | 可以温和地不同意                |
| 可能泛泛而谈     | 知识驱动的结构化思考              |

---

# 73. 最终产品定义

### 产品一句话

> **HerBecoming is an AI mentor for women who want to think more clearly, make better decisions, and grow through life's changes.**

中文：

> **HerBecoming 是一个帮助女性理清思绪、做出更好选择，并在生活变化中持续成长的 AI 导师。**

---

# 74. MVP 最终体验

用户打开：

> **HerBecoming**

看到：

> **What's on your mind?**

输入：

> “我最近越来越不喜欢自己的工作，可是我又不知道自己真正想做什么。”

AI 不问：

> “你属于 Career 还是 Self？”

也不弹出：

> “请选择你的问题类型。”

而是直接理解：

```text
Career
+
Self
+
Life Decision
```

从知识体系检索：

```text
Career Identity
+
Meaning
+
Stability vs Growth
+
Uncertainty
```

再结合导师人格生成一个**全新的、针对这个用户具体情况的回答**。

如果用户继续说：

> “其实我最害怕的是，我辞职以后会发现自己什么都不擅长。”

导师会记住这个上下文，并继续深入。

如果这是一个值得长期记录的决定：

> **Save this as a decision**

用户可以保存。

几周之后用户回来：

> “你还记得我之前想辞职的事情吗？”

导师可以基于 Memory 和 Journal 接着聊。

---

# 75. MVP 成功标准

最终，HerBecoming MVP 只需要证明一件事情：

> **用户愿意把真实的人生问题告诉这个 AI，并且觉得它的回答有独特的思想价值，以至于愿意再次回来继续交流。**

如果用户第一次使用后产生这样的感受：

> **“它不是简单地告诉我答案，而是真的帮我想清楚了一些事情。”**

并且第二次遇到问题时：

> **“这件事我想和 HerBecoming 聊聊。”**

那么 MVP 就已经证明了产品最核心的价值。

---

## MVP 一句话架构

> **四大主题是知识体系，AI 自动理解用户属于什么问题；知识库是导师的“思想基础”，LLM 是导师的“思考能力”，Memory 是导师对用户的“长期理解”，而 Journal 是用户自己的“成长记录”。**

这四者共同构成 **HerBecoming** 的核心产品，而不是把几个独立功能简单拼在一起。

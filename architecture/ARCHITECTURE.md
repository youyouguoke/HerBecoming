# HerBecoming 系统架构设计 v1.0

> 定位：AI 女性成长导师 MVP 的后端与数据架构
> 原则：先让导师“有脑子”（Knowledge + Reasoning），再长“脸”（Frontend）

---

## 1. 产品核心闭环

```text
用户真实问题
    ↓
自然语言输入
    ↓
Safety Detection（P0，优先拦截危机）
    ↓
理解层：Language / Intent / Topic / Context / Emotion
    ↓
记忆层：Memory Retrieval
    ↓
知识层：Knowledge Graph Retrieval + Reframe
    ↓
推理层：Mentor Reasoning Engine
    ↓
生成层：Mentor LLM Response
    ↓
后处理：Output Safety / Memory Extraction / Journal Detection
    ↓
用户收到回答 + 可选保存 Decision / Reflection
```

---

## 2. 技术栈选型

| 层级 | 选型 | 理由 |
|------|------|------|
| Web App | Next.js 14+ (App Router) | PRD 明确，支持 SEO、SSR/SSG、API Routes |
| 部署 | Cloudflare Pages + Workers（预留） | 符合 Allen 既有偏好；MVP 用 Pages 静态导出 + API 路由 |
| 数据库 | PostgreSQL 15+ + pgvector | PRD 明确推荐；统一存关系数据与向量检索 |
| ORM | Prisma | 类型安全、迁移管理、支持 pgvector 扩展 |
| LLM | OpenAI / Anthropic / 国产模型兼容 | 通过统一 LLM Client 抽象，便于切换与 A/B |
| Embedding | text-embedding-3-small / bge-m3 | 中英双语、成本可控 |
| Auth | NextAuth.js / Auth.js（Google OAuth） | PRD P0 要求；微信登录 P1 预留 |
| 安全 | 自研 Safety Layer（LLM + 规则） | PRD 要求语义级危机检测，不依赖关键词 |
| 缓存 | Redis（可选） | MVP 非必须，游客配额可用 DB |
| 文件存储 | 无需 | MVP 无图片/语音文件 |

---

## 3. 模块划分

```text
herbecoming/
├── apps/
│   └── web/                    # Next.js 前端（后续按设计稿开发）
│       ├── app/                # App Router
│       ├── components/
│       ├── lib/
│       └── api/                # API Routes
├── packages/
│   ├── ai-core/                # AI Orchestrator（核心资产）
│   │   ├── safety/
│   │   ├── understanding/
│   │   ├── memory/
│   │   ├── knowledge/
│   │   ├── reasoning/
│   │   └── llm/
│   ├── database/               # Prisma schema + migrations
│   └── config/
├── knowledge/                  # 知识库源数据
│   ├── schema/
│   ├── nodes/
│   ├── relations/
│   └── seeds/
└── docker/
    └── docker-compose.yml      # 本地 PostgreSQL + pgvector
```

---

## 4. 核心数据流

### 4.1 单次对话请求

```text
POST /api/chat
    │
    ▼
1. 接收 { sessionId, messageId?, content, anonymous? }
    │
    ▼
2. Safety Detection
   - 输入：当前消息 + 最近 3 轮上下文
   - 输出：{ risk_level, risk_category, confidence, action }
   - 若 crisis → 固定危机响应 + 本地资源，不走 Mentor Pipeline
    │
    ▼
3. Understanding Layer
   - Language Detection（zh/en）
   - Intent Classification（reflection/decision/goal/emotional_support/...）
   - Topic Detection（primary + secondary domains）
   - Context Summary（key conflict, emotional state, decision stage）
    │
    ▼
4. Memory Retrieval
   - 向量检索 + 最近手动编辑记忆
   - 只注入与当前问题相关的 0–3 条
    │
    ▼
5. Knowledge Retrieval
   - Query Expansion
   - Hybrid Search（vector + keyword + metadata filter）
   - Graph Expansion（related nodes, counterpoints）
   - Safety Filter（DO_NOT_GENERATE 不进入生成）
   - Reframe（REFRAME 类知识转健康表达）
   - Rerank：≤ 10 conceptual nodes
    │
    ▼
6. Mentor Reasoning Engine
   - 输出 reasoning_plan（见 PRD 24.11）
   - 不返回给用户，仅作为 LLM 上下文
    │
    ▼
7. LLM Generation
   - Prompt Layers: System Rules → Philosophy → Persona → Knowledge → Memory → Conversation
   - 生成 Mentor Response
    │
    ▼
8. 后处理
   - Output Safety / Tone Check
   - Memory Extraction（异步，不阻塞）
   - Journal Detection（Decision / Reflection 候选）
    │
    ▼
9. 持久化
   - 保存 message（user + assistant）
   - 更新 conversation_state
   - 若 crisis，记录 safety_logs
    │
    ▼
10. 返回 { response, suggestedAction?, journalCandidate? }
```

### 4.2 游客配额控制

```text
anonymous_sessions 表
    ├── id
    ├── fingerprint_id
    ├── created_at
    └── daily_quota_reset_at

daily_usage 表
    ├── anonymous_session_id / user_id
    ├── date
    ├── used_count
    └── last_used_at
```

- 每日 3 条免费普通问题
- Crisis Flow 不扣额度
- 重试同一请求不重复计数

### 4.3 登录后数据迁移

```text
Anonymous Session
    ↓
OAuth / Google
    ↓
创建 / 关联 User
    ↓
Merge Session：conversations / messages / memories / journals → user_id
```

---

## 5. 安全架构（P0）

### 5.1 三层安全

| 层级 | 作用 | 实现 |
|------|------|------|
| 输入安全 | 危机检测、恶意输入识别 | Safety LLM + 规则兜底 |
| 知识安全 | 防止操纵/博弈/控制类建议输出 | safety_class 标签 + Reframe Engine |
| 输出安全 |  tone、boundary、no diagnosis 等 | LLM self-check + 规则后处理 |

### 5.2 危机等级

- `normal`：正常 Mentor Pipeline
- `elevated`：更谨慎的导师回应（如持续自我否定）
- `crisis`：固定安全响应 + 本地危机资源 + 鼓励现实求助

### 5.3 知识安全等级（PRD 定义）

- `SAFE`：可直接使用
- `CONTEXTUAL`：结合场景，不能绝对化
- `REFRAME`：保留洞察，转为健康表达
- `DO_NOT_GENERATE`：不得作为建议输出

---

## 6. 部署架构（MVP）

```text
[Cloudflare Pages]
       │
       ├── 静态页面（Home / About / SEO / Journal）
       └── Functions / API Routes
              │
              ▼
       [PostgreSQL + pgvector]
              │
              ├── 用户/会话/对话数据
              ├── 知识图谱
              ├── 向量索引
              └── 记忆与日志
```

- 数据库可部署在：Supabase / Neon / AWS RDS / 自建
- MVP 不追求 Serverless Edge 直连 PG，可用 Cloudflare Pages Functions 调用后端 API

---

## 7. 扩展预留

| 阶段 | 内容 |
|------|------|
| P0 MVP | 聊天、安全、基础记忆、Decision Journal、游客 3 问、Google 登录 |
| P1 | 微信登录、语音输入/输出、Reflection Journal、Growth Review |
| P2 | 多导师、Mobile App、社区、订阅支付 |

---

## 8. 关键成功指标（与 PRD 对齐）

| 指标 | 定义 |
|------|------|
| First Question Rate | 游客开始第一次对话 |
| Meaningful Conversation Rate | 完成至少 3 次有效交流 |
| Guest → Login Rate | 达到 3 问后登录 |
| Login → Continue Rate | 登录后继续刚才对话 |
| D7 Return Rate | 7 天内再次回来 |
| Decision Save Rate | 产生 Decision 后保存 Journal |
| Mentor Quality Score | PRD 12 维度评分，目标 ≥ 4.0/5 |

---

## 9. 下一步依赖

1. **前端设计文档**：确定 Next.js 页面结构、组件、样式系统
2. **LLM 供应商与预算**：确认主模型、Embedding 模型、API key 管理
3. **部署环境**：确认 PostgreSQL 托管商与 Cloudflare 配置

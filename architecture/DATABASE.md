# HerBecoming Database Setup & Verification Report

> 环境：Ubuntu 24.04 LTS / PostgreSQL 16 / pgvector 0.7.4
> 状态：**已初始化完成，可直接用于后续开发**

---

## 1. 数据库环境

| 项目 | 值 |
|------|-----|
| PostgreSQL | 16.14 |
| pgvector | 0.7.4 |
| 数据库 | herbecoming |
| 用户 | herbecoming |
| 扩展 | vector |
| ORM | Prisma 5.22.0 |

---

## 2. 已创建表

```text
accounts
anonymous_sessions
conversation_states
conversations
decisions
feedbacks
knowledge_embeddings
knowledge_nodes
knowledge_relations
memories
mentor_personas
messages
reflections
safety_logs
usage_records
users
```

---

## 3. Seed 数据

| 数据类型 | 数量 |
|----------|------|
| Knowledge Nodes | 21 |
| Knowledge Relations | 15 |
| Knowledge Embeddings | 21 |
| Mentor Persona | 1 (v1.0 active) |

知识节点覆盖 SELF、RELATIONSHIPS、CAREER、LIFE_DECISIONS、COMMUNICATION 五大域，并包含 `DO_NOT_GENERATE` 安全节点示例。

---

## 4. 关键 Schema 设计说明

### 4.1 知识库

- `knowledge_nodes`：存储知识节点，含 `safety_class`、`evidence_level`、`knowledge_type`
- `knowledge_relations`：知识图谱关系，`RELATED/SUPPORTS/CONTRASTS/PREREQUISITE/REFRAMES/APPLIES_TO/EXAMPLE_OF`
- `knowledge_embeddings`：pgvector 向量，`vector(1536)`，支持多语言/多模型

### 4.2 用户与对话

- `users` / `accounts`：标准 OAuth 用户模型
- `anonymous_sessions`：游客会话，支持登录后 merge
- `conversations` / `messages`：多轮对话，消息记录意图/主题/风险等级/RAG 来源
- `conversation_states`：维护多轮状态，避免每轮重新理解

### 4.3 记忆与日志

- `memories`：用户长期记忆，向量索引，支持归档/删除
- `decisions` / `reflections`：Journal 核心表
- `safety_logs`：安全事件审计
- `usage_records`：游客/用户每日配额

---

## 5. 验证命令

```bash
# 检查表
su - postgres -c "psql -d herbecoming -c \"\\dt\""

# 检查扩展
su - postgres -c "psql -d herbecoming -c \"SELECT * FROM pg_extension WHERE extname='vector';\""

# 检查 seed
su - postgres -c "psql -d herbecoming -c \"SELECT domain, COUNT(*) FROM knowledge_nodes GROUP BY domain;\""
```

---

## 6. 本地连接字符串

```bash
# 位于 packages/database/.env
DATABASE_URL="postgresql://herbecoming:***@localhost:5432/herbecoming?schema=public"
```

---

## 7. 后续开发依赖

1. 配置真实 LLM / Embedding API key
2. 接入 Next.js + Auth.js（Google OAuth）
3. 实现 AI Orchestrator：Safety → Understanding → Memory → Knowledge → Reasoning → LLM
4. 前端设计稿到位后开始 UI 开发

---

## 8. 注意事项

- Seed 中的 embedding 是随机占位向量，仅用于验证表结构；正式上线前需用真实 embedding 模型重新生成。
- `safety_class = DO_NOT_GENERATE` 的知识节点应被检索层过滤，不得进入 LLM 上下文。
- 游客每日配额逻辑需在 API 层实现，crisis 类请求不计入配额。

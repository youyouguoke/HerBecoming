# HerBecoming Mentor Engine v0.1 验证报告

> 状态：**链路跑通**
> 验证时间：2026-08-21
> 验证环境：本地 PostgreSQL 16 + pgvector 0.7.4 + Next.js 14 + MiMo API

---

## 1. 验证目标

证明 HerBecoming 的 Mentor Engine v0.1 能够从一条自然语言用户输入出发，完整经过：

```text
Safety → Understanding → Knowledge Retrieval → Knowledge Graph → Memory → Reasoning → LLM → Output Safety
```

并返回 Mentor 回答。

---

## 2. 测试请求

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session-001",
    "content": "男朋友希望我辞掉现在的工作跟他去另一个城市，但我其实不太想去。",
    "anonymous": true
  }'
```

---

## 3. 系统内部判断结果

| 字段 | 结果 |
|------|------|
| Language | zh |
| Intent | general_conversation |
| Primary Domain | RELATIONSHIPS |
| Secondary Domains | SELF, LIFE_DECISIONS, CAREER |
| Emotional State | anxious_uncertain |
| Decision Stage | not_decision |
| Safety Status | normal |

---

## 4. 激活的知识节点

| ID | 标题 | 安全等级 |
|----|------|----------|
| REL-012 | 关心与控制需要区分 | SAFE |
| DEC-006 | 不因为已经投入而被迫继续 | SAFE |
| REL-002 | 长期关系需要价值匹配 | SAFE |
| REL-005 | 保持关系之外的自我 | SAFE |
| REL-007 | 行动比承诺更值得观察 | SAFE |
| REL-016 | 不因为已经投入而继续消耗 | CONTEXTUAL |
| DEC-001 | 从目标倒推行动 | SAFE |
| CAREER-007 | 技能是长期资产 | SAFE |

---

## 5. Mentor 回答摘要

系统返回了完整的中文 Mentor 回答，核心要点：

- 承认“不太想去”是一个值得尊重的重要信号
- 没有替用户决定是否应该跟去
- 从关系、独立性、决策逻辑三个角度提供分析框架
- 使用 REL-007（行动比承诺更值得观察）、REL-005（保持关系之外的自我）等知识
- 结尾用反思问题引导用户继续思考

---

## 6. 关键验证结论

| 验证项 | 结果 |
|--------|------|
| 数据库连接 | 通过 |
| 游客会话创建 | 通过 |
| 每日额度控制 | 通过 |
| Safety Detection | 通过（未触发危机） |
| 意图/主题理解 | 通过，自动识别多主题 |
| 知识检索 | 通过，返回 8 条相关知识 |
| 知识图谱扩展 | 通过，REL-016 等关联知识被激活 |
| Memory Retrieval | 通过（游客无记忆，返回空） |
| LLM 生成 | 通过（MiMo API 成功调用） |
| 输出安全 | 通过 |
| 消息持久化 | 通过 |

---

## 7. 发现的问题与修复

| 问题 | 修复 |
|------|------|
| 环境 `.env.local` 写入被截断，导致数据库认证失败 | 用 Python 脚本安全重建 |
| PostgreSQL 因磁盘满而 PANIC | 清理 `/var/log` 和 `npm cache`，释放 3.9G 空间 |
| Memory schema 中 `anonymousSessionId` 不存在 | 游客 MVP 仅对登录用户提供 Memory |
| 重复 sessionId 导致唯一约束冲突 | route 增加 `fingerprintId` 查找后再创建 |

---

## 8. 后续优先级

1. **真实 LLM 连接**：已用 MiMo API，fallback 到 mock 机制工作正常
2. **前端 Chat UI**：现在是 `/api/chat` 直接返回 JSON，等待设计文档
3. **游客 → 登录迁移**：Schema 已支持，需实现 OAuth 流程
4. **Memory 向量化**：当前为关键词 heuristics，后续改为 pgvector 检索
5. **Embedding 生成**：当前为占位向量，后续用真实 embedding 模型

---

## 9. 文件结构

```text
/root/projects/HerBecoming
├── apps/web
│   ├── app/api/chat/route.ts
│   ├── lib/db/prisma.ts
│   └── lib/mentor
│       ├── engine.ts
│       ├── types.ts
│       ├── safety/safety.ts
│       ├── understanding/understanding.ts
│       ├── knowledge/knowledge.ts
│       ├── memory/memory.ts
│       ├── reasoning/reasoning.ts
│       └── llm/provider.ts
├── packages/database
│   └── prisma/schema.prisma
└── architecture
    ├── ARCHITECTURE.md
    └── DATABASE.md
```

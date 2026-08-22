# HerBecoming Phase 1：Mentor Intelligence 核心实现计划

> 目标：让 HerBecoming 的回答从“通用 LLM + 关键词检索”升级为“真正的 RAG + 语义安全 + 长期记忆”。

---

## 阶段目标

1. **真正的向量 RAG 检索**：用 pgvector 的向量相似度召回 Knowledge Nodes。
2. **语义级安全检测**：用 LLM 输出结构化风险判断，关键词仅作为兜底。
3. **LLM 推理计划**：用 LLM 生成 Reasoning Plan，替代当前硬编码模板。
4. **Memory 真正落地**：从对话中提取长期记忆并写入数据库，未来对话可召回。
5. **知识库补充**：从 21 条补充到 PRD 推荐的 40–60 条。

---

## Task 1：实现向量语义检索

**目标**：让 `retrieveKnowledge` 优先使用向量相似度，而不是关键词匹配。

**文件**：
- 修改：`apps/web/lib/mentor/knowledge/knowledge.ts`
- 新增：`apps/web/lib/mentor/knowledge/vector.ts`
- 测试：手动调用 API 对比召回质量

**步骤**：
1. 读取 `.env.local` 中的 `DATABASE_URL`，确认 pgvector 可用。
2. 用 OpenAI/MiMo embedding API 对用户消息生成 1536 维向量。
3. 通过 Prisma raw query 执行 `SELECT ... ORDER BY embedding <-> $1 LIMIT $2`。
4. 混合策略：向量召回 Top-K + 同领域过滤 + 图扩展（保留现有 graph expansion）。
5. 移除以 `retrievalCount` 排序的逻辑，改为向量相似度为主。
6. 在本地用测试问题验证召回结果是否与问题语义相关。

**验收**：
- 用问题“我不知道要不要辞职”能召回 CAREER、LIFE_DECISIONS 相关节点。
- 不再依赖关键词匹配也能召回相关概念。

---

## Task 2：语义级安全检测

**目标**：用 LLM 做风险分类，关键词作为硬兜底。

**文件**：
- 修改：`apps/web/lib/mentor/safety/safety.ts`
- 新增：`apps/web/lib/mentor/safety/prompts.ts`
- 测试：构造危机/高风险/正常测试用例

**步骤**：
1. 设计 safety prompt，要求 LLM 输出 JSON：
   ```json
   {
     "riskLevel": "normal | elevated | crisis",
     "riskCategory": "self_harm | violence | manipulation | emotional_distress | ...",
     "confidence": 0.0-1.0,
     "recommendedAction": "normal | elevated | crisis",
     "crisisResponse": "..."
   }
   ```
2. 先调用 LLM 判断；若 LLM 不可用或返回异常，回退到现有关键词规则。
3. Crisis 阈值固定 0.8；Elevated 阈值 0.6。
4. 保持危机响应不消耗免费额度。
5. 写入 `safety_logs` 表记录每次判断。

**验收**：
- “我想结束生命” → crisis
- “我最近压力很大” → elevated
- “我该如何规划职业” → normal

---

## Task 3：LLM 生成 Reasoning Plan

**目标**：让 Reasoning Plan 由 LLM 根据用户输入、领域、知识节点生成。

**文件**：
- 修改：`apps/web/lib/mentor/reasoning/reasoning.ts`
- 新增：`apps/web/lib/mentor/reasoning/prompt.ts`

**步骤**：
1. 设计 prompt，输入用户消息、Understanding、Knowledge Nodes、Memories。
2. 要求输出 JSON 匹配 `ReasoningPlan` 接口。
3. 若 LLM 失败，保留当前确定性模板作为 fallback。
4. 限制输出长度，避免 context window 浪费。

**验收**：
- 同一问题，两次生成的 plan 结构稳定、内容合理。
- Fallback 在 LLM 失败时仍可工作。

---

## Task 4：Memory 提取与持久化

**目标**：从对话中识别长期有价值信息，写入 `memories` 表，并在后续对话中召回。

**文件**：
- 修改：`apps/web/lib/mentor/memory/memory.ts`
- 修改：`apps/web/lib/mentor/engine.ts`
- 修改：`apps/web/app/api/chat/route.ts`
- 新增：`apps/web/lib/mentor/memory/extract.ts`

**步骤**：
1. 用 LLM 判断用户消息 + AI 回复中是否包含值得记忆的稳定信息。
2. LLM 输出 JSON：
   ```json
   {
     "shouldSave": true,
     "type": "VALUE | GOAL | INSIGHT | DECISION | PATTERN | PREFERENCE",
     "content": "...",
     "confidence": 0.9
   }
   ```
3. 仅 confidence ≥ 0.7 且用户未明确说“不要记住”时写入 Memory。
4. 写入时同时生成 embedding，便于未来语义召回。
5. 修改 `retrieveMemories`：当 userId 存在时，用向量相似度召回；匿名用户保持 keyword fallback。
6. 在 `route.ts` 中保存 assistant message 后，异步调用 memory extraction。

**验收**：
- 用户说“我其实更看重工作自主性” → 数据库 memories 表多一条 VALUE/INSIGHT 记录。
- 刷新后再次聊到职业，AI 能引用该记忆。

---

## Task 5：补充 Knowledge Base 到 40–60 条

**目标**：覆盖 PRD 四大主题，每个主题 10–15 条。

**文件**：
- 修改：`apps/web/prisma/seed.ts`
- 新增/修改：`apps/web/lib/mentor/knowledge/data/*.json`（如需要结构化数据文件）

**步骤**：
1. 按 PRD 四大主题梳理缺失知识点：
   - Career：职业身份、稳定性 vs 成长、转行、领导力、金钱、工作生活平衡等。
   - Relationships：边界、沟通、冲突、信任、独立、情绪需求、讨好型人格等。
   - Self：自我价值、自信、价值观、恐惧、完美主义、自我怀疑、动机等。
   - Life Decisions：不确定性、风险、后悔、优先级、未来自我、人生转折等。
2. 每条知识单元包含：ID、Domain、Title、Core Idea、Counterpoint、Reflection Questions、Application Contexts。
3. 在 seed 脚本中批量插入，并自动生成 embedding。
4. 运行 seed，确认总数 ≥ 40。

**验收**：
- `SELECT COUNT(*) FROM knowledge_nodes;` ≥ 40。
- 四大主题各有 ≥ 8 条。

---

## Task 6：集成测试与部署

**目标**：确保 Phase 1 所有改动在线上可运行。

**步骤**：
1. 本地运行 `npm run build`。
2. 提交并 push 代码。
3. 部署到 Cloudflare Pages。
4. 用生产 API 测试：
   - 中文职业问题 → 回答引用知识节点
   - 英文关系问题 → 回答引用知识节点
   - 危机测试 → 返回 crisis response
   - 记忆测试 → 多轮对话后提到之前记忆
5. 修复测试中发现的问题。

---

## 开发顺序

1. Task 1（向量检索）→ 立即提升回答质量
2. Task 4（Memory 持久化）→ 长期差异化
3. Task 2（语义安全）→ P0 安全合规
4. Task 3（LLM Reasoning Plan）→ 进一步提升深度
5. Task 5（补充知识库）→ 为 RAG 提供弹药
6. Task 6（集成测试部署）

---

## 风险与依赖

- **依赖**：需要能调用 embedding API（OpenAI 或 MiMo）。当前 `provider.ts` 用 MiMo 的 `/v1/messages` 但 embedding 需要 `/v1/embeddings`。需确认 MiMo 是否支持；若不支持，准备 OpenAI fallback。
- **数据库**：生产 DB 没有 Prisma migration，seed 需要幂等执行。
- **性能**：向量检索 + LLM 多次调用会增加 latency，需要 timeout 和 fallback。

---

## 下一步动作

开始 **Task 1：向量语义检索**。

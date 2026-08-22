# HerBecoming MVP 功能测试报告与开发计划

> 生成时间：2026-08-21
> 依据文档：`01 HerBecomingPRD.md`（v1.2）
> 代码基线：`/root/projects/HerBecoming`

---

## 一、已实现功能盘点（现状）

| 模块 | 已实现 | 关键文件 |
|------|--------|----------|
| 静态首页 | ✅ Hero、CTA、背景图 | `apps/web/app/page.tsx` |
| Chat 页面 | ✅ 基础对话 UI | `apps/web/app/chat/page.tsx`, `ChatShell.tsx` |
| 游客会话 | ✅ localStorage sessionId、匿名会话表 | `useChat.ts`, `prisma/schema.prisma` |
| 每日 3 问额度 | ✅ 计数、429 限流、登录墙 | `useChat.ts`, `app/api/chat/route.ts` |
| 消息持久化 | ✅ Messages 表、Conversation 表 | `prisma/schema.prisma` |
| 刷新拉取历史 | ✅ `/api/chat/history` | `app/api/chat/history/route.ts` |
| 安全层骨架 | ⚠️ 有 `safety.ts` 但依赖简单关键词/LLM | `lib/mentor/safety/safety.ts` |
| 导师推理骨架 | ⚠️ 有 engine/reasoning/understanding 但多为 mock | `lib/mentor/engine.ts` |
| 知识检索 | ⚠️ 有 knowledge.ts，无真实向量检索 | `lib/mentor/knowledge/knowledge.ts` |
| 长期记忆 | ⚠️ Memory 表存在，未真正提取/注入 | `lib/mentor/memory/memory.ts` |
| Journal | ❌ 未实现 | — |
| Google 登录 | ❌ 未实现 | — |
| 双语 UI | ❌ 未实现 | — |
| SEO 内容页 | ❌ 未实现 | — |
| About Mentor | ❌ 未实现 | — |
| 语音 | ❌ 未实现 | — |
| 满意度反馈 | ❌ 未实现 | — |

---

## 二、功能测试发现的问题（已修复 + 待修复）

### 已修复
| # | 问题 | 修复位置 |
|---|------|----------|
| 1 | 多轮对话窗口无法滚动 | `ConversationView.tsx` |
| 2 | 刷新后聊天记录消失 | `useChat.ts` + `/api/chat/history` |
| 3 | 输入框焦点黑色 ring 不美观 | `MessageComposer.tsx` |
| 4 | 第三问后无提示/登录墙不弹出 | `useChat.ts`, `ChatShell.tsx` |
| 5 | 首页背景图可更换 | `page.tsx` + `public/images/hero-bg.jpg` |

### 待修复/待实现（P0）
| # | 问题 | 优先级 | 说明 |
|---|------|--------|------|
| A | 游客 3 问限额在 sessionId 切换后可被绕过 | P0 | 接受已知限制，但应至少在前端做单日 localStorage 硬限 |
| B | `useChat` 在 429 后未真正阻止后续请求 | P0 | 当前状态可变但 UI 仍可能允许重试 |
| C | 危机检测未真正语义级，依赖硬编码 | P0 | PRD 要求语义级风险检测 |
| D | 导师回答未基于真实 Knowledge System | P0 | 当前多为 LLM 直接生成，缺少 RAG |
| E | Memory 未写入/读取 | P0 | 长期记忆是核心差异化 |
| F | Decision Journal 未实现 | P0 | 产品核心功能之一 |
| G | 双语未实现 | P0 | 中文/英文界面与回答 |
| H | Google 登录未实现 | P0 | PRD P0 |
| I | 登录后数据迁移未实现 | P0 | 游客会话需合并到用户账号 |
| J | 未做满意度反馈收集 | P1 | PRD #66 |

---

## 三、对照 PRD 的未实现清单

### P0（MVP 必须）
1. **Google OAuth 登录**（PRD #39）
2. **登录后游客数据迁移**（PRD #40）
3. **双语支持（UI + AI）**（PRD #41-43）
4. **真正的 RAG 知识检索**（PRD #22）
5. **语义级危机检测与 Crisis Flow**（PRD #30-34）
6. **Memory 写入/读取/用户控制**（PRD #23-25）
7. **Decision Journal 创建与展示**（PRD #26-28）
8. **About Mentor 页面**（PRD #51）
9. **SEO 内容页（Career/Relationships/Self/Life Decisions）**（PRD #52-53）
10. **首页信息对齐 PRD**（PRD #46：副标题、按钮文案、辅助说明）

### P1
11. WeChat 登录（架构预留）
12. 语音输入/输出
13. Reflection Journal 完善
14. Weekly Growth Review / Growth Dashboard

### P2
15. Multiple Mentors、Mobile App、Community、Subscription

---

## 四、推荐开发顺序

按 PRD Sprint 建议并考虑依赖关系排序：

### Phase 1：Mentor Intelligence 核心（数据 + RAG + 安全）
1. 完善 Knowledge Schema，导入首批 40-60 Knowledge Units
2. 接入 pgvector，实现向量检索 + Rerank
3. 实现语义级 Safety Detection（替换关键词检测）
4. 实现 Mentor Engine 真实推理链路（Safety → Language/Intent/Topic → Memory → Knowledge → LLM → Memory Extraction）

### Phase 2：核心体验补全（会话 + 登录 + 迁移）
5. Google OAuth 登录（NextAuth + Prisma Adapter）
6. 游客 → 登录用户数据迁移
7. 双语支持（i18n + AI 语言检测）
8. 首页文案/信息对齐 PRD

### Phase 3：Journal + Memory 用户可见功能
9. Memory 提取、注入、用户管理界面
10. Decision Journal 创建、列表、详情页
11. Reflection Journal 基础版

### Phase 4：产品化与增长
12. About Mentor 页面
13. SEO 内容页
14. 满意度反馈
15. Analytics 埋点

---

## 五、下一步建议

这是一个涉及后端、数据库、AI 管线、前端多个面的工程。建议先完成 **Phase 1** 的 Mentor Intelligence，因为这是产品最核心的差异化；否则前端功能越多，AI 回答越像普通 ChatGPT。

请选择：
1. 直接按上述计划开始 **Phase 1** 开发
2. 先只修复测试问题，暂不扩展功能
3. 调整优先级（请指明先做哪一项）

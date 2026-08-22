# HerBecoming Phase 2：核心体验实现计划

> 基于 Phase 1 完成后的状态，实现 PRD 要求的登录、数据迁移、双语 UI、首页对齐。

---

## Task 1：Google OAuth 登录（NextAuth v5）

**目标**：让游客可以点击 Google 登录，登录后成为正式用户。

**依赖**：需要用户提供 `GOOGLE_CLIENT_ID` 和 `GOOGLE_CLIENT_SECRET`。

**文件**：
- 新增：`apps/web/lib/auth.ts` — NextAuth 配置
- 新增：`apps/web/app/api/auth/[...nextauth]/route.ts` — API handler
- 修改：`apps/web/components/chat/LoginWall.tsx` — 接入 Google 登录按钮
- 修改：`apps/web/lib/hooks/useChat.ts` — 支持登录后迁移匿名数据
- 修改：`apps/web/prisma/schema.prisma` — 确认 Account/User 模型适配 NextAuth v5

**步骤**：
1. 创建 `lib/auth.ts`，使用 `@auth/prisma-adapter` + Google Provider。
2. 配置 `trustHost: true`（方便本地/Cloudflare 运行）。
3. 在登录成功回调中触发数据迁移。
4. 更新 `LoginWall`，点击 Google 按钮调用 `signIn('google')`。
5. 保存 `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` 到 `.env.local`。

**验收**：
- 点击 Continue with Google 跳转 Google OAuth
- 授权后数据库 users + accounts 表新增记录
- 原有匿名会话的 conversations/messages 关联到 user

---

## Task 2：游客 → 登录用户数据迁移

**目标**：登录后保留之前的对话、消息、记忆、使用额度。

**文件**：
- 新增：`apps/web/lib/auth/migrate.ts`
- 修改：`apps/web/lib/auth.ts`

**步骤**：
1. `signIn` 回调中获取当前 `anonymousSessionId`（从客户端传入或 cookie）。
2. 迁移：
   - `conversations` 从 `anonymousSessionId` → `userId`
   - `messages` 通过 conversation 自动跟随
   - `usageRecords` 从 `anonymousSessionId` → `userId`（合并当天额度）
   - `memories` 从 anonymous 会话？当前 memory 只存 userId，所以暂无
3. 标记 `AnonymousSession.migratedToUserId = userId`
4. 前端登录后刷新页面，进入同一个 conversation。

**验收**：
- 游客聊完 3 句 → 登录 → 历史对话保留
- DB 中 conversation 的 userId 已更新

---

## Task 3：双语 UI 支持

**目标**：中英文界面切换，与 AI 对话语言一致。

**文件**：
- 新增：`apps/web/lib/i18n/config.ts`
- 新增：`apps/web/messages/en.json`
- 新增：`apps/web/messages/zh.json`
- 修改：`apps/web/app/layout.tsx`
- 修改：`apps/web/app/page.tsx`
- 修改：`apps/web/components/chat/ChatShell.tsx`, `MessageComposer.tsx`, `WelcomeState.tsx`

**步骤**：
1. 使用 lightweight i18n 方案（自定义 hook + context），不引入重型库。
2. 默认从浏览器语言检测，用户可手动切换。
3. 翻译首页、聊天页、登录墙、页脚文案。
4. 将用户语言偏好保存到 localStorage，并传给 `/api/chat`（通过 `locale` 字段）。
5. 后端 `understandInput` 使用 locale 辅助判断语言。

**验收**：
- 首页显示英文或中文
- 切换语言按钮工作
- 后端根据 locale 正确识别中文/英文

---

## Task 4：首页文案对齐 PRD

**目标**：首页严格符合 PRD #46。

**文案**：
- 主标题：What's on your mind?
- 副标题：A thoughtful AI mentor to help you navigate work, relationships, self-discovery, and life's biggest decisions.
- 输入框 placeholder：Tell me what's on your mind...
- 按钮：Start Talking
- 辅助说明：3 free questions every day. No sign-up required.

**文件**：
- 修改：`apps/web/app/page.tsx`

---

## 执行顺序

1. Task 1（Google OAuth）
2. Task 2（数据迁移）
3. Task 4（首页文案对齐）
4. Task 3（双语 UI）

---

## 当前阻塞

需要用户提供的 Google OAuth credentials：
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

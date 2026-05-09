# Express + TypeScript API Starter

一个轻量的 Express 5 + TypeScript + Prisma API 模板，使用 JWT 作为主要 API 鉴权方式，使用 Joi 做请求参数校验。

## 技术栈

- Express 5
- TypeScript
- Prisma 6
- Joi
- JWT
- Pino
- Zod 环境变量校验

脚手架预置能力：

- `multer`：文件上传
- `svg-captcha`：图形验证码
- `md5`：兼容简单摘要场景
- `lodash-es`：轻量工具函数

## 安装

```bash
pnpm install
```

## 环境变量

复制 `.env.example` 为 `.env`，并按本地环境修改。

```env
DATABASE_URL="mysql://root:password@localhost:3306/express_template"
JWT_SECRET="change-me"
SESSION_SECRET="change-me"
PORT=3000
API_PREFIX="/api"
NODE_ENV="development"
```

必填变量：

- `DATABASE_URL`
- `JWT_SECRET`
- `SESSION_SECRET`

可选变量：

- `PORT`，默认 `3000`
- `API_PREFIX`，默认 `/api`
- `NODE_ENV`，默认 `development`

环境变量会在服务启动前校验，缺失或格式错误会直接启动失败。

## 开发

```bash
pnpm dev
```

## 构建与运行

```bash
pnpm build
pnpm start
```

## 检查

```bash
pnpm typecheck
pnpm test
pnpm lint
pnpm prisma:validate
```

## Prisma

Prisma 配置位于 `prisma.config.ts`。

```bash
pnpm prisma:generate
pnpm prisma:db:push
pnpm prisma:migrate:status
```

Seed：

```bash
pnpm exec prisma db seed
```

## 路由

- `GET /health`：健康检查
- `GET /api/`：欢迎页，返回 HTML
- `GET /api/users`：用户示例接口

## 响应格式

接口响应使用轻量的 Koa 模板风格：

```json
{
  "message": "请求成功",
  "data": null,
  "type": "success",
  "error": null
}
```

错误响应示例：

```json
{
  "message": "参数校验失败",
  "data": null,
  "type": "error",
  "error": ["账号不能为空"]
}
```

## 目录结构

```text
src/
  app.ts
  config/
  controller/
  dao/
  errors/
  middleware/
  model/
  router/
  service/
  utils/
  validations/
```

分层约定：

- `router`：路由挂载和中间件组合
- `validations`：Joi schema
- `middleware`：通用中间件
- `controller`：请求/响应编排
- `service`：业务逻辑
- `dao`：数据库访问

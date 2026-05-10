<p align="center">
  <img src="docs/assets/express-server.png" alt="Express Server" width="360" />
</p>

<h1 align="center">Express Server</h1>

<p align="center">
  现代化的 Express 5 + TypeScript API 脚手架，内置 Prisma、JWT、Joi 校验、统一错误处理和现代化响应结构。
</p>

<p align="center">
  <a href="#我们的优势">我们的优势</a>
  ·
  <a href="#快速开始">快速开始</a>
  ·
  <a href="#目录约定">目录约定</a>
  ·
  <a href="#常见问题">常见问题</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/node-18%2B-339933" alt="node 18+" />
  <img src="https://img.shields.io/badge/express-5-000000" alt="express 5" />
  <img src="https://img.shields.io/badge/typescript-ready-3178c6" alt="typescript ready" />
  <img src="https://img.shields.io/badge/prisma-6-2d3748" alt="prisma 6" />
</p>

---

## 我们的优势

| 能力       | 说明                                                     |
| ---------- | -------------------------------------------------------- |
| 现代运行时 | Express 5 + TypeScript，适合继续扩展真实 API 项目        |
| 数据访问   | Prisma 6 + MySQL，配置迁移到 `prisma.config.ts`          |
| 请求校验   | Joi schema 独立放在 `validations`，路由中显式组合        |
| 错误处理   | `AppError` + 404 + 全局错误中间件，保留 Express 标准机制 |
| 响应格式   | 统一 `{ message, data, type, error }`，现代化api响应格式 |
| 脚手架预置 | 预留 `multer`、`svg-captcha`、`md5`、`lodash-es`         |

## 快速开始

1. 安装依赖。

```bash
pnpm install
```

2. 创建本地环境变量文件，并按需修改数据库、JWT、Session 配置。

```bash
cp .env.example .env
```

3. 生成 Prisma Client，让代码可以类型安全地访问数据库。

```bash
pnpm prisma:generate
```

4. 将 Prisma schema 同步到本地数据库。

```bash
pnpm prisma:db:push
```

5. 启动开发服务。

```bash
pnpm dev
```

常用命令：

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm lint
pnpm prisma:validate
pnpm exec prisma db seed
```

默认接口：

- `GET /health`
- `GET /api/`
- `GET /api/users`

## 目录约定

```text
src/
  config/       # 环境变量与应用配置
  controller/   # 请求/响应编排
  dao/          # Prisma 数据访问
  errors/       # 应用错误类型
  middleware/   # 通用中间件
  model/        # Prisma Client
  router/       # 路由挂载和中间件组合
  service/      # 业务逻辑
  utils/        # 工具函数
  validations/  # Joi schema
```

## 常见问题

<details>
<summary>如何配置环境变量？</summary>

复制 `.env.example` 为 `.env`，至少填写 `DATABASE_URL`、`JWT_SECRET`、`SESSION_SECRET`。环境变量会在启动时通过 Zod 校验。

</details>

<details>
<summary>如何执行种子文件？</summary>

执行 `pnpm exec prisma db seed`。Prisma 会读取 `prisma.config.ts`，并运行 `tsx prisma/seed.ts`。

</details>

<details>
<summary>为什么保留 multer、svg-captcha、md5、lodash-es？</summary>

这是脚手架项目的预置能力：上传、验证码、简单摘要兼容和轻量工具函数。当前不强制使用，后续业务需要时可直接接入。

</details>

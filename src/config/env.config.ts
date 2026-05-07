import 'dotenv/config'
import { z } from 'zod'

// 统一在这里读取和校验 process.env，业务代码只使用类型安全的配置对象。
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().trim().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().trim().min(1, 'JWT_SECRET is required'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_PREFIX: z.string().trim().startsWith('/').default('/api'),
  // JWT_EXPIRES_IN: z.string().trim().default('1d'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  // 在服务启动前失败，并给出足够明确的环境变量错误信息。
  const message = parsedEnv.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ')

  throw new Error(`Invalid environment configuration: ${message}`)
}

export const envConfig = parsedEnv.data

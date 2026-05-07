import { envConfig } from './env.config'

// 面向应用内部使用的配置对象，其他模块不要直接读取 process.env。
const appConfig = {
  env: envConfig.NODE_ENV,
  port: envConfig.PORT,
  apiPrefix: envConfig.API_PREFIX,
  databaseUrl: envConfig.DATABASE_URL,
  jwt: {
    secret: envConfig.JWT_SECRET,
    // expiresIn: envConfig.JWT_EXPIRES_IN,
  },
}

export default appConfig

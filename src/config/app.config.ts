import 'dotenv/config'

const appConfig = {
  port: 3000,
  apiPrefix: '/api',
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET || 'express-template',
    expiresIn: '1d',
  },
}

export default appConfig

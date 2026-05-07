import express from 'express'
import routes from './router'
import logger from './utils/logger'
import initMiddleware from './middleware'
import appConfig from './config/app.config'

const app = express()

// 挂载中间件
initMiddleware(app)
// 添加路由
routes(app)

const server = app.listen(appConfig.port, () => {
  logger.info(`App is running at http://127.0.0.1:${appConfig.port}`)
})

export { app, server }

import express from 'express'
import config from 'config'
import routes from './router'
import logger from './utils/logger'
import initMiddleware from './middleware'
const app = express()

// 挂载中间件
initMiddleware(app)

const PORT = config.get<number>('port')

app.listen(PORT, () => {
  logger.info(`App is running at http://127.0.0.1:${PORT}`)

  routes(app)
})

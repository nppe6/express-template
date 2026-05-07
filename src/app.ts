import express from 'express'
import config from 'config'
import routes from './router'
import logger from './utils/logger'
import initMiddleware from './middleware'

const app = express()

initMiddleware(app)
routes(app)

const PORT = config.get<number>('port')

const server = app.listen(PORT, () => {
  logger.info(`App is running at http://127.0.0.1:${PORT}`)
})

export { app, server }

import express from 'express'
import appConfig from '@/config/app.config'
import { routerConf } from './module'

export interface RouterConf {
  path: string
  router: express.Router
  meta: Record<string, any>
}

const API_PREFIX = appConfig.apiPrefix

function routes(app: express.Express) {
  app.get(`${API_PREFIX}/`, (_req: express.Request, res: express.Response) => {
    res.status(200).send({
      message: 'Welcome to Express2.0 API',
      prefix: API_PREFIX,
    })
  })

  /** 探针、网关、容器健康检查 */
  app.get('/health', (_req: express.Request, res: express.Response) => {
    res.status(200).send({
      status: 'ok',
      service: 'express-template',
    })
  })

  routerConf.forEach((route) => {
    app.use(`${API_PREFIX}${route.path}`, route.router)
  })
}

export default routes

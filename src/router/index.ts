import express from 'express'
import config from 'config'
import { routerConf } from './module'

export interface RouterConf {
  path: string
  router: express.Router
  meta: Record<string, any>
}

const API_PREFIX = config.get<string>('api_url')

function routes(app: express.Express) {
  app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('Hello MR.Xiao ~')
  })

  routerConf.forEach((route) => {
    app.use(`${API_PREFIX}${route.path}`, route.router)
  })
}

export default routes

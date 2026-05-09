import express from 'express'
import appConfig from '@/config/app.config'
import userRouter from './module/user'

const router = express.Router()

router.get('/', (_req: express.Request, res: express.Response) => {
  res.status(200).type('html').send(`<p>Welcome to Express2.0 API ~ </p>`)
})

router.use('/users', userRouter)

function routes(app: express.Express) {
  app.use(appConfig.apiPrefix, router)

  /** 探针、网关、容器健康检查 */
  app.get('/health', (_req: express.Request, res: express.Response) => {
    res.status(200).send({
      status: 'ok',
      service: 'express-template',
    })
  })
}

export default routes

import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import session from 'express-session'
import appConfig from '@/config/app.config'
import path from 'path'

function initMiddleware(app: Express) {
  app.use(express.json())
  app.use(express.urlencoded({ extended: false })) // 解析传入的数据格式

  // 定义静态资源文件
  app.use(express.static(path.join(__dirname, '../public')))

  // 跨域 以及 日志信息打印
  app.use(cors())
  app.use(morgan('dev'))

  // session 配置
  app.use(
    session({
      secret: appConfig.session.secret,
      resave: true,
      saveUninitialized: true,
    }),
  )
}

export default initMiddleware

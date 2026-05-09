import { NextFunction, Request, Response } from 'express'
import AppError from '@/errors/AppError'

// 所有路由之后的兜底 404，继续交给全局 errorHandler 输出统一格式。
function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(
    new AppError({
      status: 404,
      message: '接口资源不存在',
      error: req.originalUrl,
    }),
  )
}

export default notFoundHandler

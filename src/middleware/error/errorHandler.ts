import { ErrorRequestHandler } from 'express'
import AppError from '@/errors/AppError'
import { sendResponse } from '@/utils/commonRes'
import logger from '@/utils/logger'

const isProduction = process.env.NODE_ENV === 'production'

// 开发环境返回可序列化的错误详情，生产环境避免泄露内部信息。
function getErrorInfo(err: unknown) {
  if (isProduction) {
    return null
  }

  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    }
  }

  return err
}

// 全局错误处理中间件，保留 Express 错误机制，输出 Koa 模板风格响应。
const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  const appError =
    err instanceof AppError
      ? err
      : new AppError({
          status: 500,
          message: '服务器异常错误',
          error: getErrorInfo(err),
          isOperational: false,
        })

  // 预期内的 4xx 错误只记录 warn，5xx 和非预期错误记录 error。
  if (appError.status >= 500 || !appError.isOperational) {
    logger.error(err)
  } else {
    logger.warn(appError.message)
  }

  sendResponse(res, {
    status: appError.status,
    message: appError.message,
    data: null,
    type: 'error',
    error: appError.error ?? null,
  })
}

export default errorHandler

interface AppErrorOptions {
  // HTTP 状态码，例如 400、401、404、500。
  status?: number
  // 对外返回的错误说明。
  message: string
  // 错误详情，例如参数校验结果或开发环境调试信息。
  error?: unknown
  // 是否为业务预期内错误；非预期错误会按 500 记录。
  isOperational?: boolean
}

// 应用内统一错误类型，交给全局 errorHandler 转换成 Koa 风格响应。
class AppError extends Error {
  // HTTP 状态码。
  status: number
  // 错误详情。
  error?: unknown
  // 是否为可预期的业务错误。
  isOperational: boolean

  constructor(options: AppErrorOptions) {
    super(options.message)

    this.name = 'AppError'
    this.status = options.status ?? 500
    this.error = options.error
    this.isOperational = options.isOperational ?? true

    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
export type { AppErrorOptions }

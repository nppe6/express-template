import { Response } from 'express'

type ResponseType = 'success' | 'error'

interface SendResponseOption {
  // HTTP 状态码，只负责表达请求在传输层的结果。
  status?: number
  // 额外说明，给前端展示或调试使用。
  message: unknown
  // 返回给前端的数据，错误时通常为 null。
  data?: unknown
  // 表示成功与否，参考 Koa 模板中的 success / error。
  type?: ResponseType
  // 错误说明或错误详情，例如参数校验错误列表。
  error?: unknown
}

interface CommonResOption {
  // HTTP 状态码，默认 200。
  status?: number
  // 额外说明，默认“请求成功”。
  message?: unknown
}

interface CommonRes {
  (res: Response, data?: unknown, options?: CommonResOption): void
}

// 统一响应出口，只负责组装固定 JSON 结构并发送响应。
function sendResponse(res: Response, options: SendResponseOption) {
  const { status = 200, message, data = null, type = 'success', error = null } = options

  res.status(status).send({
    message,
    data,
    type,
    error,
  })
}

// 成功响应助手，默认返回 Koa 模板风格的 message / data / type / error。
const commonRes = ((res: Response, data: unknown = null, options?: CommonResOption) => {
  sendResponse(res, {
    status: options?.status ?? 200,
    message: options?.message ?? '请求成功',
    data,
    type: 'success',
  })
}) as CommonRes

export default commonRes
export { sendResponse }
export type { CommonResOption, ResponseType, SendResponseOption }

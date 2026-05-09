import { NextFunction, Request, Response } from 'express'
import Joi from 'joi'
import AppError from '@/errors/AppError'

type ValidatePosition = 'body' | 'query' | 'params'

/**
 * 通用 Joi 参数校验中间件
 * @param {Joi.Schema} schema - Joi 定义的校验规则
 * @param {'body' | 'query' | 'params'} type - 校验的位置
 */
function validate(schema: Joi.Schema, position: ValidatePosition = 'body') {
  return (req: Request, _res: Response, next: NextFunction) => {
    const data = req[position] || {}
    const { error, value } = schema.validate(data, { abortEarly: false })

    if (error) {
      return next(
        new AppError({
          status: 400,
          message: '参数校验失败',
          error: error.details.map((item) => item.message),
        }),
      )
    }

    req[position] = value
    return next()
  }
}

export default validate
export type { ValidatePosition }

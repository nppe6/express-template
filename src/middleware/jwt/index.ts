import jwt, { JwtPayload } from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { Buffer } from 'node:buffer'
import appConfig from '@/config/app.config'
import AppError from '@/errors/AppError'

export interface CustomRequest<T> extends Request {
  // token 校验通过后挂载的用户信息。
  userInfo?: T
}

// JWT 载荷中的用户信息结构。
export interface UserInfoInterface extends JwtPayload {
  id: number
  name: string
  loginID: string
  loginPwd: string
  iat: number
  exp: number
}

// token 缺失、格式错误或过期时统一抛出的业务错误。
const invalidTokenError = () =>
  new AppError({
    status: 401,
    message: 'token失效或已过期！',
  })

/**
 * 生成 Token
 * @param {Object} payload - 载荷（通常包含用户 ID / 用户名）
 * @param {number} loginInfo - 登录有效期（单位：天）
 * @returns {string} Bearer token
 */
export const generateToken = (payload: string | Buffer | object, loginInfo = 1) => {
  return `Bearer ${jwt.sign(payload, appConfig.jwt.secret, {
    algorithm: 'HS512',
    expiresIn: 60 * 60 * 24 * loginInfo,
  })}`
}

/**
 * 验证 Token 的中间件
 * @param {boolean} required - 是否必须传 token（默认必须）
 * @returns {Function} 放行
 */
export const verifyToken = (required = true) => {
  return (req: CustomRequest<JwtPayload | string>, _res: Response, next: NextFunction) => {
    let token = req.headers.authorization
    token = token ? token.split(' ')[1] : undefined

    if (token) {
      try {
        req.userInfo = jwt.verify(token, appConfig.jwt.secret, { algorithms: ['HS512'] })
      } catch {
        throw invalidTokenError()
      }

      return next()
    }

    if (required) {
      throw invalidTokenError()
    }

    return next()
  }
}

import { body } from 'express-validator'
import validate from './error.back'

export interface updateBannerInput {
  account: string
  password: string
}

const user = validate([
  body('account').notEmpty().withMessage('不能为空 ~').bail(),
  body('password').notEmpty().withMessage('不能为空 ~').bail(),
])

export default {
  user,
}

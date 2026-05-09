import Joi from 'joi'

export interface UserInput {
  account: string
  password: string
}

export const userValidator = Joi.object<UserInput>({
  account: Joi.string().required().messages({
    'any.required': '账号是必须的',
    'string.empty': '账号不能为空',
  }),
  password: Joi.string().required().messages({
    'any.required': '密码是必须的',
    'string.empty': '密码不能为空',
  }),
})


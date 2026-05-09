import express from 'express'
// 校验token 是否有效
import { verifyToken } from '../../middleware/jwt'
// 验证 参数
import validate from '../../middleware/validator/validate'
import { userValidator } from '../../validations/user.validator'
// controller 控制层
import userController from '../../controller/user.controller'
const userRouter = express.Router()

userRouter.get('/', verifyToken(false), validate(userValidator, 'body'), userController.test)

export default userRouter

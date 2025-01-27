import express from 'express'
// 校验token 是否有效
import { verifyToken } from '../middleware/jwt'
// 验证 参数
import userValidator from '../middleware/validator/user.validator'
// controller 控制层
import userController from '../controller/userController'
const userRouter = express.Router()

userRouter.get('/', verifyToken(false), userValidator.user, userController.test)

export default userRouter

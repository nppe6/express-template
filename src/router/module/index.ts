import { RouterConf } from '..'
import userRouter from '../user'

export const routerConf = [
  { path: '/users', router: userRouter }
] as RouterConf[]

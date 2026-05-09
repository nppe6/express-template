import express from 'express'
import commonRes from '@/utils/commonRes'
import userService from '@/service/user.service'

const test = async (_req: express.Request, res: express.Response) => {
  const user = await userService.test()

  commonRes(res, user)
}

export default {
  test,
}

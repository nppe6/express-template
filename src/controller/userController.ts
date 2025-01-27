import express from 'express'
import silentHandle from '../utils/silentHandle'
import commonRes from '../utils/commonRes'
import userService from '../service/userService'

const test = async (req: express.Request, res: express.Response) => {
  const [e, user] = await silentHandle(userService.test, req.body)

  return e ? commonRes.error(res, null, e.message) : commonRes(res, user)
}

export default {
  test,
}

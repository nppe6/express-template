// /userService  处理业务逻辑层

import userDao from '../dao/userDao'

const test = async () => {
  // 查找数据库 用户列表信息
  const data = await userDao.testDao()

  return data
}

export default {
  test,
}

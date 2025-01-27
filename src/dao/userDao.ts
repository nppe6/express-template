// userDao 和数据库打交道

import prisma from '../model/prisma'

const testDao = async () => {
  return await prisma.user.findMany({
    where: {},
  })
}

export default {
  testDao,
}

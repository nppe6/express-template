import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'
import _ from 'lodash'
import { Random } from 'mockjs'

const prisma = new PrismaClient()

async function run() {
  await prisma.user.create({
    data: {
      account: 'admin',
      password: await hash('123456'),
    },
  })
}

run()

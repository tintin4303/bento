// @ts-nocheck
import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('chef123', 10)
  const guestPassword = await bcrypt.hash('guest123', 10)

  // Demo Chef
  const chef = await prisma.user.upsert({
    where: { username: 'chef' },
    update: {},
    create: {
      username: 'chef',
      password: hashedPassword,
      role: 'ADMIN',
      displayName: 'Master Chef',
      chefCode: 'CHEF99',
    },
  })

  // Demo Guest
  const guest = await prisma.user.upsert({
    where: { username: 'guest' },
    update: {},
    create: {
      username: 'guest',
      password: guestPassword,
      role: 'USER',
      displayName: 'My Cutie',
      connectedChefId: chef.id,
    },
  })

  console.log({ chef, guest })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

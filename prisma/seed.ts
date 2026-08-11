import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'
import "dotenv/config";

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Starting seeding...")
  // clear existing
  await prisma.review.deleteMany()
  await prisma.order.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.user.deleteMany()

  // create users
  const adminPassword = await bcrypt.hash('chef123', 10)
  const guestPassword = await bcrypt.hash('guest123', 10)

  await prisma.user.create({
    data: {
      username: "guest",
      password: guestPassword,
      role: "USER"
    }
  })
  
  await prisma.user.create({
    data: { username: 'chef', password: adminPassword, role: 'ADMIN' }
  })

  // create menu items based on likes
  const menuItems = [
    { name: 'Krapao', description: 'Dry beef', category: 'MAIN' },
    { name: 'Steak', description: 'Medium Rare', category: 'MAIN' },
    { name: 'Salad', description: 'With sesame dressing', category: 'SIDE' },
    { name: 'Grilled Chicken', description: 'Healthy and lean', category: 'MAIN' },
    { name: 'Fried Chicken', description: 'Not too oily!', category: 'MAIN' },
    { name: 'Corn', description: 'With butter and condensed milk', category: 'SIDE' },
    { name: 'Laos Som Tum', description: 'Spicy and sour', category: 'SIDE' },
    { name: 'Chicken Soup', description: 'With coconut milk', category: 'MAIN' },
    { name: 'Greek Yogurt', description: 'With biscoff', category: 'DESSERT' },
    { name: 'Steamed Purple Potatoes', description: 'Purple inside-out', category: 'SIDE' },
    { name: 'Coconut Ice Cream', description: 'With rice', category: 'DESSERT' },
  ]

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: {
        name: item.name,
        description: item.description,
        category: item.category as any,
        isAvailableThisWeek: true
      }
    })
  }

  console.log("Database seeded successfully!")
}

main().catch(e => { console.error(e); process.exit(1) })

"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

// Generate a random 6 character code
function generateChefCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function registerUser(formData: FormData) {
  const role = formData.get("role") as "ADMIN" | "USER";
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const chefCode = formData.get("chefCode") as string | null;

  if (!username || !password || !role) {
    throw new Error("Missing fields");
  }

  // Check if username exists
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    throw new Error("Username already taken");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (role === "ADMIN") {
    // Registering as a Chef
    let newChefCode = generateChefCode();
    // Ensure uniqueness (simple retry logic)
    while (await prisma.user.findUnique({ where: { chefCode: newChefCode } })) {
      newChefCode = generateChefCode();
    }

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "ADMIN",
        chefCode: newChefCode,
        displayName: username,
      }
    });

  } else {
    // Registering as a Guest
    if (!chefCode) {
      throw new Error("You must enter a Chef Code to connect to your Chef!");
    }

    const chef = await prisma.user.findUnique({ where: { chefCode } });
    if (!chef || chef.role !== "ADMIN") {
      throw new Error("Invalid Chef Code");
    }

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "USER",
        connectedChefId: chef.id,
        displayName: username,
      }
    });
  }

  redirect("/login");
}

"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function createProject() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized. Please log in first.");
  }

  const project = await prisma.project.create({
    data: {
      userId: userId,
      landingPage: {
        create: {
          content: { components: [] }
        }
      },
      conversations: {
        create: {
          messages: {
            create: {
              role: "system",
              content: "You are an expert AI web developer. You generate structural JSON for landing pages using predefined components."
            }
          }
        }
      }
    }
  });
  
  revalidatePath("/");
  return project;
}

export async function getProjects() {
  const { userId } = await auth();

  if (userId) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        landingPage: true
      }
    });
  }

  // Guest users see 0 projects until logged in
  return [];
}

export async function getProject(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      landingPage: true,
      conversations: {
        include: {
          messages: {
            orderBy: { createdAt: "asc" }
          }
        }
      }
    }
  });
}

export async function renameProject(id: string, name: string) {
  const project = await prisma.project.update({
    where: { id },
    data: { name }
  });
  
  revalidatePath("/");
  return project;
}

export async function deleteProject(id: string) {
  const project = await prisma.project.delete({
    where: { id }
  });
  
  revalidatePath("/");
  return project;
}

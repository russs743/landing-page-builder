import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to create a project." },
        { status: 401 }
      );
    }

    const { name, prompt } = await req.json();
    const projectName = name || (prompt ? prompt.substring(0, 30) + "..." : "New Project");

    const project = await prisma.project.create({
      data: {
        name: projectName,
        userId: userId,
        landingPage: {
          create: {
            content: { components: [] }
          }
        },
        conversations: {
          create: {
            messages: {
              create: [
                {
                  role: "system",
                  content: "You are an expert AI web developer."
                },
                ...(prompt ? [{ role: "user", content: prompt }] : [])
              ]
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Create Project Error:", error);
    return NextResponse.json(
      { error: "Failed to create project", details: error.message },
      { status: 500 }
    );
  }
}

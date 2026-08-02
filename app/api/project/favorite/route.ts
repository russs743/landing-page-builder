import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { projectId, isFavorite } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { isFavorite: Boolean(isFavorite) },
    });

    return NextResponse.json({ success: true, project: updatedProject });
  } catch (error: any) {
    console.error("Failed to update favorite status:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

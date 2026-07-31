import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { action, projectId, name } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    if (action === "delete") {
      await prisma.project.delete({
        where: { id: projectId },
      });
      return NextResponse.json({ success: true, message: "Project deleted" });
    }

    if (action === "rename" && name) {
      const updated = await prisma.project.update({
        where: { id: projectId },
        data: { name },
      });
      return NextResponse.json({ success: true, project: updated });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Manage Project Error:", error);
    return NextResponse.json(
      { error: "Failed to manage project", details: error.message },
      { status: 500 }
    );
  }
}

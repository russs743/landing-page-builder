import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { projectId, components, action, theme } = await req.json();

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { landingPage: true },
    });

    if (!project || !project.landingPage) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    let updatedComponents = components || (project.landingPage.content as any)?.components || [];

    if (action === "applyTheme" && theme) {
      const { bgColor, textColor } = theme;
      updatedComponents = updatedComponents.map((c: any) => ({
        ...c,
        props: {
          ...c.props,
          bgColor,
          textColor,
        },
      }));
    }

    await prisma.landingPage.update({
      where: { id: project.landingPage.id },
      data: { content: { components: updatedComponents } },
    });

    return NextResponse.json({ success: true, components: updatedComponents });
  } catch (error: any) {
    console.error("Page Update Error:", error);
    return NextResponse.json(
      { error: "Failed to update page", details: error.message },
      { status: 500 }
    );
  }
}

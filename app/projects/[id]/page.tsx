import { getProject } from "@/lib/db/actions";
import { notFound, redirect } from "next/navigation";
import { WorkspaceArea } from "./WorkspaceArea";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function ProjectBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  // Require authentication to access project builder
  if (!userId) {
    redirect("/");
  }

  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  // Ensure user owns this project if project has a userId
  if (project.userId && project.userId !== userId) {
    redirect("/");
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white dark:bg-zinc-950">
      <WorkspaceArea 
        project={project} 
      />
    </div>
  );
}

import { getProject } from "@/lib/db/actions";
import { notFound } from "next/navigation";
import { CanvasRenderer } from "@/app/projects/[id]/CanvasRenderer";

export const dynamic = "force-dynamic";

export default async function ShareProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  const components = (project.landingPage?.content as any)?.components || [];

  return (
    <div className="min-h-screen w-full bg-white dark:bg-zinc-950">
      <CanvasRenderer components={components} />
    </div>
  );
}

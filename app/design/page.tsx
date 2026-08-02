import { getProjects } from "@/lib/db/actions";
import { V0Dashboard } from "@/components/dashboard/V0Dashboard";

export const dynamic = "force-dynamic";

export default async function DesignPage() {
  let projects: any[] = [];
  try {
    projects = await getProjects();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
  }

  return <V0Dashboard initialProjects={projects} initialTab="design" />;
}

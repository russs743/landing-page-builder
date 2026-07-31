import { createProject } from "@/lib/db/actions";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const project = await createProject();
  redirect(`/projects/${project.id}`);
}

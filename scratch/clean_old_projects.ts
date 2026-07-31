import "dotenv/config";
import { prisma } from "../lib/db/prisma";

async function main() {
  const result = await prisma.project.deleteMany({
    where: {
      userId: null
    }
  });
  console.log(`Successfully deleted ${result.count} old unassigned guest projects!`);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));

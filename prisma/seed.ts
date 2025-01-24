import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing records
  await prisma.grid.deleteMany({});

  // Create array of 98 grid items
  const gridItems = Array.from({ length: 98 }, (_, i) => ({
    number: i + 1,
    src: "/unknown.png", // Using the same image as in your frontend
  }));

  // Insert all grid items
  for (const item of gridItems) {
    await prisma.grid.create({
      data: item,
    });
  }

  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

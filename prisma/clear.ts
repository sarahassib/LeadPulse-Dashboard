import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.campaign.count();
  console.log("Campagnes avant suppression:", count);
  
  await prisma.campaignVisual.deleteMany();
  await prisma.campaign.deleteMany();
  
  const countAfter = await prisma.campaign.count();
  console.log("Campagnes après suppression:", countAfter);
  console.log("Base de données nettoyée.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

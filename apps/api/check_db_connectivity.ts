import { PrismaClient } from '@prisma/client';
require('dotenv').config();

async function main() {
  console.log('DB URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not Loaded');
  const prisma = new PrismaClient();
  try {
    console.log('Checking DB connection...');
    const userCount = await prisma.user.count();
    console.log(`Users found: ${userCount}`);
    
    const gameCount = await prisma.game.count();
    console.log(`Games found: ${gameCount}`);
    
    const banks = await prisma.bankAccount.findMany();
    console.log(`Banks found: ${banks.length}`);
    
    console.log('DB Connection Check: SUCCESS');
  } catch (err: any) {
    console.error('DB Connection Check: FAILED');
    console.error('Error Message:', err.message);
    console.error('Error Code:', err.code);
    console.error('Full Error:', JSON.stringify(err, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main();

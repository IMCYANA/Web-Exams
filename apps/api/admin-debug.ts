import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');

  // Test 1: System Settings
  try {
    console.log('Testing System Settings...');
    const result = await prisma.systemSettings.upsert({
      where: { key: 'terms_of_service' },
      update: {
        value: 'Initial Terms',
      },
      create: {
        key: 'terms_of_service',
        value: 'Initial Terms',
      },
    });

    console.log('System Settings OK:', result);
  } catch (error) {
    console.error('System Settings Failed:', error);
  }

  // Test 2: News/Announcements
  try {
    console.log('Testing Announcements...');
    const news = await prisma.announcement.findMany({
      where: { isActive: true },
      take: 1,
    });
    console.log('Announcements OK:', news.length);
  } catch (error) {
    console.error('Announcements Failed:', error);
  }

  // Test 3: Bank Accounts
  try {
    console.log('Testing Bank Accounts...');
    const banks = await prisma.bankAccount.findMany({
      where: { isActive: true },
      take: 1,
    });
    console.log('Bank Accounts OK:', banks.length);
  } catch (error) {
    console.error('Bank Accounts Failed:', error);
  }

  await prisma.$disconnect();
}

main();

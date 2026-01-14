import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        const banks = await prisma.bankAccount.findMany();
        console.log('Current Bank Accounts:', JSON.stringify(banks, null, 2));
    } catch (err) {
        console.error('Error fetching banks:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();

import { PrismaClient } from '@prisma/client';

console.log('DATABASE_URL:', process.env.DATABASE_URL);

const prisma = new PrismaClient();

async function main() {
    console.log('Connecting to database...');
    try {
        const users = await prisma.user.findMany();
        console.log('Successfully fetched users:', users.length);
    } catch (error) {
        console.error('Error fetching users:', JSON.stringify(error, null, 2));
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

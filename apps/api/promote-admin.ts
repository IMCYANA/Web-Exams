
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'kaluz1073@gmail.com';
    console.log(`Promoting user ${email} to ADMIN...`);

    const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
    });

    console.log('Success! Updated user:', { id: user.id, email: user.email, role: user.role });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());

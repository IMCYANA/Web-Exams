import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        // Update Bangkok Bank (9807741567)
        await prisma.bankAccount.updateMany({
            where: {
                bankName: 'ธนาคารกรุงเทพ',
                accountNumber: { contains: '9807741567' }
            },
            data: {
                accountName: 'นายฐิติวุฒิ อริกุล', // Add 'นาย'
            }
        });

        // Update Krungthai Bank (3170674668)
        await prisma.bankAccount.updateMany({
            where: {
                bankName: 'ธนาคารกรุงไทย',
                accountNumber: { contains: '3170674668' }
            },
            data: {
                accountName: 'นายฐิติวุฒิ อริกุล', // Ensure consistent
            }
        });

        console.log('Bank account names updated.');
    } catch (err) {
        console.error('Error updating banks:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();

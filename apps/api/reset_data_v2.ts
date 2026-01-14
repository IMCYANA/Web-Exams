import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        console.log('Starting Clean Reset...');

        // 1. Delete all notifications
        // We use try-catch here in case the table doesn't exist yet (model mismatch)
        try {
            const deletedNotifs = await prisma.notification.deleteMany({});
            console.log(`Deleted ${deletedNotifs.count} notifications.`);
        } catch (e) {
            console.warn('Could not delete notifications (table might be missing):', e.message);
        }

        // 2. Delete all topup transactions
        const deletedTopups = await prisma.topupTransaction.deleteMany({});
        console.log(`Deleted ${deletedTopups.count} topup transactions.`);

        // 3. Reset all user credits to 0
        const updatedUsers = await prisma.user.updateMany({
            data: {
                credit: 0
            }
        });
        console.log(`Reset credit for ${updatedUsers.count} users.`);

    } catch (err) {
        console.error('Error resetting data:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();

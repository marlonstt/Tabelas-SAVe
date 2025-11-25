import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log('Testing Prisma connection...');

        const user = await prisma.sAVe_Usuarios.findUnique({
            where: { email: 'msgsilva.estagio@mpmg.mp.br' }
        });

        if (!user) {
            console.log('User NOT found!');
            return;
        }

        console.log('User found:', user.email);
        console.log('Stored Hash:', user.password);

        const passwordToTest = '86076448';
        const isMatch = await bcrypt.compare(passwordToTest, user.password);

        console.log(`Password '${passwordToTest}' match:`, isMatch);

        if (!isMatch) {
            console.log('Generating new hash for testing...');
            const newHash = await bcrypt.hash(passwordToTest, 10);
            console.log('New Hash would be:', newHash);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
    try {
        console.log('Testing Prisma connection...');

        const users = await prisma.sAVe_Usuarios.findMany();
        console.log('Users found:', users.length);
        console.log('Users:', JSON.stringify(users, null, 2));

        const user = await prisma.sAVe_Usuarios.findUnique({
            where: { email: 'msgsilva.estagio@mpmg.mp.br' }
        });

        console.log('Admin user:', JSON.stringify(user, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();

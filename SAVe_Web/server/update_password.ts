import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function updatePassword() {
    try {
        const email = 'msgsilva.estagio@mpmg.mp.br';
        const password = '86076448';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Updating password for:', email);
        console.log('New hash:', hashedPassword);

        const user = await prisma.sAVe_Usuarios.update({
            where: { email },
            data: {
                password: hashedPassword,
                must_change_password: false
            },
        });

        console.log('User updated:', user);

        // Verify
        const verify = await bcrypt.compare(password, user.password);
        console.log('Verification match:', verify);

    } catch (error) {
        console.error('Error updating password:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updatePassword();

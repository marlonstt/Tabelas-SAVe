import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('pt-BR');
};

async function testCreateCase() {
    try {
        console.log('Testing Create Case...');

        // 1. Find max ID_Caso
        const maxIdResult = await prisma.sAVe_Geral.aggregate({
            _max: {
                ID_Caso: true
            }
        });

        const maxId = maxIdResult._max.ID_Caso || 0;
        const newId = maxId + 1;
        console.log(`Max ID: ${maxId}, New ID will be: ${newId}`);

        // 2. Create new case in SAVe_Geral
        const newCase = await prisma.sAVe_Geral.create({
            data: {
                ID_Caso: newId,
                Data: getCurrentDate(),
                Encerrado: 'Não',
                Nome: 'Caso de Teste Automatizado'
            }
        });

        console.log('Case created successfully:', newCase);

        // Verify it exists
        const fetchedCase = await prisma.sAVe_Geral.findUnique({
            where: { ID_Caso: newId }
        });

        if (fetchedCase) {
            console.log('Verification successful: Case found in DB.');
        } else {
            console.error('Verification failed: Case NOT found in DB.');
        }

    } catch (error) {
        console.error('Error creating case:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testCreateCase();

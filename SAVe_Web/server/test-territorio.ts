import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTerritorio() {
    try {
        console.log('Testing Territorio Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Territorio' }
        });

        // 1. Test SAVe_Habitacao_territorio update
        console.log('1. Testing SAVe_Habitacao_territorio update...');
        const territorioData = {
            Moradia_regular: true,
            Moradia_regular_esp: 'Casa Própria',
            Territorio: 'Urbano',
            Comunidade_tradicional: 'Não',
            Estrutura_Acesso_internet: 'Sim',
            Fatores_risco_ambiental_infra: true,
            Fatores_risco_ambiental_infra_esp: 'Enchentes',
            Tempo_Situacao_Rua: 'N/A'
        };

        await prisma.sAVe_Habitacao_territorio.upsert({
            where: { ID_Caso: caseId },
            update: territorioData,
            create: { ...territorioData, ID_Caso: caseId }
        });

        const territorio = await prisma.sAVe_Habitacao_territorio.findUnique({ where: { ID_Caso: caseId } });
        console.log('Moradia_regular:', territorio?.Moradia_regular);
        console.log('Territorio:', territorio?.Territorio);
        console.log('Fatores_risco_ambiental_infra:', territorio?.Fatores_risco_ambiental_infra);

        // Cleanup
        await prisma.sAVe_Habitacao_territorio.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testTerritorio();

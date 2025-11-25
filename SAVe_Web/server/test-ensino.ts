import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEnsino() {
    try {
        console.log('Testing Ensino Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Ensino' }
        });

        // 1. Test SAVe_Ensino_trab_renda update
        console.log('1. Testing SAVe_Ensino_trab_renda update...');
        const ensinoData = {
            Grau_escolaridade: 'Ensino Médio Completo',
            Estuda_atualmente: 'Não',
            Situacao_trabalho: 'Empregado',
            Valor_renda: '2000',
            Demanda_educacional: true,
            Desc_demanda_educacional: 'Curso Técnico'
        };

        await prisma.sAVe_Ensino_trab_renda.upsert({
            where: { ID_Caso: caseId },
            update: ensinoData,
            create: { ...ensinoData, ID_Caso: caseId }
        });

        const ensino = await prisma.sAVe_Ensino_trab_renda.findUnique({ where: { ID_Caso: caseId } });
        console.log('Grau_escolaridade:', ensino?.Grau_escolaridade);
        console.log('Situacao_trabalho:', ensino?.Situacao_trabalho);
        console.log('Demanda_educacional:', ensino?.Demanda_educacional);

        // Cleanup
        await prisma.sAVe_Ensino_trab_renda.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testEnsino();

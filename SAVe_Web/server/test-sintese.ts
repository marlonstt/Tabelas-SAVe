import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSintese() {
    try {
        console.log('Testing Sintese Analitica Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Sintese' }
        });

        // 1. Test SAVe_Sintese_Analitica update
        console.log('1. Testing SAVe_Sintese_Analitica update...');
        const sinteseData = {
            UnidadeAnalitica: 'Análise completa do caso',
            AvaliacaoDeRiscos: 'Risco alto identificado',
            PlanoDePrevencao: 'Plano de ação definido',
            Cor: 'Vermelho'
        };

        await prisma.sAVe_Sintese_Analitica.upsert({
            where: { ID_Caso: caseId },
            update: sinteseData,
            create: { ...sinteseData, ID_Caso: caseId }
        });

        const sintese = await prisma.sAVe_Sintese_Analitica.findUnique({ where: { ID_Caso: caseId } });
        console.log('UnidadeAnalitica:', sintese?.UnidadeAnalitica);
        console.log('Cor:', sintese?.Cor);

        // Cleanup
        await prisma.sAVe_Sintese_Analitica.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testSintese();

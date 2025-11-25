import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testVitimizacao() {
    try {
        console.log('Testing Vitimizacao Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Vitimizacao' }
        });

        // 1. Test SAVe_Vitimizacao update
        console.log('1. Testing SAVe_Vitimizacao update...');
        const vitimizacaoData = {
            VST_Dep_repet_reviti: 'Sim',
            VST_Espec_Dep_repet_reviti: 'Teve que repetir depoimento 3 vezes',
            VT_Culpa_vit: 'Sim',
            VT_Espec_Culpa_vit: 'Foi culpada pela família'
        };

        await prisma.sAVe_Vitimizacao.upsert({
            where: { ID_Caso: caseId },
            update: vitimizacaoData,
            create: { ...vitimizacaoData, ID_Caso: caseId }
        });

        const vitimizacao = await prisma.sAVe_Vitimizacao.findUnique({ where: { ID_Caso: caseId } });
        console.log('VST_Dep_repet_reviti:', vitimizacao?.VST_Dep_repet_reviti);
        console.log('VT_Culpa_vit:', vitimizacao?.VT_Culpa_vit);

        // Cleanup
        await prisma.sAVe_Vitimizacao.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testVitimizacao();

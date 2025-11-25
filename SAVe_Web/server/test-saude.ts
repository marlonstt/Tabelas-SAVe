import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSaude() {
    try {
        console.log('Testing Saude Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Saude' }
        });

        // 1. Test SAVe_Saude update
        console.log('1. Testing SAVe_Saude update...');
        const saudeData = {
            HS_Pessoa_deficiencia: 'Sim',
            HS_Pessoa_deficiencia_tipo: 'Física',
            HS_Condicao_saude: 'Não',
            FR_Alcool: 'Sim',
            FR_Alcool_freq: 'Ocasional',
            RS_Plano_saude: 'Sim',
            RS_Plano_saude_especif: 'Unimed',
            IV_Vitim_Impacto_Psic: 'Sim',
            IV_Vitim_Especif: 'Ansiedade'
        };

        await prisma.sAVe_Saude.upsert({
            where: { ID_Caso: caseId },
            update: saudeData,
            create: { ...saudeData, ID_Caso: caseId }
        });

        const saude = await prisma.sAVe_Saude.findUnique({ where: { ID_Caso: caseId } });
        console.log('HS_Pessoa_deficiencia:', saude?.HS_Pessoa_deficiencia);
        console.log('FR_Alcool:', saude?.FR_Alcool);
        console.log('RS_Plano_saude:', saude?.RS_Plano_saude);

        // Cleanup
        await prisma.sAVe_Saude.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testSaude();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAssistencia() {
    try {
        console.log('Testing Assistencia Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Assistencia' }
        });

        // 1. Test SAVe_Assistencia update
        console.log('1. Testing SAVe_Assistencia update...');
        const assistenciaData = {
            Cad_unico: 'Sim',
            Status_cad_unico: 'Ativo',
            SPSB_Acesso_cras: 'Sim',
            SPSB_Nome_servico: 'CRAS Centro',
            SPSEAC_Inserido_acolhimentoInst: 'Não',
            BSA_recebe_beneficios: 'Sim',
            BSA_Tipo_beneficio: 'Bolsa Família',
            BSA_seg_alimentar: 'Segura'
        };

        await prisma.sAVe_Assistencia.upsert({
            where: { ID_Caso: caseId },
            update: assistenciaData,
            create: { ...assistenciaData, ID_Caso: caseId }
        });

        const assistencia = await prisma.sAVe_Assistencia.findUnique({ where: { ID_Caso: caseId } });
        console.log('Cad_unico:', assistencia?.Cad_unico);
        console.log('SPSB_Nome_servico:', assistencia?.SPSB_Nome_servico);
        console.log('BSA_Tipo_beneficio:', assistencia?.BSA_Tipo_beneficio);

        // Cleanup
        await prisma.sAVe_Assistencia.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAssistencia();

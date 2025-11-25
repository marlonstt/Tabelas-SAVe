import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAcompanhamento() {
    try {
        console.log('Testing Acompanhamento Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Acompanhamento' }
        });

        // 1. Test SAVe_Acompanhamentos CRUD
        console.log('1. Testing Acompanhamentos CRUD...');

        // Create
        const acompanhamento = await prisma.sAVe_Acompanhamentos.create({
            data: {
                ID_Caso: caseId,
                Data: new Date(),
                Tipo_Atendimento: 'Atendimento Psicológico',
                Sintese: 'Primeira sessão de acompanhamento psicológico',
                Encaminhamento: 'Continuar acompanhamento',
                Responsaveis: 'Psicóloga Maria Silva'
            }
        });
        console.log('Created Acompanhamento:', acompanhamento);

        // Update
        const updatedAcompanhamento = await prisma.sAVe_Acompanhamentos.update({
            where: { ID: acompanhamento.ID },
            data: { Encaminhamento_Rede: 'CAPS' }
        });
        console.log('Updated Acompanhamento:', updatedAcompanhamento);

        // List
        const acompanhamentos = await prisma.sAVe_Acompanhamentos.findMany({
            where: { ID_Caso: caseId }
        });
        console.log('Total Acompanhamentos:', acompanhamentos.length);

        // Delete
        await prisma.sAVe_Acompanhamentos.delete({
            where: { ID: acompanhamento.ID }
        });
        console.log('Deleted Acompanhamento ID:', acompanhamento.ID);

        // Cleanup
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAcompanhamento();

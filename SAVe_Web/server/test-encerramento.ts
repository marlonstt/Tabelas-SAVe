import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testEncerramento() {
    try {
        console.log('Testing Encerramento Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Encerramento', Encerrado: 'Não' }
        });

        // 1. Test SAVe_Encerramento update
        console.log('1. Testing SAVe_Encerramento update...');
        const encerramentoData = {
            Data: new Date(),
            Forma_Encerramento_Caso: 'Conclusão do Atendimento',
            Observacao: 'Caso encerrado após acompanhamento completo'
        };

        await prisma.sAVe_Encerramento.upsert({
            where: { ID_Caso: caseId },
            update: encerramentoData,
            create: { ...encerramentoData, ID_Caso: caseId }
        });

        const encerramento = await prisma.sAVe_Encerramento.findUnique({ where: { ID_Caso: caseId } });
        console.log('Forma_Encerramento_Caso:', encerramento?.Forma_Encerramento_Caso);
        console.log('Data:', encerramento?.Data);

        // 2. Test updating case status to Encerrado
        console.log('2. Testing case closure...');
        await prisma.sAVe_Geral.update({
            where: { ID_Caso: caseId },
            data: { Encerrado: 'Sim' }
        });

        const casoEncerrado = await prisma.sAVe_Geral.findUnique({ where: { ID_Caso: caseId } });
        console.log('Caso Encerrado:', casoEncerrado?.Encerrado);

        // Cleanup
        await prisma.sAVe_Encerramento.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testEncerramento();

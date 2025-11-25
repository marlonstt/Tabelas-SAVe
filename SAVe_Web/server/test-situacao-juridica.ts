import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSituacaoJuridica() {
    try {
        console.log('Testing Situacao Juridica Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste SJ' }
        });

        // 1. Test SAVe_Situacao_Juridica
        console.log('1. Testing SAVe_Situacao_Juridica update...');
        await prisma.sAVe_Situacao_Juridica.upsert({
            where: { ID_Caso: caseId },
            update: { SJ_REDS: 'REDS-123' },
            create: { ID_Caso: caseId, SJ_REDS: 'REDS-123' }
        });
        const sj = await prisma.sAVe_Situacao_Juridica.findUnique({ where: { ID_Caso: caseId } });
        console.log('SJ_REDS:', sj?.SJ_REDS);

        // 2. Test SAVe_Situacao_Juridica2
        console.log('2. Testing SAVe_Situacao_Juridica2 update...');
        await prisma.sAVe_Situacao_Juridica2.upsert({
            where: { ID_Caso: caseId },
            update: { SJ2_Demanda_Seguranca: true },
            create: { ID_Caso: caseId, SJ2_Demanda_Seguranca: true }
        });
        const sj2 = await prisma.sAVe_Situacao_Juridica2.findUnique({ where: { ID_Caso: caseId } });
        console.log('SJ2_Demanda_Seguranca:', sj2?.SJ2_Demanda_Seguranca);

        // 3. Test Processos CRUD
        console.log('3. Testing Processos CRUD...');
        // Create
        const proc = await prisma.sAVe_Situacao_Juridica_Incluir_processo.create({
            data: { ID_Caso: caseId, SJIP_Numero: 'PROC-001', SJIP_Classe_Tipo: 'Criminal' }
        });
        console.log('Created Processo:', proc);

        // Update
        const updatedProc = await prisma.sAVe_Situacao_Juridica_Incluir_processo.update({
            where: { ID: proc.ID },
            data: { SJIP_Classe_Tipo: 'Civil' }
        });
        console.log('Updated Processo:', updatedProc);

        // Delete
        await prisma.sAVe_Situacao_Juridica_Incluir_processo.delete({
            where: { ID: proc.ID }
        });
        console.log('Deleted Processo ID:', proc.ID);

        // Cleanup
        await prisma.sAVe_Situacao_Juridica.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Situacao_Juridica2.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testSituacaoJuridica();

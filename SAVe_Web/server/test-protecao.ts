import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testProtecao() {
    try {
        console.log('Testing Protecao Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Protecao' }
        });

        // 1. Test SAVe_protecao_seguranca update
        console.log('1. Testing SAVe_protecao_seguranca update...');
        const protecaoData = {
            PS_Natureza_Ameaca: 'Física',
            PS_Como_Ameaca: 'Verbalmente',
            PS_Ameaca_Autor_Vitim: 'Sim',
            PS_Possui_Equip_Seguranca: 'Não'
        };

        await prisma.sAVe_protecao_seguranca.upsert({
            where: { ID_Caso: caseId },
            update: protecaoData,
            create: { ...protecaoData, ID_Caso: caseId }
        });

        const protecao = await prisma.sAVe_protecao_seguranca.findUnique({ where: { ID_Caso: caseId } });
        console.log('PS_Natureza_Ameaca:', protecao?.PS_Natureza_Ameaca);
        console.log('PS_Ameaca_Autor_Vitim:', protecao?.PS_Ameaca_Autor_Vitim);

        // 2. Test SAVe_protecao_seguranca_ameacadores CRUD
        console.log('2. Testing Ameacadores CRUD...');
        const ameacador = await prisma.sAVe_protecao_seguranca_ameacadores.create({
            data: {
                ID_Caso: caseId,
                PSA_Nome_Ameacadores: 'Ameaçador Teste'
            }
        });
        console.log('Created Ameacador:', ameacador);

        await prisma.sAVe_protecao_seguranca_ameacadores.delete({
            where: { ID: ameacador.ID }
        });
        console.log('Deleted Ameacador ID:', ameacador.ID);

        // 3. Test SAVe_protecao_seguranca_adolescente CRUD
        console.log('3. Testing Adolescentes CRUD...');
        const adolescente = await prisma.sAVe_protecao_seguranca_adolescente.create({
            data: {
                ID_Caso: caseId,
                PS_ADOLESCENTE_Nome: 'Adolescente Teste',
                PS_ADOLESCENTE_Idade: '15'
            }
        });
        console.log('Created Adolescente:', adolescente);

        await prisma.sAVe_protecao_seguranca_adolescente.delete({
            where: { ID: adolescente.ID }
        });
        console.log('Deleted Adolescente ID:', adolescente.ID);

        // Cleanup
        await prisma.sAVe_protecao_seguranca.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testProtecao();

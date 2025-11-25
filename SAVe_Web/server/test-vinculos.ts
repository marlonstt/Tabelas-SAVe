import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testVinculos() {
    try {
        console.log('Testing Vinculos Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Vinculos' }
        });

        // 1. Test SAVe_Vinculos update
        console.log('1. Testing SAVe_Vinculos update...');
        const vinculosData = {
            Qtd_Pessoas_Fam: 4,
            Renda_Total_Conv: '3000',
            Alt_Fam_Com_Vitim: 'Sim',
            Alt_Fam_Com_Vitim_Descr: 'Mudança de casa'
        };

        await prisma.sAVe_Vinculos.upsert({
            where: { ID_Caso: caseId },
            update: vinculosData,
            create: { ...vinculosData, ID_Caso: caseId }
        });

        const vinculos = await prisma.sAVe_Vinculos.findUnique({ where: { ID_Caso: caseId } });
        console.log('Qtd_Pessoas_Fam:', vinculos?.Qtd_Pessoas_Fam);
        console.log('Alt_Fam_Com_Vitim:', vinculos?.Alt_Fam_Com_Vitim);

        // 2. Test SAVe_Vinculos_Apoio CRUD
        console.log('2. Testing SAVe_Vinculos_Apoio CRUD...');

        // Create
        const vinculoApoio = await prisma.sAVe_Vinculos_Apoio.create({
            data: {
                ID_Caso: caseId,
                AVF_Nome: 'João Silva',
                AVF_Grau_Parentesco: 'Pai',
                AVF_Idade: 50,
                AVF_Rede_Apoio: true
            }
        });
        console.log('Created Vinculo Apoio:', vinculoApoio);

        // Update
        const updatedVinculoApoio = await prisma.sAVe_Vinculos_Apoio.update({
            where: { ID: vinculoApoio.ID },
            data: { AVF_Ocupacao: 'Aposentado' }
        });
        console.log('Updated Vinculo Apoio:', updatedVinculoApoio);

        // Delete
        await prisma.sAVe_Vinculos_Apoio.delete({
            where: { ID: vinculoApoio.ID }
        });
        console.log('Deleted Vinculo Apoio ID:', vinculoApoio.ID);

        // Cleanup
        await prisma.sAVe_Vinculos.delete({ where: { ID_Caso: caseId } });
        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testVinculos();

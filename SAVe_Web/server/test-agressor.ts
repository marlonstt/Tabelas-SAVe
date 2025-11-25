import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAgressor() {
    try {
        console.log('Testing Agressor Endpoints...');

        // Create a dummy case if not exists (using ID 999 for test)
        const caseId = 999;
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: { ID_Caso: caseId, Nome: 'Caso Teste Agressor' }
        });

        // 1. Test SAVe_Perfil_Agressor CRUD
        console.log('1. Testing Agressor CRUD...');
        const agressor = await prisma.sAVe_Perfil_Agressor.create({
            data: {
                ID_Caso: caseId,
                PA_Tipo_Agressor: 'Pessoa Física',
                PA_Nome_Civil: 'Agressor Teste'
            }
        });
        console.log('Created Agressor:', agressor);

        const updatedAgressor = await prisma.sAVe_Perfil_Agressor.update({
            where: { ID: agressor.ID },
            data: { PA_Apelido: 'Vulgo Teste' }
        });
        console.log('Updated Agressor:', updatedAgressor);

        // 2. Test SAVe_Perfil_Agressor_Endereco CRUD
        console.log('2. Testing Agressor Endereco CRUD...');
        const endereco = await prisma.sAVe_Perfil_Agressor_Endereco.create({
            data: {
                ID_Caso: caseId,
                ID_Perfil_Agressor: agressor.ID,
                PAE_Endereco: 'Rua Teste',
                PAE_Numero: '123'
            }
        });
        console.log('Created Endereco:', endereco);

        await prisma.sAVe_Perfil_Agressor_Endereco.delete({
            where: { ID: endereco.ID }
        });
        console.log('Deleted Endereco ID:', endereco.ID);

        // Cleanup
        await prisma.sAVe_Perfil_Agressor.delete({ where: { ID: agressor.ID } });
        console.log('Deleted Agressor ID:', agressor.ID);

        await prisma.sAVe_Geral.delete({ where: { ID_Caso: caseId } });

        console.log('Test completed successfully!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAgressor();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCompleteFlow() {
    try {
        console.log('='.repeat(80));
        console.log('TESTE DE FLUXO COMPLETO - CRIAÇÃO DE CASO SAVe');
        console.log('='.repeat(80));
        console.log('');

        const caseId = 1000; // Using a specific ID for testing

        // Step 1: Create Case (SAVe_Geral)
        console.log('📋 PASSO 1: Criando caso...');
        await prisma.sAVe_Geral.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                Nome: 'Maria da Silva',
                Tipo_Vitima: 'Mulher',
                Comarca: 'Belo Horizonte',
                Data: new Date().toISOString(),
                Tipo_Crime: 'Violência Doméstica',
                Encerrado: 'Não'
            }
        });
        console.log('✅ Caso criado com sucesso! ID:', caseId);
        console.log('');

        // Step 2: Dados de Entrada
        console.log('📝 PASSO 2: Preenchendo Dados de Entrada...');
        await prisma.sAVe_DadosDeEntrada.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                Data: new Date().toISOString(),
                Comarca_origem: 'Belo Horizonte',
                Quem_encaminha: 'Delegacia da Mulher',
                Classificacao_crime: 'Violência Doméstica',
                Classificacao_vitima: 'Mulher em situação de violência'
            }
        });
        console.log('✅ Dados de Entrada salvos!');
        console.log('');

        // Step 3: Identificação
        console.log('👤 PASSO 3: Cadastrando Identificação...');
        await prisma.sAVe_Identificacao.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                Nome_RC: 'Maria da Silva',
                Data_nascimento: new Date('1985-05-15'),
                Idade: '38',
                PPS_Sexo: 'Feminino',
                PPS_Raca_cor_etnia: 'Parda',
                PPS_estado_civil: 'Casada'
            }
        });
        console.log('✅ Identificação cadastrada!');
        console.log('');

        // Step 4: Situação Jurídica
        console.log('⚖️ PASSO 4: Registrando Situação Jurídica...');
        await prisma.sAVe_Situacao_Juridica.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                SJ_Data_Fatos: new Date('2024-11-01'),
                SJ_Tipo_Penal_Fatos: 'Lesão corporal',
                SJ_Fase_Persecucao_Penal: 'Inquérito Policial'
            }
        });
        console.log('✅ Situação Jurídica registrada!');
        console.log('');

        // Step 5: Saúde
        console.log('🏥 PASSO 5: Cadastrando informações de Saúde...');
        await prisma.sAVe_Saude.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                HS_Pessoa_deficiencia: 'Não',
                HS_Condicao_saude: 'Sim',
                HS_Condicao_saude_tipo: 'Ansiedade',
                IV_Vitim_Impacto_Psic: 'Sim',
                IV_Vitim_Especif: 'Depressão e ansiedade'
            }
        });
        console.log('✅ Informações de Saúde cadastradas!');
        console.log('');

        // Step 6: Habitação e Território
        console.log('🏠 PASSO 6: Registrando Habitação e Território...');
        await prisma.sAVe_Habitacao_territorio.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                Moradia_regular: true,
                Territorio: 'Urbano',
                Estrutura_Mat_predominante: 'Alvenaria'
            }
        });
        console.log('✅ Habitação e Território registrados!');
        console.log('');

        // Step 7: Assistência Social
        console.log('🤝 PASSO 7: Cadastrando Assistência Social...');
        await prisma.sAVe_Assistencia.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                Cad_unico: 'Sim',
                Status_cad_unico: 'Ativo',
                SPSB_Acesso_cras: 'Sim',
                BSA_recebe_beneficios: 'Sim',
                BSA_Tipo_beneficio: 'Bolsa Família'
            }
        });
        console.log('✅ Assistência Social cadastrada!');
        console.log('');

        // Step 8: Educação, Trabalho e Renda
        console.log('📚 PASSO 8: Registrando Educação, Trabalho e Renda...');
        await prisma.sAVe_Ensino_trab_renda.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                Grau_escolaridade: 'Ensino Médio Completo',
                Estuda_atualmente: 'Não',
                Situacao_trabalho: 'Desempregada',
                Valor_renda: 'R$ 0,00'
            }
        });
        console.log('✅ Educação, Trabalho e Renda registrados!');
        console.log('');

        // Step 9: Vínculos Familiares
        console.log('👨‍👩‍👧‍👦 PASSO 9: Cadastrando Vínculos Familiares...');
        await prisma.sAVe_Vinculos.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                Qtd_Pessoas_Fam: 4,
                Qtd_Filhos_Ent: 2,
                Renda_Total_Conv: 'R$ 2.500,00',
                Alt_Fam_Com_Vitim: 'Sim'
            }
        });

        // Add family member
        await prisma.sAVe_Vinculos_Apoio.create({
            data: {
                ID_Caso: caseId,
                AVF_Nome: 'Ana Silva',
                AVF_Grau_Parentesco: 'Mãe',
                AVF_Idade: 65,
                AVF_Rede_Apoio: true
            }
        });
        console.log('✅ Vínculos Familiares cadastrados!');
        console.log('');

        // Step 10: Proteção e Segurança
        console.log('🛡️ PASSO 10: Registrando Proteção e Segurança...');
        await prisma.sAVe_protecao_seguranca.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                PS_Natureza_Ameaca: 'Física',
                PS_Como_Ameaca: 'Verbal e física',
                PS_Ameaca_Autor_Vitim: 'Sim',
                PS_Autor_Acesso_Armas: 'Não',
                PS_Vitima_Violencia_Domestica: 'Sim'
            }
        });
        console.log('✅ Proteção e Segurança registradas!');
        console.log('');

        // Step 11: Perfil do Agressor
        console.log('👤 PASSO 11: Cadastrando Perfil do Agressor...');
        const agressor = await prisma.sAVe_Perfil_Agressor.create({
            data: {
                ID_Caso: caseId,
                PA_Tipo_Agressor: 'Pessoa Física',
                PA_Nome_Civil: 'João da Silva',
                PA_Idade: 42,
                PA_PPS_Sexo: 'Masculino'
            }
        });
        console.log('✅ Perfil do Agressor cadastrado!');
        console.log('');

        // Step 12: Vitimização
        console.log('😢 PASSO 12: Registrando Vitimização...');
        await prisma.sAVe_Vitimizacao.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                VST_Dep_repet_reviti: 'Sim',
                VST_Espec_Dep_repet_reviti: 'Teve que repetir depoimento 3 vezes',
                VT_Culpa_vit: 'Sim',
                VT_Espec_Culpa_vit: 'Família culpou a vítima'
            }
        });
        console.log('✅ Vitimização registrada!');
        console.log('');

        // Step 13: Síntese Analítica
        console.log('📊 PASSO 13: Criando Síntese Analítica...');
        await prisma.sAVe_Sintese_Analitica.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                UnidadeAnalitica: 'Caso de violência doméstica com risco médio',
                AvaliacaoDeRiscos: 'Risco médio - agressor não possui armas mas há histórico de violência',
                PlanoDePrevencao: 'Acompanhamento psicológico e assistência social',
                DataVencimento: new Date('2025-02-01'),
                Cor: 'Amarelo'
            }
        });
        console.log('✅ Síntese Analítica criada!');
        console.log('');

        // Step 14: Acompanhamentos
        console.log('📅 PASSO 14: Registrando Acompanhamentos...');
        await prisma.sAVe_Acompanhamentos.create({
            data: {
                ID_Caso: caseId,
                Data: new Date('2024-11-10'),
                Tipo_Atendimento: 'Atendimento Psicológico',
                Sintese: 'Primeira sessão de acolhimento. Vítima apresenta sinais de trauma.',
                Encaminhamento: 'Continuar acompanhamento semanal',
                Responsaveis: 'Psicóloga Maria Santos'
            }
        });

        await prisma.sAVe_Acompanhamentos.create({
            data: {
                ID_Caso: caseId,
                Data: new Date('2024-11-17'),
                Tipo_Atendimento: 'Atendimento Social',
                Sintese: 'Orientação sobre benefícios sociais e direitos.',
                Encaminhamento_Rede: 'CRAS',
                Responsaveis: 'Assistente Social João Oliveira'
            }
        });
        console.log('✅ Acompanhamentos registrados! (2 registros)');
        console.log('');

        // Step 15: Verificar dados completos
        console.log('🔍 PASSO 15: Verificando dados completos do caso...');
        const caseComplete = await prisma.sAVe_Geral.findUnique({
            where: { ID_Caso: caseId }
        });

        const acompanhamentos = await prisma.sAVe_Acompanhamentos.findMany({
            where: { ID_Caso: caseId }
        });

        console.log('📋 Resumo do Caso:');
        console.log('  - ID:', caseId);
        console.log('  - Nome:', caseComplete?.Nome);
        console.log('  - Tipo:', caseComplete?.Tipo_Vitima);
        console.log('  - Comarca:', caseComplete?.Comarca);
        console.log('  - Status:', caseComplete?.Encerrado);
        console.log('  - Total de Acompanhamentos:', acompanhamentos.length);
        console.log('');

        // Optional: Encerramento (commented out to keep case open for manual testing)
        /*
        console.log('🔒 PASSO 16: Encerrando caso (OPCIONAL)...');
        await prisma.sAVe_Encerramento.upsert({
            where: { ID_Caso: caseId },
            update: {},
            create: {
                ID_Caso: caseId,
                Data: new Date(),
                Forma_Encerramento_Caso: 'Conclusão do Atendimento',
                Observacao: 'Caso concluído após 3 meses de acompanhamento. Vítima em situação estável.'
            }
        });

        await prisma.sAVe_Geral.update({
            where: { ID_Caso: caseId },
            data: { Encerrado: 'Sim' }
        });
        console.log('✅ Caso encerrado!');
        console.log('');
        */

        console.log('='.repeat(80));
        console.log('✅ TESTE COMPLETO FINALIZADO COM SUCESSO!');
        console.log('='.repeat(80));
        console.log('');
        console.log('📌 PRÓXIMOS PASSOS:');
        console.log('  1. Acesse o frontend em: http://localhost:5173');
        console.log('  2. Faça login com suas credenciais');
        console.log('  3. Navegue até o caso ID:', caseId);
        console.log('  4. Verifique todas as abas e dados preenchidos');
        console.log('  5. Teste a navegação entre as telas');
        console.log('  6. Teste editar alguns campos');
        console.log('  7. Teste adicionar novos acompanhamentos');
        console.log('  8. Por fim, teste o encerramento do caso');
        console.log('');
        console.log('💡 DICA: Para limpar este caso de teste, execute:');
        console.log('   DELETE FROM save_geral WHERE "ID_Caso" = ' + caseId + ';');
        console.log('');

    } catch (error) {
        console.error('❌ ERRO NO TESTE:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the test
testCompleteFlow()
    .then(() => {
        console.log('✅ Script finalizado com sucesso!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script falhou:', error);
        process.exit(1);
    });

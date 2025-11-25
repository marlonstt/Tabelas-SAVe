import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Helper to get current date in DD/MM/YYYY format
const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('pt-BR');
};

export const createCase = async (req: AuthRequest, res: Response) => {
    try {
        // 1. Find max ID_Caso
        const maxIdResult = await prisma.sAVe_Geral.aggregate({
            _max: {
                ID_Caso: true
            }
        });

        const maxId = maxIdResult._max.ID_Caso || 0;
        const newId = maxId + 1;

        // 2. Create new case in SAVe_Geral
        const newCase = await prisma.sAVe_Geral.create({
            data: {
                ID_Caso: newId,
                Data: getCurrentDate(),
                Encerrado: 'Não',
                // Initialize other fields as needed
            }
        });

        res.status(201).json({ id: newId, message: 'Caso criado com sucesso' });
    } catch (error) {
        console.error('Error creating case:', error);
        res.status(500).json({ error: 'Erro ao criar caso' });
    }
};

export const getAllCases = async (req: AuthRequest, res: Response) => {
    try {
        const cases = await prisma.sAVe_Geral.findMany({
            select: {
                ID_Caso: true,
                Nome: true,
                Data: true,
                Tipo_Vitima: true,
                Comarca: true,
                Encerrado: true
            },
            orderBy: {
                ID_Caso: 'desc'
            }
        });
        res.json(cases);
    } catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Erro ao buscar casos' });
    }
};

export const getCaseById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const caseId = Number(id);

        if (isNaN(caseId)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        // Fetch data from all related tables
        const [
            geral,
            dadosEntrada,
            identificacao,
            situacaoJuridica,
            saude,
            habitacao,
            assistencia,
            ensino,
            vinculos,
            protecao,
            agressor,
            vitimizacao,
            sintese,
            acompanhamentos,
            encerramento,
            situacaoJuridica2,
            processos
        ] = await Promise.all([
            prisma.sAVe_Geral.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_DadosDeEntrada.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Identificacao.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Situacao_Juridica.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Saude.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Habitacao_territorio.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Assistencia.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Ensino_trab_renda.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Vinculos.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_protecao_seguranca.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Perfil_Agressor.findFirst({ where: { ID_Caso: caseId } }), // Note: Agressor might be 1:N but usually 1:1 in this context or just first
            prisma.sAVe_Vitimizacao.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Sintese_Analitica.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Acompanhamentos.findMany({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Encerramento.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Situacao_Juridica2.findUnique({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Situacao_Juridica_Incluir_processo.findMany({ where: { ID_Caso: caseId } })
        ]);

        // Buscar tabelas 1:N de Identificação, Vínculos, Proteção e Agressor
        const [telefones, emails, vinculosApoio, ameacadores, adolescentes, agressores, agressorEnderecos] = await Promise.all([
            // prisma.sAVe_Identificacao_endereco.findMany({ where: { ID_Caso: caseId } }), // Temporarily disabled
            prisma.sAVe_Identificacao_telefone.findMany({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Identificacao_email.findMany({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Vinculos_Apoio.findMany({ where: { ID_Caso: caseId } }),
            prisma.sAVe_protecao_seguranca_ameacadores.findMany({ where: { ID_Caso: caseId } }),
            prisma.sAVe_protecao_seguranca_adolescente.findMany({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Perfil_Agressor.findMany({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Perfil_Agressor_Endereco.findMany({ where: { ID_Caso: caseId } })
        ]);

        const enderecos: any[] = []; // Temporary empty array

        res.json({
            geral,
            dadosEntrada,
            identificacao,
            enderecos,
            telefones,
            emails,
            situacaoJuridica,
            saude,
            habitacao,
            assistencia,
            ensino,
            vinculos,
            protecao,
            agressor,
            vitimizacao,
            sintese,
            acompanhamentos,
            encerramento,
            situacaoJuridica2,
            processos,
            vinculosApoio,
            ameacadores,
            adolescentes,
            agressores,
            agressorEnderecos
        });
    } catch (error) {
        console.error('Error fetching case details:', error);
        res.status(500).json({ error: 'Erro ao buscar detalhes do caso' });
    }
};

export const updateCaseSection = async (req: AuthRequest, res: Response) => {
    try {
        const { id, section } = req.params;
        const caseId = Number(id);
        const data = req.body;

        if (isNaN(caseId)) {
            return res.status(400).json({ error: 'ID inválido' });
        }

        let updatedData;

        // Map section names to Prisma delegates
        switch (section) {
            case 'geral':
                updatedData = await prisma.sAVe_Geral.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'dados-entrada':
                updatedData = await prisma.sAVe_DadosDeEntrada.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'identificacao':
                updatedData = await prisma.sAVe_Identificacao.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'situacao-juridica':
                updatedData = await prisma.sAVe_Situacao_Juridica.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'situacao-juridica-2':
                updatedData = await prisma.sAVe_Situacao_Juridica2.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'saude':
                updatedData = await prisma.sAVe_Saude.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'habitacao':
                updatedData = await prisma.sAVe_Habitacao_territorio.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'assistencia':
                updatedData = await prisma.sAVe_Assistencia.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'ensino':
                updatedData = await prisma.sAVe_Ensino_trab_renda.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'vinculos':
                updatedData = await prisma.sAVe_Vinculos.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'protecao':
                updatedData = await prisma.sAVe_protecao_seguranca.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'vitimizacao':
                updatedData = await prisma.sAVe_Vitimizacao.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'sintese':
                updatedData = await prisma.sAVe_Sintese_Analitica.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            case 'encerramento':
                updatedData = await prisma.sAVe_Encerramento.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: { ...data, ID_Caso: caseId }
                });
                break;
            // Add other sections as needed
            default:
                return res.status(400).json({ error: 'Seção inválida' });
        }

        res.json({ message: 'Dados salvos com sucesso', data: updatedData });
    } catch (error) {
        console.error('Error updating case section:', error);
        res.status(500).json({ error: 'Erro ao salvar dados' });
    }
};

// CRUD para Telefones (1:N)
export const createTelefone = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const telefone = await prisma.sAVe_Identificacao_telefone.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(telefone);
    } catch (error) {
        console.error('Error creating telefone:', error);
        res.status(500).json({ error: 'Erro ao criar telefone' });
    }
};

export const updateTelefone = async (req: AuthRequest, res: Response) => {
    try {
        const { telefoneId } = req.params;
        const telefone = await prisma.sAVe_Identificacao_telefone.update({
            where: { ID: Number(telefoneId) },
            data: req.body
        });
        res.json(telefone);
    } catch (error) {
        console.error('Error updating telefone:', error);
        res.status(500).json({ error: 'Erro ao atualizar telefone' });
    }
};

export const deleteTelefone = async (req: AuthRequest, res: Response) => {
    try {
        const { telefoneId } = req.params;
        await prisma.sAVe_Identificacao_telefone.delete({
            where: { ID: Number(telefoneId) }
        });
        res.json({ message: 'Telefone deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting telefone:', error);
        res.status(500).json({ error: 'Erro ao deletar telefone' });
    }
};

// CRUD para Emails (1:N)
export const createEmail = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const email = await prisma.sAVe_Identificacao_email.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(email);
    } catch (error) {
        console.error('Error creating email:', error);
        res.status(500).json({ error: 'Erro ao criar email' });
    }
};

export const updateEmail = async (req: AuthRequest, res: Response) => {
    try {
        const { emailId } = req.params;
        const email = await prisma.sAVe_Identificacao_email.update({
            where: { ID: Number(emailId) },
            data: req.body
        });
        res.json(email);
    } catch (error) {
        console.error('Error updating email:', error);
        res.status(500).json({ error: 'Erro ao atualizar email' });
    }
};

export const deleteEmail = async (req: AuthRequest, res: Response) => {
    try {
        const { emailId } = req.params;
        await prisma.sAVe_Identificacao_email.delete({
            where: { ID: Number(emailId) }
        });
        res.json({ message: 'Email deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting email:', error);
        res.status(500).json({ error: 'Erro ao deletar email' });
    }
};

// CRUD para Endereços (1:N)
export const createEndereco = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const endereco = await prisma.sAVe_Identificacao_endereco.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(endereco);
    } catch (error) {
        console.error('Error creating endereco:', error);
        res.status(500).json({ error: 'Erro ao criar endereço' });
    }
};

export const updateEndereco = async (req: AuthRequest, res: Response) => {
    try {
        const { enderecoId } = req.params;
        const endereco = await prisma.sAVe_Identificacao_endereco.update({
            where: { ID: Number(enderecoId) },
            data: req.body
        });
        res.json(endereco);
    } catch (error) {
        console.error('Error updating endereco:', error);
        res.status(500).json({ error: 'Erro ao atualizar endereço' });
    }
};

export const deleteEndereco = async (req: AuthRequest, res: Response) => {
    try {
        const { enderecoId } = req.params;
        await prisma.sAVe_Identificacao_endereco.delete({
            where: { ID: Number(enderecoId) }
        });
        res.json({ message: 'Endereço deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting endereco:', error);
        res.status(500).json({ error: 'Erro ao deletar endereço' });
    }
};

// CRUD para Processos (1:N) - SAVe_Situacao_Juridica_Incluir_processo
export const createProcesso = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const processo = await prisma.sAVe_Situacao_Juridica_Incluir_processo.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(processo);
    } catch (error) {
        console.error('Error creating processo:', error);
        res.status(500).json({ error: 'Erro ao criar processo' });
    }
};

export const updateProcesso = async (req: AuthRequest, res: Response) => {
    try {
        const { processoId } = req.params;
        const processo = await prisma.sAVe_Situacao_Juridica_Incluir_processo.update({
            where: { ID: Number(processoId) },
            data: req.body
        });
        res.json(processo);
    } catch (error) {
        console.error('Error updating processo:', error);
        res.status(500).json({ error: 'Erro ao atualizar processo' });
    }
};

export const deleteProcesso = async (req: AuthRequest, res: Response) => {
    try {
        const { processoId } = req.params;
        await prisma.sAVe_Situacao_Juridica_Incluir_processo.delete({
            where: { ID: Number(processoId) }
        });
        res.json({ message: 'Processo deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting processo:', error);
        res.status(500).json({ error: 'Erro ao deletar processo' });
    }
};

// CRUD para Vínculos Apoio (1:N) - SAVe_Vinculos_Apoio
export const createVinculoApoio = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const vinculo = await prisma.sAVe_Vinculos_Apoio.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(vinculo);
    } catch (error) {
        console.error('Error creating vinculo apoio:', error);
        res.status(500).json({ error: 'Erro ao criar vínculo de apoio' });
    }
};

export const updateVinculoApoio = async (req: AuthRequest, res: Response) => {
    try {
        const { vinculoId } = req.params;
        const vinculo = await prisma.sAVe_Vinculos_Apoio.update({
            where: { ID: Number(vinculoId) },
            data: req.body
        });
        res.json(vinculo);
    } catch (error) {
        console.error('Error updating vinculo apoio:', error);
        res.status(500).json({ error: 'Erro ao atualizar vínculo de apoio' });
    }
};

export const deleteVinculoApoio = async (req: AuthRequest, res: Response) => {
    try {
        const { vinculoId } = req.params;
        await prisma.sAVe_Vinculos_Apoio.delete({
            where: { ID: Number(vinculoId) }
        });
        res.json({ message: 'Vínculo de apoio deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting vinculo apoio:', error);
        res.status(500).json({ error: 'Erro ao deletar vínculo de apoio' });
    }
};

// CRUD para Ameaçadores (1:N) - SAVe_protecao_seguranca_ameacadores
export const createAmeacador = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const ameacador = await prisma.sAVe_protecao_seguranca_ameacadores.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(ameacador);
    } catch (error) {
        console.error('Error creating ameacador:', error);
        res.status(500).json({ error: 'Erro ao criar ameaçador' });
    }
};

export const updateAmeacador = async (req: AuthRequest, res: Response) => {
    try {
        const { ameacadorId } = req.params;
        const ameacador = await prisma.sAVe_protecao_seguranca_ameacadores.update({
            where: { ID: Number(ameacadorId) },
            data: req.body
        });
        res.json(ameacador);
    } catch (error) {
        console.error('Error updating ameacador:', error);
        res.status(500).json({ error: 'Erro ao atualizar ameaçador' });
    }
};

export const deleteAmeacador = async (req: AuthRequest, res: Response) => {
    try {
        const { ameacadorId } = req.params;
        await prisma.sAVe_protecao_seguranca_ameacadores.delete({
            where: { ID: Number(ameacadorId) }
        });
        res.json({ message: 'Ameaçador deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting ameacador:', error);
        res.status(500).json({ error: 'Erro ao deletar ameaçador' });
    }
};

// CRUD para Adolescentes Ameaçados (1:N) - SAVe_protecao_seguranca_adolescente
export const createAdolescenteAmeacado = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const adolescente = await prisma.sAVe_protecao_seguranca_adolescente.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(adolescente);
    } catch (error) {
        console.error('Error creating adolescente ameacado:', error);
        res.status(500).json({ error: 'Erro ao criar adolescente ameaçado' });
    }
};

export const updateAdolescenteAmeacado = async (req: AuthRequest, res: Response) => {
    try {
        const { adolescenteId } = req.params;
        const adolescente = await prisma.sAVe_protecao_seguranca_adolescente.update({
            where: { ID: Number(adolescenteId) },
            data: req.body
        });
        res.json(adolescente);
    } catch (error) {
        console.error('Error updating adolescente ameacado:', error);
        res.status(500).json({ error: 'Erro ao atualizar adolescente ameaçado' });
    }
};

export const deleteAdolescenteAmeacado = async (req: AuthRequest, res: Response) => {
    try {
        const { adolescenteId } = req.params;
        await prisma.sAVe_protecao_seguranca_adolescente.delete({
            where: { ID: Number(adolescenteId) }
        });
        res.json({ message: 'Adolescente ameaçado deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting adolescente ameacado:', error);
        res.status(500).json({ error: 'Erro ao deletar adolescente ameaçado' });
    }
};

// CRUD para Agressores (1:N) - SAVe_Perfil_Agressor
export const createAgressor = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const agressor = await prisma.sAVe_Perfil_Agressor.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(agressor);
    } catch (error) {
        console.error('Error creating agressor:', error);
        res.status(500).json({ error: 'Erro ao criar agressor' });
    }
};

export const updateAgressor = async (req: AuthRequest, res: Response) => {
    try {
        const { agressorId } = req.params;
        const agressor = await prisma.sAVe_Perfil_Agressor.update({
            where: { ID: Number(agressorId) },
            data: req.body
        });
        res.json(agressor);
    } catch (error) {
        console.error('Error updating agressor:', error);
        res.status(500).json({ error: 'Erro ao atualizar agressor' });
    }
};

export const deleteAgressor = async (req: AuthRequest, res: Response) => {
    try {
        const { agressorId } = req.params;
        await prisma.sAVe_Perfil_Agressor.delete({
            where: { ID: Number(agressorId) }
        });
        res.json({ message: 'Agressor deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting agressor:', error);
        res.status(500).json({ error: 'Erro ao deletar agressor' });
    }
};

// CRUD para Endereços de Agressores (1:N) - SAVe_Perfil_Agressor_Endereco
export const createAgressorEndereco = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const endereco = await prisma.sAVe_Perfil_Agressor_Endereco.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(endereco);
    } catch (error) {
        console.error('Error creating agressor endereco:', error);
        res.status(500).json({ error: 'Erro ao criar endereço do agressor' });
    }
};

export const updateAgressorEndereco = async (req: AuthRequest, res: Response) => {
    try {
        const { enderecoId } = req.params;
        const endereco = await prisma.sAVe_Perfil_Agressor_Endereco.update({
            where: { ID: Number(enderecoId) },
            data: req.body
        });
        res.json(endereco);
    } catch (error) {
        console.error('Error updating agressor endereco:', error);
        res.status(500).json({ error: 'Erro ao atualizar endereço do agressor' });
    }
};

export const deleteAgressorEndereco = async (req: AuthRequest, res: Response) => {
    try {
        const { enderecoId } = req.params;
        await prisma.sAVe_Perfil_Agressor_Endereco.delete({
            where: { ID: Number(enderecoId) }
        });
        res.json({ message: 'Endereço do agressor deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting agressor endereco:', error);
        res.status(500).json({ error: 'Erro ao deletar endereço do agressor' });
    }
};

// CRUD para Acompanhamentos (1:N) - SAVe_Acompanhamentos
export const createAcompanhamento = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const acompanhamento = await prisma.sAVe_Acompanhamentos.create({
            data: { ...req.body, ID_Caso: Number(id) }
        });
        res.status(201).json(acompanhamento);
    } catch (error) {
        console.error('Error creating acompanhamento:', error);
        res.status(500).json({ error: 'Erro ao criar acompanhamento' });
    }
};

export const updateAcompanhamento = async (req: AuthRequest, res: Response) => {
    try {
        const { acompanhamentoId } = req.params;
        const acompanhamento = await prisma.sAVe_Acompanhamentos.update({
            where: { ID: Number(acompanhamentoId) },
            data: req.body
        });
        res.json(acompanhamento);
    } catch (error) {
        console.error('Error updating acompanhamento:', error);
        res.status(500).json({ error: 'Erro ao atualizar acompanhamento' });
    }
};

export const deleteAcompanhamento = async (req: AuthRequest, res: Response) => {
    try {
        const { acompanhamentoId } = req.params;
        await prisma.sAVe_Acompanhamentos.delete({
            where: { ID: Number(acompanhamentoId) }
        });
        res.json({ message: 'Acompanhamento deletado com sucesso' });
    } catch (error) {
        console.error('Error deleting acompanhamento:', error);
        res.status(500).json({ error: 'Erro ao deletar acompanhamento' });
    }
};

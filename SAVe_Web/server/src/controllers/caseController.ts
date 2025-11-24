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
            encerramento
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
            prisma.sAVe_Encerramento.findUnique({ where: { ID_Caso: caseId } })
        ]);

        // Buscar tabelas 1:N de Identificação
        const [enderecos, telefones, emails] = await Promise.all([
            prisma.sAVe_Identificacao_endereco.findMany({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Identificacao_telefone.findMany({ where: { ID_Caso: caseId } }),
            prisma.sAVe_Identificacao_email.findMany({ where: { ID_Caso: caseId } })
        ]);

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
            encerramento
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

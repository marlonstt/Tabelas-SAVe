"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEndereco = exports.updateEndereco = exports.createEndereco = exports.deleteEmail = exports.updateEmail = exports.createEmail = exports.deleteTelefone = exports.updateTelefone = exports.createTelefone = exports.updateCaseSection = exports.getCaseById = exports.getAllCases = exports.createCase = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Helper to get current date in DD/MM/YYYY format
const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('pt-BR');
};
const createCase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // 1. Find max ID_Caso
        const maxIdResult = yield prisma.sAVe_Geral.aggregate({
            _max: {
                ID_Caso: true
            }
        });
        const maxId = maxIdResult._max.ID_Caso || 0;
        const newId = maxId + 1;
        // 2. Create new case in SAVe_Geral
        const newCase = yield prisma.sAVe_Geral.create({
            data: {
                ID_Caso: newId,
                Data: getCurrentDate(),
                Encerrado: 'Não',
                // Initialize other fields as needed
            }
        });
        res.status(201).json({ id: newId, message: 'Caso criado com sucesso' });
    }
    catch (error) {
        console.error('Error creating case:', error);
        res.status(500).json({ error: 'Erro ao criar caso' });
    }
});
exports.createCase = createCase;
const getAllCases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cases = yield prisma.sAVe_Geral.findMany({
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
    }
    catch (error) {
        console.error('Error fetching cases:', error);
        res.status(500).json({ error: 'Erro ao buscar casos' });
    }
});
exports.getAllCases = getAllCases;
const getCaseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const caseId = Number(id);
        if (isNaN(caseId)) {
            return res.status(400).json({ error: 'ID inválido' });
        }
        // Fetch data from all related tables
        const [geral, dadosEntrada, identificacao, situacaoJuridica, saude, habitacao, assistencia, ensino, vinculos, protecao, agressor, vitimizacao, sintese, acompanhamentos, encerramento] = yield Promise.all([
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
        const [enderecos, telefones, emails] = yield Promise.all([
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
    }
    catch (error) {
        console.error('Error fetching case details:', error);
        res.status(500).json({ error: 'Erro ao buscar detalhes do caso' });
    }
});
exports.getCaseById = getCaseById;
const updateCaseSection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                updatedData = yield prisma.sAVe_Geral.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'dados-entrada':
                updatedData = yield prisma.sAVe_DadosDeEntrada.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'identificacao':
                updatedData = yield prisma.sAVe_Identificacao.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'situacao-juridica':
                updatedData = yield prisma.sAVe_Situacao_Juridica.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'saude':
                updatedData = yield prisma.sAVe_Saude.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'habitacao':
                updatedData = yield prisma.sAVe_Habitacao_territorio.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'assistencia':
                updatedData = yield prisma.sAVe_Assistencia.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'ensino':
                updatedData = yield prisma.sAVe_Ensino_trab_renda.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'vinculos':
                updatedData = yield prisma.sAVe_Vinculos.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'protecao':
                updatedData = yield prisma.sAVe_protecao_seguranca.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'vitimizacao':
                updatedData = yield prisma.sAVe_Vitimizacao.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'sintese':
                updatedData = yield prisma.sAVe_Sintese_Analitica.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            case 'encerramento':
                updatedData = yield prisma.sAVe_Encerramento.upsert({
                    where: { ID_Caso: caseId },
                    update: data,
                    create: Object.assign(Object.assign({}, data), { ID_Caso: caseId })
                });
                break;
            // Add other sections as needed
            default:
                return res.status(400).json({ error: 'Seção inválida' });
        }
        res.json({ message: 'Dados salvos com sucesso', data: updatedData });
    }
    catch (error) {
        console.error('Error updating case section:', error);
        res.status(500).json({ error: 'Erro ao salvar dados' });
    }
});
exports.updateCaseSection = updateCaseSection;
// CRUD para Telefones (1:N)
const createTelefone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const telefone = yield prisma.sAVe_Identificacao_telefone.create({
            data: Object.assign(Object.assign({}, req.body), { ID_Caso: Number(id) })
        });
        res.status(201).json(telefone);
    }
    catch (error) {
        console.error('Error creating telefone:', error);
        res.status(500).json({ error: 'Erro ao criar telefone' });
    }
});
exports.createTelefone = createTelefone;
const updateTelefone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telefoneId } = req.params;
        const telefone = yield prisma.sAVe_Identificacao_telefone.update({
            where: { ID: Number(telefoneId) },
            data: req.body
        });
        res.json(telefone);
    }
    catch (error) {
        console.error('Error updating telefone:', error);
        res.status(500).json({ error: 'Erro ao atualizar telefone' });
    }
});
exports.updateTelefone = updateTelefone;
const deleteTelefone = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { telefoneId } = req.params;
        yield prisma.sAVe_Identificacao_telefone.delete({
            where: { ID: Number(telefoneId) }
        });
        res.json({ message: 'Telefone deletado com sucesso' });
    }
    catch (error) {
        console.error('Error deleting telefone:', error);
        res.status(500).json({ error: 'Erro ao deletar telefone' });
    }
});
exports.deleteTelefone = deleteTelefone;
// CRUD para Emails (1:N)
const createEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const email = yield prisma.sAVe_Identificacao_email.create({
            data: Object.assign(Object.assign({}, req.body), { ID_Caso: Number(id) })
        });
        res.status(201).json(email);
    }
    catch (error) {
        console.error('Error creating email:', error);
        res.status(500).json({ error: 'Erro ao criar email' });
    }
});
exports.createEmail = createEmail;
const updateEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailId } = req.params;
        const email = yield prisma.sAVe_Identificacao_email.update({
            where: { ID: Number(emailId) },
            data: req.body
        });
        res.json(email);
    }
    catch (error) {
        console.error('Error updating email:', error);
        res.status(500).json({ error: 'Erro ao atualizar email' });
    }
});
exports.updateEmail = updateEmail;
const deleteEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { emailId } = req.params;
        yield prisma.sAVe_Identificacao_email.delete({
            where: { ID: Number(emailId) }
        });
        res.json({ message: 'Email deletado com sucesso' });
    }
    catch (error) {
        console.error('Error deleting email:', error);
        res.status(500).json({ error: 'Erro ao deletar email' });
    }
});
exports.deleteEmail = deleteEmail;
// CRUD para Endereços (1:N)
const createEndereco = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const endereco = yield prisma.sAVe_Identificacao_endereco.create({
            data: Object.assign(Object.assign({}, req.body), { ID_Caso: Number(id) })
        });
        res.status(201).json(endereco);
    }
    catch (error) {
        console.error('Error creating endereco:', error);
        res.status(500).json({ error: 'Erro ao criar endereço' });
    }
});
exports.createEndereco = createEndereco;
const updateEndereco = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { enderecoId } = req.params;
        const endereco = yield prisma.sAVe_Identificacao_endereco.update({
            where: { ID: Number(enderecoId) },
            data: req.body
        });
        res.json(endereco);
    }
    catch (error) {
        console.error('Error updating endereco:', error);
        res.status(500).json({ error: 'Erro ao atualizar endereço' });
    }
});
exports.updateEndereco = updateEndereco;
const deleteEndereco = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { enderecoId } = req.params;
        yield prisma.sAVe_Identificacao_endereco.delete({
            where: { ID: Number(enderecoId) }
        });
        res.json({ message: 'Endereço deletado com sucesso' });
    }
    catch (error) {
        console.error('Error deleting endereco:', error);
        res.status(500).json({ error: 'Erro ao deletar endereço' });
    }
});
exports.deleteEndereco = deleteEndereco;

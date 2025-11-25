import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
    createCase,
    getAllCases,
    getCaseById,
    updateCaseSection,
    createTelefone,
    updateTelefone,
    deleteTelefone,
    createEmail,
    updateEmail,
    deleteEmail,
    createEndereco,
    updateEndereco,
    deleteEndereco,
    createProcesso,
    updateProcesso,
    deleteProcesso,
    createVinculoApoio,
    updateVinculoApoio,
    deleteVinculoApoio,
    createAmeacador,
    updateAmeacador,
    deleteAmeacador,
    createAdolescenteAmeacado,
    updateAdolescenteAmeacado,
    deleteAdolescenteAmeacado,
    createAgressor,
    updateAgressor,
    deleteAgressor,
    createAgressorEndereco,
    updateAgressorEndereco,
    deleteAgressorEndereco,
    createAcompanhamento,
    updateAcompanhamento,
    deleteAcompanhamento
} from '../controllers/caseController';

const router = Router();

// CRUD principal
router.post('/', authMiddleware, createCase);
router.get('/', authMiddleware, getAllCases);
router.get('/:id', authMiddleware, getCaseById);
router.put('/:id/:section', authMiddleware, updateCaseSection);

// Endereços (1:N)
router.post('/:id/enderecos', authMiddleware, createEndereco);
router.put('/:id/enderecos/:enderecoId', authMiddleware, updateEndereco);
router.delete('/:id/enderecos/:enderecoId', authMiddleware, deleteEndereco);

// Telefones (1:N)
router.post('/:id/telefones', authMiddleware, createTelefone);
router.put('/:id/telefones/:telefoneId', authMiddleware, updateTelefone);
router.delete('/:id/telefones/:telefoneId', authMiddleware, deleteTelefone);

// Emails (1:N)
router.post('/:id/emails', authMiddleware, createEmail);
router.put('/:id/emails/:emailId', authMiddleware, updateEmail);
router.delete('/:id/emails/:emailId', authMiddleware, deleteEmail);

// Processos (1:N)
router.post('/:id/processos', authMiddleware, createProcesso);
router.put('/:id/processos/:processoId', authMiddleware, updateProcesso);
router.delete('/:id/processos/:processoId', authMiddleware, deleteProcesso);

// Vínculos Apoio (1:N)
router.post('/:id/vinculos-apoio', authMiddleware, createVinculoApoio);
router.put('/:id/vinculos-apoio/:vinculoId', authMiddleware, updateVinculoApoio);
router.delete('/:id/vinculos-apoio/:vinculoId', authMiddleware, deleteVinculoApoio);

// Ameaçadores (1:N)
router.post('/:id/ameacadores', authMiddleware, createAmeacador);
router.put('/:id/ameacadores/:ameacadorId', authMiddleware, updateAmeacador);
router.delete('/:id/ameacadores/:ameacadorId', authMiddleware, deleteAmeacador);

// Adolescentes Ameaçados (1:N)
router.post('/:id/adolescentes-ameacados', authMiddleware, createAdolescenteAmeacado);
router.put('/:id/adolescentes-ameacados/:adolescenteId', authMiddleware, updateAdolescenteAmeacado);
router.delete('/:id/adolescentes-ameacados/:adolescenteId', authMiddleware, deleteAdolescenteAmeacado);

// Agressores (1:N)
router.post('/:id/agressores', authMiddleware, createAgressor);
router.put('/:id/agressores/:agressorId', authMiddleware, updateAgressor);
router.delete('/:id/agressores/:agressorId', authMiddleware, deleteAgressor);

// Endereços de Agressores (1:N)
router.post('/:id/agressores-enderecos', authMiddleware, createAgressorEndereco);
router.put('/:id/agressores-enderecos/:enderecoId', authMiddleware, updateAgressorEndereco);
router.delete('/:id/agressores-enderecos/:enderecoId', authMiddleware, deleteAgressorEndereco);



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
    deleteEndereco
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

export default router;

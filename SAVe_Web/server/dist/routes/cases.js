"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const caseController_1 = require("../controllers/caseController");
const router = (0, express_1.Router)();
// CRUD principal
router.post('/', auth_1.authMiddleware, caseController_1.createCase);
router.get('/', auth_1.authMiddleware, caseController_1.getAllCases);
router.get('/:id', auth_1.authMiddleware, caseController_1.getCaseById);
router.put('/:id/:section', auth_1.authMiddleware, caseController_1.updateCaseSection);
// Endereços (1:N)
router.post('/:id/enderecos', auth_1.authMiddleware, caseController_1.createEndereco);
router.put('/:id/enderecos/:enderecoId', auth_1.authMiddleware, caseController_1.updateEndereco);
router.delete('/:id/enderecos/:enderecoId', auth_1.authMiddleware, caseController_1.deleteEndereco);
// Telefones (1:N)
router.post('/:id/telefones', auth_1.authMiddleware, caseController_1.createTelefone);
router.put('/:id/telefones/:telefoneId', auth_1.authMiddleware, caseController_1.updateTelefone);
router.delete('/:id/telefones/:telefoneId', auth_1.authMiddleware, caseController_1.deleteTelefone);
// Emails (1:N)
router.post('/:id/emails', auth_1.authMiddleware, caseController_1.createEmail);
router.put('/:id/emails/:emailId', auth_1.authMiddleware, caseController_1.updateEmail);
router.delete('/:id/emails/:emailId', auth_1.authMiddleware, caseController_1.deleteEmail);
exports.default = router;

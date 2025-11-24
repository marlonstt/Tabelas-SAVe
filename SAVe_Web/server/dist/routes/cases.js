"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const casesController_1 = require("../controllers/casesController");
const router = (0, express_1.Router)();
router.get('/', casesController_1.getAllCases);
router.get('/:id', casesController_1.getCaseById);
router.post('/', casesController_1.createCase);
exports.default = router;

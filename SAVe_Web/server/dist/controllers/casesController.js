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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCase = exports.getCaseById = exports.getAllCases = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllCases = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cases = yield prisma.sAVe_Geral.findMany();
        res.json(cases);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching cases' });
    }
});
exports.getAllCases = getAllCases;
const getCaseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const caseItem = yield prisma.sAVe_Geral.findUnique({
            where: { ID_Caso: Number(id) },
        });
        if (caseItem) {
            res.json(caseItem);
        }
        else {
            res.status(404).json({ error: 'Case not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching case' });
    }
});
exports.getCaseById = getCaseById;
const createCase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { ID_Caso, Nome } = _a, rest = __rest(_a, ["ID_Caso", "Nome"]);
    try {
        const newCase = yield prisma.sAVe_Geral.create({
            data: Object.assign({ ID_Caso: Number(ID_Caso), Nome }, rest),
        });
        res.status(201).json(newCase);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating case' });
    }
});
exports.createCase = createCase;

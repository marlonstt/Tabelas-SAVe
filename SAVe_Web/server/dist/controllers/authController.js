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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUsers = exports.changePassword = exports.updateUser = exports.register = exports.login = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'save_secret_key_change_in_production';
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.sAVe_Usuarios.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        const validPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                mustChangePassword: user.must_change_password,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, cargo, usuario, area, role } = req.body;
        const existingUser = yield prisma.sAVe_Usuarios.findUnique({
            where: { email },
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash('123456', 10);
        const newUser = yield prisma.sAVe_Usuarios.create({
            data: {
                email,
                password: hashedPassword,
                cargo: cargo,
                usuario: usuario,
                area: area,
                role: role || 'User',
                must_change_password: true,
            },
        });
        res.status(201).json({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});
exports.register = register;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { email, cargo, usuario, area, role } = req.body;
        // Check if email is being changed and if it's already taken
        if (email) {
            const existingUser = yield prisma.sAVe_Usuarios.findFirst({
                where: {
                    email,
                    id: { not: Number(id) }
                }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }
        }
        const updatedUser = yield prisma.sAVe_Usuarios.update({
            where: { id: Number(id) },
            data: {
                email,
                cargo,
                usuario,
                area,
                role
            }
        });
        res.json({
            id: updatedUser.id,
            email: updatedUser.email,
            role: updatedUser.role,
            usuario: updatedUser.usuario,
            cargo: updatedUser.cargo,
            area: updatedUser.area
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});
exports.updateUser = updateUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }
        const user = yield prisma.sAVe_Usuarios.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const validPassword = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Senha atual incorreta' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield prisma.sAVe_Usuarios.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                must_change_password: false,
            },
        });
        res.json({ message: 'Senha alterada com sucesso' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao alterar senha' });
    }
});
exports.changePassword = changePassword;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.sAVe_Usuarios.findMany({
            select: {
                id: true,
                email: true,
                cargo: true,
                usuario: true,
                area: true,
                role: true,
                created_at: true,
            },
            orderBy: {
                usuario: 'asc'
            }
        });
        res.json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.sAVe_Usuarios.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Usuário excluído com sucesso' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
});
exports.deleteUser = deleteUser;

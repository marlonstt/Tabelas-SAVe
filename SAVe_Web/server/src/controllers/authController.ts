import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'save_secret_key_change_in_production';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.sAVe_Usuarios.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                mustChangePassword: user.must_change_password,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

export const register = async (req: AuthRequest, res: Response) => {
    try {
        const { email, cargo, usuario, area, role } = req.body;

        const existingUser = await prisma.sAVe_Usuarios.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const hashedPassword = await bcrypt.hash('123456', 10);

        const newUser = await prisma.sAVe_Usuarios.create({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const { email, cargo, usuario, area, role } = req.body;

        // Check if email is being changed and if it's already taken
        if (email) {
            const existingUser = await prisma.sAVe_Usuarios.findFirst({
                where: {
                    email,
                    id: { not: Number(id) }
                }
            });

            if (existingUser) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }
        }

        const updatedUser = await prisma.sAVe_Usuarios.update({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const user = await prisma.sAVe_Usuarios.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Senha atual incorreta' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.sAVe_Usuarios.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                must_change_password: false,
            },
        });

        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao alterar senha' });
    }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await prisma.sAVe_Usuarios.findMany({
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.sAVe_Usuarios.delete({
            where: { id: Number(id) },
        });

        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir usuário' });
    }
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCases = async (req: Request, res: Response) => {
    try {
        const cases = await prisma.sAVe_Geral.findMany();
        res.json(cases);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching cases' });
    }
};

export const getCaseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const caseItem = await prisma.sAVe_Geral.findUnique({
            where: { ID_Caso: Number(id) },
        });
        if (caseItem) {
            res.json(caseItem);
        } else {
            res.status(404).json({ error: 'Case not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching case' });
    }
};

export const createCase = async (req: Request, res: Response) => {
    const { ID_Caso, Nome, ...rest } = req.body;
    try {
        const newCase = await prisma.sAVe_Geral.create({
            data: {
                ID_Caso: Number(ID_Caso),
                Nome,
                ...rest,
            },
        });
        res.status(201).json(newCase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating case' });
    }
};

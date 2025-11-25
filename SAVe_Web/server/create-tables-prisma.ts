import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function createTables() {
    try {
        console.log('Reading SQL file...');
        const sqlPath = path.join(__dirname, '../../create_missing_tables.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');

        console.log('Executing SQL...');
        // Split by semicolon to execute statements individually if needed, 
        // but executeRawUnsafe might handle multiple statements depending on the driver.
        // Prisma/PG usually supports multiple statements in one go.
        const statements = sql.split(';').filter(stmt => stmt.trim() !== '');

        for (const stmt of statements) {
            console.log('Executing statement...');
            await prisma.$executeRawUnsafe(stmt);
        }

        console.log('Tables created successfully!');
    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTables();

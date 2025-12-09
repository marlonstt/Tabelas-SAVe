-- Script para criar o banco de dados SAVe
-- Execute este script como usuário postgres

-- Criar o banco de dados
DROP DATABASE IF EXISTS save_db;
CREATE DATABASE save_db;

-- Conectar ao banco
\c save_db

-- Criar usuário (opcional, se quiser um usuário específico)
-- DROP USER IF EXISTS save_user;
-- CREATE USER save_user WITH PASSWORD 'save_password';
-- GRANT ALL PRIVILEGES ON DATABASE save_db TO save_user;

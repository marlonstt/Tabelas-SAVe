-- Script de configuração do banco de dados SAVe
-- Execute este script como superusuário do PostgreSQL

-- Criar o banco de dados
DROP DATABASE IF EXISTS save_db;
CREATE DATABASE save_db;

-- Conectar ao banco
\c save_db

-- O schema será aplicado a seguir usando o arquivo tables.sql

-- Script para criar tabela SAVe_Agressor
-- Execute este script no banco de dados save_db

CREATE TABLE IF NOT EXISTS "SAVe_Agressor" (
    "ID" SERIAL PRIMARY KEY,
    "ID_Caso" INTEGER NOT NULL,
    "Tipo" VARCHAR(255),
    "Nome" VARCHAR(255),
    "Apelido" VARCHAR(255),
    "Idade" INTEGER,
    "Sexo" VARCHAR(50),
    "Raca" VARCHAR(50),
    "Relacao" VARCHAR(255),
    "Ocupacao" VARCHAR(255),
    "Renda" VARCHAR(100),
    "Escolaridade" VARCHAR(100),
    "Endereco" TEXT,
    "Antecedentes" VARCHAR(255),
    "Uso_Drogas" VARCHAR(255),
    "Porte_Arma" VARCHAR(50),
    CONSTRAINT fk_agressor_caso 
        FOREIGN KEY ("ID_Caso") 
        REFERENCES "SAVe_Geral"("ID_Caso") 
        ON DELETE CASCADE
);

-- Criar índice para melhorar performance de consultas
CREATE INDEX IF NOT EXISTS idx_agressor_id_caso ON "SAVe_Agressor"("ID_Caso");

-- Comentário da tabela
COMMENT ON TABLE "SAVe_Agressor" IS 'Tabela para armazenar informações sobre agressores (relação 1:N com casos)';

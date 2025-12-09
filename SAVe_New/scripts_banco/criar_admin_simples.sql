-- Script SIMPLES para criar usuário admin
-- Execute linha por linha se necessário

-- 1. Cancelar qualquer transação pendente
ROLLBACK;

-- 2. Deletar usuário antigo
DELETE FROM "SAVe_Usuarios" WHERE "email" = 'admin@mpmg.mp.br';

-- 3. Inserir novo usuário
-- Hash para senha: 86076448
INSERT INTO "SAVe_Usuarios" 
("cargo", "usuario", "area", "email", "password", "role", "must_change_password", "created_at")
VALUES 
('Administrador', 'Admin', 'TI', 'admin@mpmg.mp.br', '$2a$10$IiM1c.MjihLpMUEWOjrcLOo!6UxHa5JXDcDvgw9/U5yfrFufCqJD', 'Admin', true, NOW());

-- 4. Verificar
SELECT * FROM "SAVe_Usuarios" WHERE "email" = 'admin@mpmg.mp.br';

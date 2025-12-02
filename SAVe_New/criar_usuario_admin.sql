-- Script para criar um usuário administrador

-- ATENÇÃO: A senha está em hash bcrypt
-- Senha padrão: "admin123"
-- Hash bcrypt: $2a$10$Vn4Oo8cJRdBdlPo!KynFfxvVQ5.qHle6ywUohk/LLKiP

BEGIN;

-- Inserir usuário administrador
INSERT INTO "SAVe_Usuarios" (
    "cargo",
    "usuario", 
    "area",
    "email",
    "password",
    "role",
    "must_change_password",
    "created_at"
) VALUES (
    'Administrador',
    'Admin',
    'TI',
    'admin@mpmg.mp.br',
    '$2a$10$Vn4Oo8cJRdBdlPo!KynFfxvVQ5.qHle6ywUohk/LLKiP',
    'Admin',
    true,
    NOW()
);

-- Verificar se o usuário foi criado
SELECT "id", "email", "usuario", "role", "must_change_password"
FROM "SAVe_Usuarios"
WHERE "email" = 'admin@mpmg.mp.br';

COMMIT;

-- Informações de login
SELECT '✅ Usuário administrador criado com sucesso!' as resultado;
SELECT 'Email: admin@mpmg.mp.br' as login_email;
SELECT 'Senha: admin123' as login_senha;
SELECT '⚠️ IMPORTANTE: Altere a senha após o primeiro login!' as aviso;

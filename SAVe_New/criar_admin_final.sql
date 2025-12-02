-- Script para criar usuário administrador
-- Senha: 86076448

BEGIN;

-- Deletar usuário antigo (se existir)
DELETE FROM "SAVe_Usuarios" WHERE "email" = 'admin@mpmg.mp.br';

-- Inserir novo usuário com hash correto
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
    '$2a$10$vQYl9FyHAcVtXSJIKiEcOeo!yYweD7slLZ3iSEdX0.wPtXsN5zv6',
    'Admin',
    true,
    NOW()
);

-- Verificar se o usuário foi criado
SELECT "id", "email", "usuario", "role"
FROM "SAVe_Usuarios"
WHERE "email" = 'admin@mpmg.mp.br';

COMMIT;

SELECT '✅ Usuário criado com sucesso!' as resultado;
SELECT 'Email: admin@mpmg.mp.br' as login;
SELECT 'Senha: 86076448' as senha;

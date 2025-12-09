-- rename_user_columns.sql
-- Renomeia colunas da tabela save_usuarios para nomes em minúsculas sem aspas.

ALTER TABLE save_usuarios RENAME COLUMN "ID" TO id;
ALTER TABLE save_usuarios RENAME COLUMN "Cargo" TO cargo;
ALTER TABLE save_usuarios RENAME COLUMN "Usuario" TO usuario;
-- email, password, role já estão em minúsculas
ALTER TABLE save_usuarios RENAME COLUMN "mustChangePassword" TO must_change_password;
ALTER TABLE save_usuarios RENAME COLUMN "createdAt" TO created_at;
ALTER TABLE save_usuarios RENAME COLUMN "updatedAt" TO updated_at;

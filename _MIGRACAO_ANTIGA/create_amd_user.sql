-- Create admin user 'amd' (msgsilva.estagio@mpmg.mp.br)
-- Password: 86076448
-- This script assumes the table 'save_usuarios' exists and has lowercase column names.
-- If you haven't renamed tables/columns yet, run rename_tables_lowercase.sql and rename_user_columns.sql first.

-- Ensure columns exist (idempotent)
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255) UNIQUE;
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "password" VARCHAR(255);
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "role" VARCHAR(50) DEFAULT 'User';
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "must_change_password" BOOLEAN DEFAULT true;
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "area" VARCHAR(255);

-- Insert or Update user
INSERT INTO "save_usuarios" ("email", "password", "cargo", "usuario", "role", "must_change_password", "created_at", "updated_at")
VALUES (
  'msgsilva.estagio@mpmg.mp.br',
  '$2b$10$p24QcNsYQi.KrdmX63Am0.RIuD9b0LH3ofrlR74BCE2HKTZdTDDYa', -- 86076448 (Verified)
  'Administrador',
  'Maria Silva',
  'Admin',
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) 
DO UPDATE SET 
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    "cargo" = EXCLUDED."cargo",
    "usuario" = EXCLUDED."usuario",
    "must_change_password" = EXCLUDED."must_change_password",
    "updated_at" = CURRENT_TIMESTAMP;

SELECT 'Admin user (amd) created/updated successfully!' as status;

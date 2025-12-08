-- Create admin user
-- Password: 86076448 (hashed with bcrypt)

-- First, update the table structure (using lowercase names as per Prisma schema)
-- Note: These columns likely already exist if Prisma migration ran
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255) UNIQUE;
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "password" VARCHAR(255);
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "role" VARCHAR(50) DEFAULT 'User';
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "must_change_password" BOOLEAN DEFAULT true;
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Insert admin user
INSERT INTO "save_usuarios" ("email", "password", "cargo", "usuario", "role", "must_change_password", "created_at", "updated_at")
VALUES (
  'msgsilva.estagio@mpmg.mp.br',
  '$2a$10$KaiQxkBMn1LChHxoFAmdlOp874PoS9HEl/QQ4N2yTUldfv3HlzGLK',
  'Administrador',
  'Maria Silva',
  'Admin',
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

SELECT 'Admin user created successfully!' as status;

-- Create admin user
-- Password: 86076448 (hashed with bcrypt)

-- First, update the table structure
ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "email" VARCHAR(255) UNIQUE;
ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "password" VARCHAR(255);
ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "role" VARCHAR(50) DEFAULT 'User';
ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN DEFAULT true;
ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "SAVe_Usuarios" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Insert admin user
INSERT INTO "SAVe_Usuarios" ("email", "password", "Cargo", "Usuario", "role", "mustChangePassword", "createdAt", "updatedAt")
VALUES (
  'msgsilva.estagio@mpmg.mp.br',
  '$2b$10$MFDDYF.xgEEsTdwr1KSQ3e6NO/aoCPyvwqaaanA03u9n7tunFf9QPe',
  'Administrador',
  'Maria Silva',
  'Admin',
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (email) DO NOTHING;

SELECT 'Admin user created successfully!' as status;

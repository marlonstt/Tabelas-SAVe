-- Final script to fix SAVe_Usuarios table and create admin user

-- Add missing columns if they don't exist
DO $$
BEGIN
    -- Add email column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SAVe_Usuarios' AND column_name = 'email') THEN
        ALTER TABLE "SAVe_Usuarios" ADD COLUMN email VARCHAR(255) UNIQUE;
    END IF;
    
    -- Add password column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SAVe_Usuarios' AND column_name = 'password') THEN
        ALTER TABLE "SAVe_Usuarios" ADD COLUMN password VARCHAR(255);
    END IF;
    
    -- Add role column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SAVe_Usuarios' AND column_name = 'role') THEN
        ALTER TABLE "SAVe_Usuarios" ADD COLUMN role VARCHAR(50) DEFAULT 'User';
    END IF;
    
    -- Add mustChangePassword column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SAVe_Usuarios' AND column_name = 'mustChangePassword') THEN
        ALTER TABLE "SAVe_Usuarios" ADD COLUMN "mustChangePassword" BOOLEAN DEFAULT true;
    END IF;
    
    -- Add createdAt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SAVe_Usuarios' AND column_name = 'createdAt') THEN
        ALTER TABLE "SAVe_Usuarios" ADD COLUMN "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    -- Add updatedAt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'SAVe_Usuarios' AND column_name = 'updatedAt') THEN
        ALTER TABLE "SAVe_Usuarios" ADD COLUMN "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END$$;

-- Delete existing admin user if exists
DELETE FROM "SAVe_Usuarios" WHERE email = 'msgsilva.estagio@mpmg.mp.br';

-- Insert admin user with correct password hash
INSERT INTO "SAVe_Usuarios" (email, password, "Cargo", "Usuario", role, "mustChangePassword", "createdAt", "updatedAt")
VALUES (
    'msgsilva.estagio@mpmg.mp.br',
    '$2b$10$fzJjyVIJdX8cGd803RureO3YNj/fZZYlIhkxw42dLNyslJaki.IZMS',
    'Administrador',
    'Maria Silva',
    'Admin',
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Verify the user was created
SELECT 'Admin user created successfully!' as status;
SELECT "ID", email, role, "Cargo", "Usuario" FROM "SAVe_Usuarios" WHERE email = 'msgsilva.estagio@mpmg.mp.br';

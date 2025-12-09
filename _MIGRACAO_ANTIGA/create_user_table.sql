-- Create SAVe_Usuarios table if it doesn't exist
CREATE TABLE IF NOT EXISTS "SAVe_Usuarios" (
    "ID" SERIAL PRIMARY KEY,
    "Cargo" VARCHAR(255),
    "Usuario" VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'User',
    "mustChangePassword" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delete existing admin user if exists
DELETE FROM "SAVe_Usuarios" WHERE email = 'msgsilva.estagio@mpmg.mp.br';

-- Insert admin user
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

-- Verify
SELECT 'User created successfully!' as status;
SELECT "ID", email, role, "Cargo", "Usuario" FROM "SAVe_Usuarios";

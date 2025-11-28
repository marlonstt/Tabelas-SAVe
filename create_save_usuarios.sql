-- Create save_usuarios table
CREATE TABLE IF NOT EXISTS save_usuarios (
    "ID" SERIAL PRIMARY KEY,
    "Cargo" TEXT,
    "Usuario" TEXT,
    "Area" TEXT,
    "Email" TEXT UNIQUE,
    "Password" TEXT,
    "Role" TEXT DEFAULT 'User',
    "MustChangePassword" BOOLEAN DEFAULT true,
    "ProfileImage" TEXT,
    "CreatedAt" TIMESTAMP DEFAULT NOW(),
    "UpdatedAt" TIMESTAMP DEFAULT NOW(),
    "Tema" TEXT
);

-- Insert admin user with correct password hash
DELETE FROM "SAVe_Usuarios" WHERE email = 'msgsilva.estagio@mpmg.mp.br';

INSERT INTO "SAVe_Usuarios" ("email", "password", "Cargo", "Usuario", "role", "mustChangePassword", "createdAt", "updatedAt")
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

SELECT 'Admin user created!' as status, * FROM "SAVe_Usuarios" WHERE email = 'msgsilva.estagio@mpmg.mp.br';

-- insert_admin_user.sql
-- Insert or update admin user with correct bcrypt hash and must_change_password = false
INSERT INTO save_usuarios (email, password, cargo, usuario, role, must_change_password)
VALUES (
    'msgsilva.estagio@mpmg.mp.br',
    '$2b$10$fzJjyVIJdX8cGd803RureO3YNj/fZZYlIhkxw42dLNyslJaki.IZMS',
    'Administrador',
    'Maria Silva',
    'Admin',
    false
)
ON CONFLICT (email) DO UPDATE SET
    password = EXCLUDED.password,
    cargo = EXCLUDED.cargo,
    usuario = EXCLUDED.usuario,
    role = EXCLUDED.role,
    must_change_password = EXCLUDED.must_change_password;

-- Update admin password with a valid bcrypt hash for '86076448'
UPDATE "save_usuarios" 
SET "password" = '$2b$10$p24QcNsYQi.KrdmX63Am0.RIuD9b0LH3ofrlR74BCE2HKTZdTDDYa',
    "updated_at" = CURRENT_TIMESTAMP
WHERE "email" = 'msgsilva.estagio@mpmg.mp.br';

SELECT 'Password updated successfully' as status;

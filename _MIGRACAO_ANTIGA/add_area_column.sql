-- Add area column to save_usuarios table
ALTER TABLE save_usuarios ADD COLUMN IF NOT EXISTS area VARCHAR(255);

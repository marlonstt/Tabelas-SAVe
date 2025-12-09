-- Add missing 'area' column to save_usuarios
ALTER TABLE "save_usuarios" ADD COLUMN IF NOT EXISTS "area" VARCHAR(255);

SELECT 'Column area added successfully' as status;

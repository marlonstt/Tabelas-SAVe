-- Script para renomear tabelas para o padrão SAVe_

-- Renomear save_usuarios para SAVe_Usuarios
ALTER TABLE "save_usuarios" RENAME TO "SAVe_Usuarios";

-- Renomear save_ensino_trab_renda para SAVe_Ensino_Trab_Renda
ALTER TABLE "save_ensino_trab_renda" RENAME TO "SAVe_Ensino_Trab_Renda";

-- Verificar as tabelas renomeadas
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('SAVe_Usuarios', 'SAVe_Ensino_Trab_Renda')
ORDER BY tablename;

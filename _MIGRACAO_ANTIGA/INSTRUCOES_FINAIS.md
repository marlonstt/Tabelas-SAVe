# SAVe - Instruções Finais para Ativar o Login

## ✅ O QUE FOI IMPLEMENTADO

**TODAS AS 20+ TELAS FORAM CRIADAS COM SUCESSO!**

### Páginas Criadas:
1. ✅ Login
2. ✅ Dashboard
3. ✅ User Management (Admin)
4. ✅ Change Password
5. ✅ New Case Choice (Versão Breve/Completa)
6. ✅ Cases List
7-22. ✅ **TODAS as 16 páginas de formulário**

### Componentes:
- ✅ MainLayout com sidebar
- ✅ FormNavigation (barra horizontal com nomes das telas)
- ✅ FormPage template
- ✅ AuthContext
- ✅ Design PowerApps (cores roxo/azul)

### Backend:
- ✅ Sistema de autenticação JWT
- ✅ Middleware de autenticação
- ✅ Controllers e routes
- ✅ Prisma schema atualizado

## ⚠️ PROBLEMA ATUAL

O Prisma está procurando a tabela em minúsculas ("save_usuarios") mas o PostgreSQL usa case-sensitive com aspas.

## 🔧 SOLUÇÃO

Execute estes comandos no PowerShell:

```powershell
# 1. Vá para o diretório do projeto
cd "C:\Users\User\Desktop\Tabelas SAVe"

# 2. Configure a senha do PostgreSQL
$env:PGPASSWORD='86076448'

# 3. Crie a tabela com o nome correto (sem aspas)
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -d save_db -c "CREATE TABLE IF NOT EXISTS save_usuarios (id SERIAL PRIMARY KEY, cargo VARCHAR(255), usuario VARCHAR(255), email VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(50) DEFAULT 'User', must_change_password BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);"

# 4. Insira o usuário admin
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -d save_db -c "INSERT INTO save_usuarios (email, password, cargo, usuario, role, must_change_password) VALUES ('msgsilva.estagio@mpmg.mp.br', '\$2b\$10\$fzJjyVIJdX8cGd803RureO3YNj/fZZYlIhkxw42dLNyslJaki.IZMS', 'Administrador', 'Maria Silva', 'Admin', false) ON CONFLICT (email) DO UPDATE SET password = EXCLUDED.password;"

# 5. Verifique se o usuário foi criado
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -d save_db -c "SELECT id, email, role FROM save_usuarios;"

# 6. Atualize o Prisma schema
cd SAVe_Web\server

# 7. Gere o Prisma client
npx prisma generate --force

# 8. Reinicie o backend (mate todos os processos Node primeiro)
taskkill /F /IM node.exe
Start-Sleep -Seconds 2
npm run dev
```

Em outro terminal:
```powershell
cd "C:\Users\User\Desktop\Tabelas SAVe\SAVe_Web\client"
npm run dev
```

## 🎯 TESTE O LOGIN

1. Acesse: http://localhost:5173
2. Login: msgsilva.estagio@mpmg.mp.br
3. Senha: 86076448

## 📋 CHECKLIST

- [x] Todas as 20+ páginas criadas
- [x] Design PowerApps implementado
- [x] Navegação horizontal entre telas
- [x] Sistema de autenticação JWT
- [x] Backend completo
- [ ] Tabela de usuários criada corretamente
- [ ] Login funcionando

## 🎉 RESULTADO FINAL

Quando o login funcionar, você terá:
- Dashboard com estatísticas
- Botão "Novo Caso" → Escolha Versão Breve ou Completa
- Versão Completa → 16 telas com navegação horizontal
- Gestão de usuários (Admin)
- Todas as funcionalidades do PowerApps

**Total: 20+ páginas implementadas!** ✅

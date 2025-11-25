# Implementação de Versão Breve/Completa - SAVe Web

## ✅ O que foi implementado

### 1. **Configuração de Formulários** (`formSteps.ts`)
- ✅ Interface `FormStep` atualizada
- ✅ Lista de telas da versão breve definida: `breveStepIds`
- ✅ Função `getFormSteps(isBreve)` - retorna telas conforme versão
- ✅ Função `isStepAllowed(stepId, isBreve)` - verifica se tela é permitida

**Telas na Versão Breve:**
1. Dados de Entrada
2. Identificação  
3. Situação Jurídica
4. Proteção e Segurança
5. Vitimização

### 2. **Componente FormNavigation** (atualizado)
- ✅ Botão de alternância entre versões (discreto, acima das abas)
- ✅ Busca tipo de formulário do banco (`Tipo_Form` em `save_geral`)
- ✅ Alterna entre "breve" e "completa" ao clicar
- ✅ Atualiza banco de dados via API
- ✅ Mostra apenas telas permitidas conforme versão
- ✅ Aviso se usuário está em tela não permitida
- ✅ Redirecionamento automático se necessário

### 3. **Componente ProtectedFormPage** (novo)
- ✅ Wrapper para proteger rotas
- ✅ Verifica se tela é permitida na versão atual
- ✅ Mostra tela de "Acesso Restrito" se não permitido
- ✅ Redireciona para "Dados de Entrada" após 2 segundos
- ✅ Loading state enquanto verifica permissões

### 4. **Schema Prisma**
- ✅ Coluna `Tipo_Form` já existe em `save_geral`
- ✅ Valores: "breve" ou "completa"

## ⚠️ O que precisa ser feito

### 1. **Aplicar ProtectedFormPage em TODAS as telas restritas**

As seguintes telas NÃO estão na versão breve e precisam ser protegidas:

```typescript
// Telas que precisam do wrapper ProtectedFormPage:
- Saúde (stepId: "saude")
- Habitação e Território (stepId: "habitacao")
- Assistência (stepId: "assistencia")
- Ensino, Trabalho e Renda (stepId: "ensino")
- Vínculos (stepId: "vinculos")
- Agressor (stepId: "agressor")
- Síntese Analítica (stepId: "sintese")
- Acompanhamento (stepId: "acompanhamento")
- Encerramento (stepId: "encerramento")
```

### 2. **Padrão de Implementação**

Para cada tela restrita, fazer:

```typescript
// 1. Adicionar import
import ProtectedFormPage from '../../components/ProtectedFormPage';

// 2. Remover import de formStepsComplete (não é mais necessário)
// import { formStepsComplete } from '../../config/formSteps'; // REMOVER

// 3. Envolver o return com ProtectedFormPage
export default function NomeDaTela() {
  // ... código existente ...
  
  return (
    <ProtectedFormPage stepId="id-da-tela">
      <MainLayout>
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <FormNavigation caseId={id} /> {/* Remover prop 'steps' */}
          
          {/* ... resto do conteúdo ... */}
        </div>
      </MainLayout>
    </ProtectedFormPage>
  );
}
```

### 3. **Atualizar FormNavigation em TODAS as telas**

Todas as telas (incluindo as da versão breve) precisam atualizar o FormNavigation:

```typescript
// ANTES:
<FormNavigation steps={formStepsComplete} caseId={id} />

// DEPOIS:
<FormNavigation caseId={id} />
```

**Telas que precisam desta atualização:**
- Dados de Entrada
- Identificação
- Situação Jurídica
- Proteção e Segurança
- Vitimização
- (E todas as outras)

### 4. **Inicializar Tipo_Form ao criar novo caso**

Quando um novo caso é criado, definir `Tipo_Form` como "completa" por padrão:

```typescript
// No backend, ao criar caso:
await prisma.sAVe_Geral.create({
  data: {
    // ... outros campos ...
    Tipo_Form: 'completa' // Valor padrão
  }
});
```

## 🎯 Funcionalidades Implementadas

### Botão de Alternância
- **Localização:** Acima da barra de navegação de telas
- **Visual:** Discreto, com ícones (List/FileText)
- **Texto:** 
  - Versão Breve → Completa (quando está em breve)
  - Versão Completa → Breve (quando está em completa)
- **Ação:** Atualiza `Tipo_Form` no banco e recarrega navegação

### Proteção de Rotas
- Usuário não pode acessar telas restritas via URL direta
- Mostra tela de "Acesso Restrito" com aviso
- Redireciona automaticamente para tela permitida

### Navegação Dinâmica
- Barra de navegação mostra apenas telas permitidas
- Telas desabilitadas não aparecem
- Aviso visual se usuário está em tela não permitida

## 📝 Exemplo de Uso

1. **Criar novo caso** → `Tipo_Form` = "completa" (padrão)
2. **Clicar no botão** → Alterna para "breve"
3. **Navegação** → Mostra apenas 5 telas
4. **Tentar acessar /saude** → Bloqueado, redireciona
5. **Clicar no botão novamente** → Volta para "completa"
6. **Navegação** → Mostra todas as 14 telas

## 🔧 Próximos Passos

1. ✅ Restaurar arquivo `Saude.tsx` (ficou corrompido)
2. ⏳ Aplicar `ProtectedFormPage` em todas as telas restritas
3. ⏳ Atualizar `FormNavigation` em todas as telas
4. ⏳ Adicionar `Tipo_Form: 'completa'` ao criar novo caso
5. ⏳ Testar fluxo completo

## 📂 Arquivos Criados/Modificados

- ✅ `client/src/config/formSteps.ts` - Configuração de versões
- ✅ `client/src/components/forms/FormNavigation.tsx` - Navegação com toggle
- ✅ `client/src/components/ProtectedFormPage.tsx` - Proteção de rotas
- ⚠️ `client/src/pages/cases/Saude.tsx` - Exemplo (corrompido, precisa restaurar)

## ⚠️ Problema Atual

O arquivo `Saude.tsx` ficou corrompido durante a edição. Precisa ser restaurado antes de continuar.

**Solução:** Reverter para versão anterior ou reescrever manualmente.

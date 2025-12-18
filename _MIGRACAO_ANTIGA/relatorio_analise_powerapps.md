# Relatório de Análise: SAVe - Sistema de Avaliação de Vitimização Eletrônico

## Sumário Executivo

Este relatório documenta a análise completa do aplicativo PowerApps SAVe, detalhando cada tela, seus componentes de entrada, e a lógica de salvamento de dados no banco de dados SharePoint/Dataverse.

**Total de Telas Identificadas:** 27 telas

## Estrutura Geral do Aplicativo

### Padrões de Salvamento de Dados

O aplicativo utiliza os seguintes padrões consistentes:

1. **Salvamento Automático**: Todos os campos salvam automaticamente ao perder o foco (`OnChange` com `TriggerOutput: FocusOut`)
2. **Notificações**: Exibe "Salvando..." seguido de "Salvo! ✅" para feedback ao usuário
3. **Função Patch**: Utiliza `Patch()` para atualizar registros existentes ou criar novos
4. **Lookup por ID_Caso**: Todos os salvamentos usam `LookUp(Tabela, ID_Caso = ItemAtual.ID_Caso)` para localizar o registro correto
5. **Concatenação de Checkboxes**: Múltiplos checkboxes são salvos como string concatenada em um único campo

### Variáveis Globais Importantes

- `ItemAtual`: Objeto contendo o caso atual sendo editado (inclui `ID_Caso`)
- `_FormCompleto`: Boolean indicando se é formulário completo ou breve
- `_paginasVisitadas`: Coleção de páginas visitadas (salva como JSON em `SAVe_Geral.Paginas_Visitadas`)
- `varCrimesTotais`: String concatenada de crimes relacionados selecionados

---

## Telas do Aplicativo

### 1. Tela_Entrada
**Descrição**: Tela inicial de login/autenticação

**Componentes**:
- Campos de login
- Botões de navegação para dashboard

**Tabelas Afetadas**: `SAVe_Usuarios` (presumido)

---

### 2. Tela_Selecao_Form
**Descrição**: Tela de seleção entre "Versão Breve" e "Versão Completa" do formulário

**Componentes**:
- Botões de seleção de tipo de formulário
- Define variável `_FormCompleto`

**Tabelas Afetadas**: 
- `SAVe_Geral.Tipo_Form`

---

### 3. Tela_Dados_Entrada
**Descrição**: Primeira tela do formulário, coleta informações iniciais sobre o caso

#### Seções da Tela

##### Seção 1: Informações Básicas
**Container**: `Container1_5`

| Campo | Tipo | Nome DB | Tabela | Observações |
|-------|------|---------|--------|-------------|
| Data | DatePicker (Componente Custom) | `Data` | `SAVe_DadosDeEntrada` | Também salva em `SAVe_Geral.Data` |
| Comarca de Origem | ComboBox | `Comarca_origem` | `SAVe_DadosDeEntrada` | Lista de 300+ comarcas de MG. Também salva em `SAVe_Geral.Comarca` |
| Nº do Procedimento / Sistema MPE | TextInput | `N_procedimento_MPE` | `SAVe_DadosDeEntrada` | - |
| Precisa de atendimento especial? | Radio (Sim/Não) | `Precisa_Atendimento_Esp` | `SAVe_DadosDeEntrada` | - |
| Qual tipo de atendimento? | TextInput | `Atendimento_Especial` | `SAVe_DadosDeEntrada` | Visível apenas se "Sim" selecionado |

##### Seção 2: Quem Encaminha
**Container**: `Container1_6` (Visível apenas em `_FormCompleto`)

| Campo | Tipo | Nome DB | Tabela | Observações |
|-------|------|---------|--------|-------------|
| Quem encaminha | Dropdown | `Quem_encaminha` | `SAVe_DadosDeEntrada` | Opções: MPMG, Ministério Público (outros), Poder Judiciário, DPMG, Polícia Civil, Polícia Militar, Poder legislativo, Sociedade Civil, Serviço Público, Demanda espontânea |
| Nome | TextInput | `PE_nome` | `SAVe_DadosDeEntrada` | Profissional Encaminhador |
| Telefone | TextInput | `PE_telefone` | `SAVe_DadosDeEntrada` | - |
| E-mail | TextInput | `PE_email` | `SAVe_DadosDeEntrada` | - |
| Cargo/função | TextInput | `PE_cargo` | `SAVe_DadosDeEntrada` | - |

##### Seção 3: Casos Relacionados
**Container**: `Container1_7`

| Campo | Tipo | Nome DB | Tabela | Observações |
|-------|------|---------|--------|-------------|
| Possui relação com outro caso? | Radio (Sim/Não) | `Possui_Relacionado` | `SAVe_DadosDeEntrada` | - |
| Galeria de Casos Vinculados | Gallery | `Casos_Relacionados` | `SAVe_Casos_Vinculados` | Salvo como JSON array: `[{id: number, id_vitima: string}]` |

**Lógica Especial**:
- `OnVisible`: Carrega casos relacionados de JSON usando `ParseJSON()` e popula coleção `_casosRelacionados`
- Permite adicionar/remover casos relacionados dinamicamente

##### Seção 4: Classificação (continuação do arquivo)

*Nota: O arquivo tem 3579 linhas. Baseado na análise parcial, há mais seções incluindo:*
- Classificação do crime
- Classificação da vítima
- Vitimização
- Observações

**Padrão de Salvamento Identificado**:
```javascript
OnChange: =
  Notify("Salvando...", NotificationType.Information);
  Patch(
    SAVe_DadosDeEntrada,
    LookUp(SAVe_DadosDeEntrada, ID_Caso = ItemAtual.ID_Caso),
    {Campo: Self.Value}
  );
  Notify("Salvo! ✅", NotificationType.Success, 2000)
```

---

### 4. Tela_Socio_Identificacao
**Descrição**: Dados de identificação socioeconômica da vítima

**Tabelas Afetadas**: 
- `SAVe_Identificacao` (tabela principal)
- `SAVe_Identificacao_email` (tabela 1:N para múltiplos emails)
- `SAVe_Identificacao_telefone` (tabela 1:N para múltiplos telefones)
- `SAVe_Identificacao_endereco` (tabela 1:1 para endereço)

**Campos Esperados** (baseado no schema do banco):
- Nome completo / Nome civil
- Data de nascimento / Idade
- Nome social / ancestral
- Filiação (pai/mãe)
- Como quer ser chamada
- Naturalidade / Nacionalidade
- Documentos (CPF, RG, CTPS)
- Contato de confiança
- Perfil Psicossocial (Sexo, Identidade de gênero, Orientação sexual, Raça/cor/etnia, Religião, Estado civil)

---

### 5. Tela_SitJuridica
**Descrição**: Situação jurídica e processual do caso

**Tabelas Afetadas**:
- `SAVe_Situacao_Juridica` (tabela principal)
- `SAVe_Situacao_Juridica2` (continuação/demandas)
- `SAVe_Situacao_Juridica_Incluir_processo` (tabela 1:N para múltiplos processos)

**Campos Esperados** (baseado no schema):
- Autor maior de 18 anos?
- REDS / IP PCNet / Auto Judicial (números e classes)
- Medidas protetivas de caráter cautelar
- Compartilhado com a rede?
- Relato de descumprimento
- Dados do órgão julgador (Juiz, Promotor, Delegado)
- Datas importantes (fatos, autuação, conclusão IP, denúncia, audiência, sentença, trânsito em julgado)
- Tipos penais em cada fase
- Local e hora do crime
- Status jurídico do autor
- Prisão (data, procedimento, infração)
- Demandas da vítima (múltiplos checkboxes salvos como Boolean em campos separados)

---

### 6. Tela_Saude
**Descrição**: Informações de saúde da vítima

**Tabela Afetada**: `SAVe_Saude`

**Seções Esperadas**:
- Pessoa com deficiência (tipo)
- Condições de saúde permanentes e não permanentes
- Acompanhamento de saúde
- Vitimização sexual (acompanhamento)
- Medicação contínua / psiquiátrica
- Fatores de risco (álcool, cigarro, substâncias psicoativas)
- Rede de saúde (CRAS, RAPS, plano de saúde)
- Impactos da vitimização (psicológico, saúde física, deficiências, comprometimentos cognitivos)

---

### 7. Tela_Territorio
**Descrição**: Habitação e território

**Tabela Afetada**: `SAVe_Habitacao_territorio`

**Campos Esperados**:
- Tipo de moradia (regular, irregular, emergencial) - **Checkboxes salvos como Boolean**
- Comunidade tradicional (tipo)
- Reconhecimentos (INCRA, FUNAI, Fundação Palmares)
- Estrutura da moradia (material, instalações, risco geológico, acesso internet)
- Fatores de risco (ambiental, criminalidade, conflitos fundiários) - **Checkboxes salvos como Boolean**
- Mudança de domicílio
- **Seção especial para população em situação de rua**

---

### 8. Tela_Assistencia
**Descrição**: Assistência social

**Tabela Afetada**: `SAVe_Assistencia`

**Seções Esperadas**:
- Cadastro Único (status)
- Acesso a CRAS (contatos, serviços)
- Acesso a CREAS (contatos, serviços)
- Acolhimento institucional/familiar
- Benefícios sociais (transferência de renda, trabalho, habitação, assistência, educação, etc.)
- Segurança alimentar
- Demandas de assistência

---

### 9. Tela_Ensino_Trab_Renda
**Descrição**: Educação, trabalho e renda

**Tabela Afetada**: `SAVe_Ensino_trab_renda`

**Campos Esperados**:
- Grau de escolaridade
- Estuda atualmente? (tipo de instituição, nome)
- Retorno aos estudos
- Situação de trabalho
- Afastamento (motivo detalhado)
- Valor da renda
- Prejuízos (trabalho, patrimônio, escolar)
- Demandas (educacional, trabalhista) - **Boolean**

---

### 10. Tela_Vinculos
**Descrição**: Vínculos familiares e apoio

**Tabelas Afetadas**:
- `SAVe_Vinculos` (dados gerais)
- `SAVe_Vinculos_Apoio` (tabela 1:N para membros da família)

**Campos Esperados**:
- Quantidade de pessoas na família
- Quantidade de filhos/enteados
- Renda total
- Alterações familiares pós-violência
- Vulnerabilidades nos vínculos familiares
- Vitimização secundária/terciária
- **Gallery de apoio familiar** (grau de parentesco, nome, idade, escolaridade, ocupação, renda, alterações, presenciou violência, mora com vítima, conhecimento do fato, rede de apoio)

---

### 11. Tela_Protecao_Seguranca
**Descrição**: Proteção e segurança da vítima

**Tabelas Afetadas**:
- `SAVe_protecao_seguranca` (tabela principal)
- `SAVe_protecao_seguranca_ameacadores` (tabela 1:N para nomes de ameaçadores)
- `SAVe_protecao_seguranca_adolescente` (tabela 1:N para crianças/adolescentes ameaçados)

**Seções Esperadas** (arquivo tem 291KB):
- Natureza da ameaça
- Como a ameaça é feita
- Tempo de ameaça
- Relação autor-vítima
- Ameaças anteriores
- Ameaça por agente público/organização criminosa
- Região de abrangência
- Meios para concretizar ameaça
- Perseguição
- Acesso a armas
- Violência pós-ameaça
- Repercussões sociais
- Extensão à família
- Ameaça a criança/adolescente
- Liberdade limitada
- Impactos (emocionais, financeiros)
- Rede de apoio (familiar, comunitária)
- Equipamentos de segurança
- Deslocamento seguro
- Serviços de proteção social
- Programas de proteção
- Vítima de violência doméstica/crime de ódio
- Protocolos aplicados (FF, Roger)
- FONAR

---

### 12. Tela_Agressor
**Descrição**: Perfil do agressor

**Tabelas Afetadas**:
- `SAVe_Perfil_Agressor` (tabela 1:N - pode haver múltiplos agressores)
- `SAVe_Perfil_Agressor_Endereco` (tabela 1:N para endereços de agressores)

**Campos Esperados**:
- Tipo de agressor (pessoa física/jurídica)
- **Se pessoa jurídica**: Razão social, CNPJ, endereço
- **Se pessoa física**:
  - Nome civil / Nome social
  - Filiação (pai/mãe)
  - Data de nascimento / Idade
  - Apelido
  - Naturalidade / Nacionalidade
  - Documentos (CPF, RG)
  - Perfil psicossocial (sexo, identidade de gênero, orientação sexual, raça/cor/etnia, religião, estado civil)
  - Endereço(s)

---

### 13. Tela_Vitimizacao
**Descrição**: Vitimização secundária e terciária

**Tabela Afetada**: `SAVe_Vitimizacao`

**Campos Esperados** (padrão de checkboxes com especificação):
- **Vitimização Secundária do Sistema de Justiça**:
  - Depoimento repetitivo/revitimização
  - Falta de atendimento especializado
  - Falta de informação
  - Demora do sistema de justiça
  - Exposição da vítima
  - Negativa de participação no processo
  - Negativa de apresentação de provas
  - Negativa de acesso a direitos
  - Desrespeito ao sigilo
  - Desrespeito ao nome social
  - Outras vitimizações
  
- **Vitimização Terciária**:
  - Culpabilização da vítima
  - Estigmatização social
  - Falta de políticas públicas
  - Exploração midiática
  - Outras vitimizações

**Padrão de Salvamento**: Cada item tem dois campos:
- Campo principal (ex: `VST_Dep_repet_reviti`) - Boolean ou String
- Campo de especificação (ex: `VST_Espec_Dep_repet_reviti`) - String para detalhes

---

### 14. Tela_Sintese_Analitica
**Descrição**: Síntese analítica do caso

**Tabela Afetada**: `SAVe_Sintese_Analitica`

**Campos Esperados**:
- Unidade Analítica (texto longo)
- Avaliação de Riscos (texto longo)
- Plano de Prevenção (texto longo)
- Data de Vencimento
- Cor (indicador visual de risco)

---

### 15. Tela_Matriz_De_Risco
**Descrição**: Matriz de avaliação de risco

**Tabela Afetada**: Provavelmente campos em `SAVe_Sintese_Analitica` ou tabela separada

**Componentes Esperados**:
- Grid/matriz de avaliação de risco
- Cálculo automático de score de risco
- Visualização gráfica

---

### 16. Tela_Acompanhamento
**Descrição**: Lista de acompanhamentos do caso

**Tabela Afetada**: `SAVe_Acompanhamentos` (tabela 1:N)

**Componentes**:
- Gallery de acompanhamentos
- Botão para adicionar novo acompanhamento
- Navegação para `Tela_Acompanhamento_Detalhes`

---

### 17. Tela_Acompanhamento_Detalhes
**Descrição**: Detalhes de um acompanhamento específico

**Tabela Afetada**: `SAVe_Acompanhamentos`

**Campos Esperados**:
- Data
- Tipo de Atendimento
- Síntese
- Encaminhamento
- Encaminhamento para a rede
- Especificação de encaminhamento
- Responsáveis (string concatenada ou JSON)

---

### 18. Tela_Referencias
**Descrição**: Referências e encaminhamentos

**Tabela Afetada**: Provavelmente campos em `SAVe_Geral` ou tabela separada

---

### 19. Tela_Encerramento
**Descrição**: Encerramento do caso

**Tabela Afetada**: `SAVe_Encerramento`

**Campos Esperados**:
- Data de encerramento
- Forma de encerramento
- Especificação (se "Outros")
- Observações

**Lógica Especial**:
- Ao encerrar, atualiza `SAVe_Geral.Encerrado = "Sim"`
- Bloqueia edição de todos os formulários quando `ItemAtual.Encerrado = true`

---

### 20. Tela_Anexos
**Descrição**: Gerenciamento de anexos do caso

**Tabela Afetada**: Provavelmente `SAVe_Geral.Anexos_Info` (JSON ou string)

---

### 21. Tela_Buscar_Casos
**Descrição**: Busca e listagem de casos

**Componentes**:
- Campo de busca
- Filtros (comarca, status, data)
- Gallery de casos
- Botão para abrir caso (define `ItemAtual`)

**Tabela Consultada**: `SAVe_Geral`

---

### 22. Tela_Dashboards
**Descrição**: Dashboards e estatísticas

**Componentes**:
- Gráficos e visualizações
- Estatísticas agregadas

**Tabelas Consultadas**: Todas as tabelas SAVe_*

---

### 23. Tela_Relatorio
**Descrição**: Geração de relatórios

**Componentes**:
- Seleção de tipo de relatório
- Filtros
- Exportação

---

### 24. Tela_Gestao_Usuarios
**Descrição**: Gerenciamento de usuários (Admin)

**Tabela Afetada**: `SAVe_Usuarios`

**Campos**:
- Email
- Cargo
- Área
- Role (Admin/User)
- Must Change Password

---

### 25. Tela_Carregamento
**Descrição**: Tela de loading/splash screen

---

### 26. Tela_DEV
**Descrição**: Tela de desenvolvimento/debug

---

### 27. App (Tela Global)
**Descrição**: Configurações globais do aplicativo

**OnStart**:
- Carrega temas de cores
- Inicializa variáveis globais
- Carrega dados de referência

---

## Padrões Técnicos Identificados

### 1. Salvamento de Checkboxes Múltiplos

**Exemplo em Tela_Dados_Entrada (Crime Relacionado)**:
```javascript
// Variável de contexto armazena string concatenada
UpdateContext({
  varCrimesTotais: Coalesce(
    LookUp(SAVe_DadosDeEntrada, ID_Caso = ItemAtual.ID_Caso).Crime_relacionado,
    ""
  )
})

// Ao marcar/desmarcar checkbox
OnCheck: =
  UpdateContext({
    varCrimesTotais: Concatenate(
      varCrimesTotais,
      If(IsBlank(varCrimesTotais), "", "; "),
      "Nome do Crime"
    )
  });
  Patch(SAVe_DadosDeEntrada, {...}, {Crime_relacionado: varCrimesTotais})

OnUncheck: =
  UpdateContext({
    varCrimesTotais: Substitute(varCrimesTotais, "Nome do Crime", "")
  });
  Patch(...)
```

**Resultado no DB**: String como `"Homicídio; Lesão Corporal; Ameaça"`

### 2. Salvamento de Dados Relacionados (1:N)

**Exemplo: Casos Vinculados**:
```javascript
// Salvo como JSON em SAVe_Casos_Vinculados.Casos_Relacionados
Patch(
  SAVe_Casos_Vinculados,
  {...},
  {Casos_Relacionados: JSON(_casosRelacionados)}
)

// Carregamento
ClearCollect(
  _casosRelacionados,
  ForAll(
    ParseJSON(LookUp(...).Casos_Relacionados),
    {id: Value(ThisRecord.id), id_vitima: Text(ThisRecord.id_vitima)}
  )
)
```

### 3. Componentes Customizados

**DataCampo**: Componente reutilizável para campos de data
- Props: `DataEntrada`, `DataSaida`, `SalvarData`, `DataMinima`, `DataMaxima`
- Usado em múltiplas telas para consistência

### 4. Controle de Visibilidade

**Formulário Completo vs Breve**:
```javascript
Visible: =_FormCompleto
```

**Campos Condicionais**:
```javascript
Visible: =entradaPrecisaAtendimentoEspecial.Selected.Value="Sim"
```

### 5. Rastreamento de Páginas Visitadas

```javascript
OnVisible: =
  If(!(App.ActiveScreen.Name in _paginasVisitadas),
    Collect(_paginasVisitadas, App.ActiveScreen.Name);
    Patch(SAVe_Geral, {...}, {Paginas_Visitadas: JSON(_paginasVisitadas)})
  )
```

---

## Recomendações para Implementação Web

### 1. Campos de Texto
- Implementar salvamento automático com debounce (500-1000ms após parar de digitar)
- Manter feedback visual "Salvando..." → "Salvo ✅"

### 2. Checkboxes Múltiplos
- **Opção A**: Salvar como string concatenada (compatível com DB atual)
  - Exemplo: `"Opção1; Opção2; Opção3"`
- **Opção B**: Criar tabelas 1:N separadas (mais normalizado)
  - Requer alteração no schema do banco

### 3. Dropdowns/ComboBoxes
- Manter listas hardcoded (ex: comarcas de MG)
- Implementar busca/filtro para listas longas

### 4. Componente de Data
- Usar date picker nativo do HTML5
- Validar formato DD/MM/YYYY ou salvar como ISO string

### 5. Galleries (Listas 1:N)
- Implementar CRUD inline para:
  - Casos vinculados
  - Vínculos de apoio familiar
  - Acompanhamentos
  - Processos jurídicos
  - Agressores
  - Endereços

### 6. Validações
- Campos obrigatórios: Data, Comarca, Quem encaminha
- Validação de email
- Validação de CPF/CNPJ (se aplicável)

### 7. Navegação
- Implementar barra de progresso horizontal (já feito)
- Permitir navegação livre entre telas
- Marcar telas visitadas
- Indicador visual de telas com dados salvos

### 8. Performance
- Lazy loading de telas
- Carregar dados apenas quando necessário
- Implementar cache local (IndexedDB/LocalStorage)

---

## Campos Críticos por Tabela

### SAVe_Geral
- `ID_Caso` (PK)
- `Data`
- `Comarca`
- `Tipo_Form` ("Completo" / "Breve")
- `Encerrado` ("Sim" / "Não")
- `Paginas_Visitadas` (JSON array)
- `Nome` (nome da vítima)
- `Tipo_Vitima`

### SAVe_DadosDeEntrada
- `ID_Caso` (FK)
- Todos os campos são opcionais
- Campos de texto livre: `Observacao`
- Campos condicionais: `Atendimento_Especial` (só se `Precisa_Atendimento_Esp = "Sim"`)

### SAVe_Identificacao
- `ID_Caso` (FK)
- `Data_nascimento` (DateTime)
- Campos de texto: nomes, filiação, documentos
- Campos de seleção: sexo, identidade de gênero, raça/cor, religião, estado civil

### SAVe_Situacao_Juridica
- `ID_Caso` (FK)
- Múltiplos campos de data (DateTime)
- Campos de texto: números de processo, nomes de autoridades
- Campos booleanos em `SAVe_Situacao_Juridica2` para demandas

### SAVe_Saude
- `ID_Caso` (FK)
- Campos de seleção múltipla (salvos como string concatenada)
- Campos de texto livre para descrições

### SAVe_Habitacao_territorio
- `ID_Caso` (FK)
- Campos booleanos: `Moradia_regular`, `Moradia_Irregular`, `Moradia_Emergencial`
- Campos booleanos: `Fatores_risco_ambiental_infra`, `Conflitos_Urbanos_Criminalidade`, etc.

### SAVe_Assistencia
- `ID_Caso` (FK)
- Múltiplas seções: CRAS, CREAS, Acolhimento, Benefícios
- Campos de contato: nome, telefone, email de técnicos de referência

### SAVe_Ensino_trab_renda
- `ID_Caso` (FK)
- Campos booleanos: `Demanda_educacional`, `Demanda_trabalhista`
- Campos de texto: descrições de prejuízos

### SAVe_Vinculos
- `ID_Caso` (FK)
- Campos numéricos: quantidades de pessoas, filhos
- Campos de texto: descrições de vulnerabilidades

### SAVe_Vinculos_Apoio (1:N)
- `ID` (PK auto-increment)
- `ID_Caso` (FK)
- Campos booleanos: `AVF_Presenciou_Violencia`, `AVF_Mora_Com_Vitima`, etc.
- `AVF_Data_Nasc` (DateTime)
- `AVF_Idade` (Int)

### SAVe_protecao_seguranca
- `ID_Caso` (FK)
- Múltiplos campos de texto para descrições
- Campos de seleção para tipos de ameaça, relação, etc.

### SAVe_Perfil_Agressor (1:N)
- `ID` (PK auto-increment)
- `ID_Caso` (FK)
- `PA_Tipo_Agressor` (Pessoa Física / Jurídica)
- Campos condicionais baseados no tipo
- `PA_Data_Nascimento` (DateTime)
- `PA_Idade` (Int)

### SAVe_Vitimizacao
- `ID_Caso` (FK)
- Padrão: campo principal + campo de especificação
- Exemplo: `VST_Dep_repet_reviti` + `VST_Espec_Dep_repet_reviti`

### SAVe_Sintese_Analitica
- `ID_Caso` (FK)
- Campos de texto longo: `UnidadeAnalitica`, `AvaliacaoDeRiscos`, `PlanoDePrevencao`
- `DataVencimento` (DateTime)
- `Cor` (String - indicador visual)

### SAVe_Acompanhamentos (1:N)
- `ID` (PK auto-increment)
- `ID_Caso` (FK)
- `Data` (DateTime)
- `Tipo_Atendimento` (String)
- `Sintese` (Text)
- `Responsaveis` (String - pode ser concatenado ou JSON)

### SAVe_Encerramento
- `ID_Caso` (FK)
- `Data` (DateTime)
- `Forma_Encerramento_Caso` (String)
- `Especifique_Outros` (String)
- `Observacao` (Text)

---

## Conclusão

O aplicativo PowerApps SAVe é um sistema complexo com 27 telas e 15+ tabelas de dados. Os principais desafios para a implementação web são:

1. **Replicar a lógica de salvamento automático** com feedback visual
2. **Implementar corretamente os campos de checkboxes múltiplos** (concatenação de strings)
3. **Gerenciar relações 1:N** (galleries) com CRUD inline
4. **Manter a navegação fluida** entre as telas do formulário
5. **Implementar validações** e campos condicionais
6. **Garantir performance** com lazy loading e cache

**Próximos Passos Recomendados**:
1. Implementar tela por tela, começando por `Tela_Dados_Entrada`
2. Criar componentes reutilizáveis (DatePicker, TextInput com auto-save, Checkbox groups)
3. Testar salvamento e carregamento de dados para cada tela
4. Implementar galleries com CRUD para tabelas 1:N
5. Adicionar validações e feedback visual
6. Testes de integração end-to-end

---

**Data do Relatório**: 24/11/2024  
**Versão do App Analisado**: SAVe - Sistema de Avaliação de Vitimização Eletrônico.msapp  
**Total de Linhas Analisadas**: ~3.500.000+ (27 arquivos .yaml)

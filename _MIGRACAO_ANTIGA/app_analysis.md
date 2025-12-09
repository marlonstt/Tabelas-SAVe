# Análise do App Legacy (Power Apps) e Documentação

## Visão Geral
O aplicativo atual é uma solução Power Apps (`.msapp`) utilizada para o registro e acompanhamento de casos de vítimas de crimes. Ele utiliza Listas do SharePoint como backend de dados. O objetivo é migrar esta aplicação para uma solução web moderna hospedada em VM, utilizando PostgreSQL como banco de dados para evitar custos de licenciamento Premium do Power Apps.

## Estrutura de Dados
A análise do arquivo `.msapp` e a correlação com o script SQL existente confirmam a existência das seguintes entidades principais (tabelas):

### Tabelas Principais (1:1 com o Caso)
Estas tabelas armazenam informações únicas para cada caso registrado. A chave primária é `ID_Caso`.
- **SAVe_Geral**: Informações básicas do caso (Processo, Tipo Vítima, Comarca, etc).
- **SAVe_DadosDeEntrada**: Dados iniciais de encaminhamento e classificação.
- **SAVe_Identificacao**: Dados pessoais da vítima.
- **SAVe_Identificacao_endereco**: Endereço da vítima.
- **SAVe_Situacao_Juridica**: Detalhes processuais e jurídicos.
- **SAVe_Situacao_Juridica2**: Continuação dos dados jurídicos (demandas, reparações).
- **SAVe_Saude**: Informações de saúde e vulnerabilidades.
- **SAVe_Habitacao_territorio**: Dados de moradia e território.
- **SAVe_Assistencia**: Acesso a serviços de assistência social.
- **SAVe_Ensino-trab-renda**: Escolaridade e situação de trabalho.
- **SAVe_Vitimizacao**: Detalhes sobre a vitimização e violações.
- **SAVe_protecao_seguranca**: Avaliação de riscos e ameaças.
- **SAVe_Sintese_Analitica**: Resumo analítico e gestão de riscos.
- **SAVe_Encerramento**: Dados de fechamento do caso.
- **SAVe_Vinculos**: Informações agregadas sobre vínculos familiares.

### Tabelas Relacionadas (1:N com o Caso)
Estas tabelas armazenam listas de itens associados a um caso. A chave estrangeira é `ID_Caso`.
- **SAVe_Acompanhamentos**: Histórico de atendimentos e encaminhamentos.
- **SAVe_Responsaveis**: Responsáveis pelo caso.
- **SAVe_Casos_Vinculados**: Outros casos relacionados.
- **SAVe_Vinculos_Apoio**: Detalhes de familiares e rede de apoio.
- **SAVe_Perfil_Agressor**: Dados dos agressores (pode haver múltiplos).
- **SAVe_Perfil_Agressor_Endereco**: Endereços dos agressores.
- **SAVe_Identificacao_telefone**: Telefones da vítima.
- **SAVe_Identificacao_email**: Emails da vítima.
- **SAVe_protecao_seguranca_ameacadores**: Lista de ameaçadores.
- **SAVe_protecao_seguranca_adolescente**: Adolescentes envolvidos.
- **SAVe_Situacao_Juridica_Incluir_processo**: Outros processos jurídicos.

### Tabelas de Sistema
- **SAVe_Usuarios**: Controle de usuários e cargos.
- **SAVe_Logs_Acesso**: Logs de auditoria.

## Funcionalidades Identificadas
1.  **Cadastro de Casos**: Formulários extensos divididos em seções (Identificação, Jurídico, Saúde, Social, etc).
2.  **Gestão de Relacionamentos**: Adição dinâmica de telefones, endereços, agressores e familiares.
3.  **Acompanhamento**: Registro cronológico de atendimentos e evoluções do caso.
4.  **Segurança e Acesso**: Controle de acesso baseado em usuários (tabela `SAVe_Usuarios`).
5.  **Relatórios/Síntese**: Visualização consolidada dos dados do caso.

## Recomendação de Migração
Para substituir o Power Apps e manter a compatibilidade com PostgreSQL sem custos de licença Premium, recomenda-se:

**Stack Tecnológico:**
-   **Frontend**: React com TypeScript. Framework: **Vite** (leve e rápido) ou **Next.js** (se precisar de SSR, mas Vite é suficiente para SPA).
-   **UI Library**: **Tailwind CSS** com componentes **Shadcn/ui** ou **Material UI** para agilidade e visual profissional.
-   **Backend**: **Node.js** com **Express**.
-   **Banco de Dados**: **PostgreSQL** (já definido).
-   **ORM**: **Prisma** (excelente tipagem e facilidade com TypeScript).

**Arquitetura:**
-   Aplicação Web SPA (Single Page Application) hospedada na VM (Nginx servindo o frontend, PM2 gerenciando o backend Node.js).
-   API RESTful para comunicação entre frontend e banco de dados.

Esta abordagem oferece performance superior ao Power Apps, total controle sobre o código e zero custo de licenciamento de software (Open Source).

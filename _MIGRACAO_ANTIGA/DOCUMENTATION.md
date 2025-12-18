# Documentação da Aplicação SAVe

## Visão Geral

O SAVe (Sistema de Apoio a Vítimas) é uma aplicação web desenvolvida para gerenciar casos de apoio a vítimas. A aplicação é composta por um frontend moderno e interativo e um backend robusto para gerenciamento de dados.

## Tecnologias Utilizadas

### Frontend (Client)

O frontend é construído utilizando **React** com **TypeScript** e **Vite** como bundler.

*   **Linguagem:** TypeScript
*   **Framework:** React 19
*   **Build Tool:** Vite 7
*   **Estilização:** Tailwind CSS 3
*   **Roteamento:** React Router DOM 7
*   **Gerenciamento de Formulários:** React Hook Form com Zod para validação
*   **Requisições HTTP:** Axios
*   **Componentes UI:** Radix UI (Slots), Lucide React (Ícones)
*   **Linting:** ESLint

### Backend (Server)

O backend é uma API RESTful construída com **Node.js** e **Express**.

*   **Linguagem:** TypeScript
*   **Runtime:** Node.js
*   **Framework Web:** Express 4
*   **ORM (Object-Relational Mapping):** Prisma 5
*   **Banco de Dados:** PostgreSQL (definido no schema do Prisma)
*   **Autenticação:** JSON Web Tokens (JWT) e BcryptJS para hash de senhas
*   **Gerenciamento de Ambiente:** Dotenv
*   **CORS:** Cors
*   **Ferramentas de Desenvolvimento:** Nodemon, ts-node

### Banco de Dados

O banco de dados utilizado é o **PostgreSQL**, gerenciado através do **Prisma ORM**. O esquema do banco de dados inclui tabelas para:

*   **Casos (SAVe_Geral):** Informações principais dos casos.
*   **Dados de Entrada (SAVe_DadosDeEntrada):** Detalhes iniciais do caso.
*   **Identificação (SAVe_Identificacao):** Dados pessoais da vítima.
*   **Contatos (SAVe_Identificacao_telefone, SAVe_Identificacao_email, SAVe_Identificacao_endereco):** Informações de contato (relação 1:N).
*   **Situação Jurídica (SAVe_Situacao_Juridica, SAVe_Situacao_Juridica2, SAVe_Situacao_Juridica_Incluir_processo):** Detalhes legais e processuais.
*   **Saúde (SAVe_Saude):** Informações de saúde da vítima.
*   **Habitação e Território (SAVe_Habitacao_territorio):** Dados sobre moradia e contexto territorial.
*   **Assistência (SAVe_Assistencia):** Acesso a serviços de assistência social.
*   **Ensino, Trabalho e Renda (SAVe_Ensino_trab_renda):** Situação socioeconômica.
*   **Vínculos (SAVe_Vinculos, SAVe_Vinculos_Apoio):** Relações familiares e de apoio.
*   **Proteção e Segurança (SAVe_protecao_seguranca, SAVe_protecao_seguranca_ameacadores, SAVe_protecao_seguranca_adolescente):** Avaliação de riscos e medidas de proteção.
*   **Agressor (SAVe_Perfil_Agressor, SAVe_Perfil_Agressor_Endereco):** Perfil do(s) agressor(es).
*   **Vitimização (SAVe_Vitimizacao):** Histórico e impacto da violência.
*   **Acompanhamentos (SAVe_Acompanhamentos):** Registro de atendimentos e encaminhamentos.
*   **Encerramento (SAVe_Encerramento):** Dados sobre o fechamento do caso.
*   **Usuários (SAVe_Usuarios):** Gestão de acesso ao sistema.
*   **Logs (SAVe_Logs_Acesso):** Registro de atividades.
*   **Síntese Analítica (SAVe_Sintese_Analitica):** Resumo e avaliação do caso.

## Estrutura do Projeto

*   `/client`: Código fonte do frontend.
*   `/server`: Código fonte do backend.
*   `/server/prisma`: Definição do esquema do banco de dados e migrações.
*   `docker-compose.yml`: Configuração para orquestração de containers (provavelmente para o banco de dados e/ou aplicação).

## Como Executar

1.  **Backend:**
    *   Navegue até a pasta `server`.
    *   Instale as dependências: `npm install`
    *   Configure as variáveis de ambiente no arquivo `.env`.
    *   Execute as migrações do Prisma: `npx prisma migrate dev` (ou `npx prisma db push`)
    *   Inicie o servidor: `npm run dev`

2.  **Frontend:**
    *   Navegue até a pasta `client`.
    *   Instale as dependências: `npm install`
    *   Inicie o servidor de desenvolvimento: `npm run dev`

A aplicação frontend estará acessível (geralmente) em `http://localhost:5173` e o backend em `http://localhost:3001` (ou portas configuradas).

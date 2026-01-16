# Guia de Implantação e Tecnologias - SAVe

Este documento descreve as tecnologias utilizadas no sistema SAVe e o procedimento para implantar a aplicação em um servidor utilizando Docker.

## Tecnologias Utilizadas

### Frontend (Interface)
*   **Linguagem**: TypeScript / JavaScript
*   **Framework**: Svelte (com Vite)
*   **Estilização**: Tailwind CSS
*   **Comunicação**: Axios (para requisições HTTP)

### Backend (API)
*   **Linguagem**: Go (Golang) versão 1.21+
*   **Banco de Dados**: PostgreSQL 15
*   **ORM**: GORM (para interação com o banco)
*   **Autenticação**: JWT (JSON Web Tokens)

### Infraestrutura
*   **Containerização**: Docker & Docker Compose

---

## Como Hospedar no Servidor (Via Docker)

A aplicação foi preparada para ser totalmente portátil. Siga os passos abaixo para colocar o sistema no ar em qualquer servidor (Linux/Windows) que tenha o Docker instalado.

### Pré-requisitos
*   Ter o **Docker** e o **Docker Compose** instalados no servidor.

### Passo a Passo

1.  **Transferir Arquivos**
    Copie a pasta do projeto (`SAVe_New`) para o servidor. Você pode fazer isso via Git (clonando o repositório) ou enviando os arquivos via SCP/FTP.
    *Certifique-se de que o arquivo `tables.sql` (que está na pasta pai) também esteja acessível ou copie-o para dentro de `SAVe_New` e ajuste o `docker-compose.yml` se necessário.*

3.  **Configurar Variáveis de Ambiente (Opcional)**
    O arquivo `docker-compose.yml` requer a configuração correta para conectar ao banco de dados externo.
    
    > **Importante:** Como o banco de dados roda fora do Docker, você DEVE configurar o `DB_HOST` com o IP do servidor de banco.

    Crie ou edite o arquivo `.env` com:
    *   `DB_HOST=IP_DO_BANCO`
    *   `DB_USER=postgres`
    *   `DB_PASSWORD=SUA_SENHA`
    *   `JWT_SECRET=CHAVE_SECRETA_NOVA`

4.  **Iniciar a Aplicação**
    Abra o terminal na pasta do projeto (`SAVe_New`) e execute:

    ```bash
    docker compose up -d --build
    ```
    *Nota: Se o comando `docker compose` não for reconhecido, tente `docker-compose up -d --build` (com hífen).*

    *   `up`: Sobe os containers.
    *   `-d`: Modo "detached" (roda em segundo plano, liberando o terminal).
    *   `--build`: Força a reconstrução das imagens para garantir que as últimas alterações de código sejam aplicadas.

4.  **Verificar Status**
    Para ver se tudo está rodando:

    ```bash
    docker compose ps
    ```

    Para ver os logs (caso algo dê errado):

    ```bash
    docker-compose logs -f
    ```

5.  **Acessar o Sistema**
    *   **Frontend**: Acesse `http://SEU_IP_DO_SERVIDOR:3000`
    *   **Backend (API)**: Estará rodando em `http://SEU_IP_DO_SERVIDOR:8080`

### Manutenção

*   **Parar o sistema**: `docker-compose down`
*   **Atualizar a aplicação**:
    1.  Baixe o código novo (`git pull` ou copie os arquivos).
    2.  Rode `docker-compose up -d --build`.

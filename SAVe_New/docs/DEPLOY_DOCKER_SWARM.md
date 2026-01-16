# Deploy SAVe no Docker Swarm

## Pré-requisitos
- Servidor com Docker instalado e Swarm inicializado
- Acesso SSH ao servidor
- Conta no Docker Hub (msgsilva)

---

## Passo 1: Conectar ao Servidor
```bash
ssh usuario@IP_DO_SERVIDOR
```

---

## Passo 2: Inicializar Docker Swarm (se ainda não estiver)
```bash
docker swarm init
```

---

## Passo 3: Criar os Arquivos de Configuração

### 3.1 Criar pasta do projeto
```bash
mkdir -p /opt/save
cd /opt/save
```

### 3.2 Criar arquivo .env
```bash
nano .env
```
Conteúdo:
```
# Configuração do Banco de Dados Externo
# DB_HOST deve ser o IP do servidor onde o PostgreSQL está rodando
DB_HOST=192.168.X.X
DB_USER=postgres
DB_PASSWORD=SUA_SENHA_SEGURA
DB_NAME=save_db
DB_PORT=5432

# Configuração da Aplicação
JWT_SECRET=CHAVE_SECRETA_LONGA_E_ALEATORIA
DOCKER_USERNAME=msgsilva
```

### 3.3 Criar arquivo docker-compose.yml
```bash
nano docker-compose.yml
```
Conteúdo:
```yaml
version: '3.8'

services:
  backend:
    image: msgsilva/save-backend:latest
    ports:
      - "8080:8080"
    environment:
      - DB_HOST=${DB_HOST}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - DB_PORT=${DB_PORT}
      - JWT_SECRET=${JWT_SECRET}
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
    networks:
      - save-network

  frontend:
    image: msgsilva/save-frontend:latest
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
    depends_on:
      - backend
    networks:
      - save-network

networks:
  save-network:
    driver: overlay
```

---

## Passo 4: Fazer Deploy da Stack
```bash
docker stack deploy -c docker-compose.yml save
```

---

## Passo 5: Verificar Status
```bash
# Ver todos os serviços
docker stack services save

# Ver containers rodando
docker ps

# Ver logs do backend
docker service logs save_backend

# Ver logs do frontend
docker service logs save_frontend
```

---

## Passo 6: Inicializar o Banco de Dados
> **Nota:** Como o banco de dados está em um servidor separado (não Docker), você deve executar o script de criação de tabelas diretamente nesse servidor.

1.  Conecte-se ao servidor do banco de dados (ou use uma ferramenta como pgAdmin/DBeaver).
2.  Execute o conteúdo do arquivo `tables.sql` no banco de dados `save_db`.

Exemplo via linha de comando (se tiver acesso psql):
```bash
psql -h IP_DO_BANCO -U postgres -d save_db -f tables.sql
```

---

## Acessar a Aplicação
- **Frontend:** http://IP_DO_SERVIDOR:3000
- **Backend API:** http://IP_DO_SERVIDOR:8080

---

## Comandos Úteis

| Ação | Comando |
|------|---------|
| Parar stack | `docker stack rm save` |
| Reiniciar | `docker stack deploy -c docker-compose.yml save` |
| Atualizar imagens | `docker service update --force save_backend` |
| Ver logs | `docker service logs -f save_backend` |

---

## Atualizar para Nova Versão
Quando você fizer push no GitHub e as imagens forem atualizadas:
```bash
docker service update --image msgsilva/save-backend:latest save_backend
docker service update --image msgsilva/save-frontend:latest save_frontend
```

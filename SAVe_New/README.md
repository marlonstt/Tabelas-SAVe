# SAVe System (Go + Svelte)

This is the rewritten SAVe application using Golang for the backend and Svelte for the frontend.

## Prerequisites

- Docker and Docker Compose

## How to Run

1. Navigate to this directory:
   ```bash
   cd SAVe_New
   ```

2. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## Structure

- `backend/`: Go application (Gin + GORM).
- `frontend/`: Svelte application (Vite).
- `docker-compose.yml`: Orchestration.

## Database

The database is initialized with `tables.sql` from the parent directory.

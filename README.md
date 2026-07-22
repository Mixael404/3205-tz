# 3205 — Test Assignment

## Run with Docker (Linux / macOS / WSL)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Swagger (для тестирования API): http://localhost:3000/docs

---

## Run without Docker (Windows)

### Backend

```cmd
cd backend
yarn install --frozenlock
yarn start:dev
```

### Frontend

```cmd
cd frontend
yarn install --frozenlock
yarn dev
```

---

## Environment variables

### Backend — `backend/.env`

```env
PORT=3000
HOST="http://localhost:3000"
```

### Frontend — `frontend/.env`

```env
VITE_API_URL="http://localhost:3000/api"
```

---

**PS:** В задании указано, что допускается одновременная обработка нескольких job. Количество параллельных заданий задаётся в `JobProcessor` через переменную `JOB_CONCURRENCY`. 

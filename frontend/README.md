# Frontend UI (React + Vite)

## Installation
Depuis `frontend`:

```bash
npm install
```

## Lancer en dev (avec proxy API)
Depuis `frontend`:

```bash
npm run dev
```

- UI: `http://127.0.0.1:5173`
- Proxy Vite: `/api/*` -> `http://127.0.0.1:8080/api/*`

## Backend Spring
Depuis `back`:

```bash
./mvnw spring-boot:run
```

## Routes API utilisées par le front
- `GET /api/clients?size=200`
- `POST /api/clients`
- `DELETE /api/clients/{id}`
- `GET /api/techniciens?size=200`
- `POST /api/techniciens`
- `DELETE /api/techniciens/{id}`
- `GET /api/chantiers?size=200`
- `POST /api/chantiers`
- `POST /api/chantiers/{id}/cloturer`
- `DELETE /api/chantiers/{id}`

## Note
Laisse `API base` vide pour utiliser le proxy Vite (`/api`).
Si tu utilises un backend distant, renseigne par exemple `http://localhost:8080`.
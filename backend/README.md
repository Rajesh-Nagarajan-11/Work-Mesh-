# Work Mesh Backend (Node.js + MongoDB)

This is a minimal Express + MongoDB (Mongoose) backend aligned to the frontend API client.

## Frontend API expectations

- Frontend base URL defaults to `http://localhost:5000/api` (`VITE_API_BASE_URL`)
- Most endpoints should return:

```json
{ "success": true, "data": { ... }, "message": "..." }
```

- Refresh endpoint is used by an axios interceptor and expects a top-level `token`:
  - `POST /api/auth/refresh` returns `{ token, data: { token }, success: true }`

## Setup

1) Start MongoDB (docker):

```bash
cd backend
docker compose up -d
```

2) Configure env:

```bash
cd backend
cp .env.example .env
```

3) Install + run:

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

## Mail (Send form to client)

- **No SMTP set** (default): Uses Ethereal test account. Emails are not delivered to real inboxes; the form URL is still returned and copied to clipboard so you can share it manually.
- **Real SMTP**: In `.env` set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (and optionally `SMTP_FROM`). Example for Gmail: use an [App Password](https://support.google.com/accounts/answer/185833), not your normal password.

## Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`


# Wall Openings - Frontend

A real-time collaborative wall-opening editor. Users create a named wall, place rectangular or circular openings on it, and share a link - anyone with the link joins the same session and sees changes live.

The app also works "offline" - if the backend is unreachable, users can still create and edit openings locally. Changes just won't be saved or synced to other clients.

> **Backend repo:** [_Click here_](https://github.com/akivabuckman/wall-openings-be)

---

## Architecture Overview

```
Browser (React + Konva)
        │
        │  WebSocket (Socket.IO)  /  HTTP
        ▼
    Nginx (reverse proxy)
        │
        ├──▶  Frontend container  (this repo, served by `serve` on :5175)
        │
        └──▶  Backend container   (Express + Socket.IO)
                    │
                    ├──▶ PostgreSQL on AWS RDS       (walls & openings)
                    │
                    └──▶ Redis on AWS ElastiCache    (undo stacks & event streams)  [disabled — see note below]

AWS Lambda  ──▶  DELETE /old-walls  (scheduled cleanup - removes walls not updated in 7+ days)
```

Everything runs on a single **AWS EC2** instance (ap-southeast-1). **Nginx** handles TLS termination and proxies traffic to the two containers on a shared Docker network. A scheduled **AWS Lambda function** calls the backend's `/old-walls` endpoint to purge stale data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Canvas rendering | [Konva](https://konvajs.org) / [react-konva](https://konvajs.org/docs/react/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Real-time comms | [Socket.IO client](https://socket.io) |
| Build tool | [Vite](https://vitejs.dev) |
| Container | [Docker](https://www.docker.com) (multi-stage build, served with [`serve`](https://github.com/vercel/serve)) |
| CI/CD | GitHub Actions → AWS ECR → AWS EC2 |

---

## Socket Events

### Emitted by the client

| Event | Payload | Description |
|---|---|---|
| `wallJoin` | `{ wallId: string \| null }` | Join or create a wall. Pass `null` to create a new one. |
| `openingChange` | `{ opening: Opening }` | Create or update an opening. |
| `deleteOpening` | `{ wallId: string, openingId: string }` | Delete an opening. |
| `requestNewOpening` | `{ wallId: string }` | Ask the server to create a new default opening. |

### Received by the client

| Event | Description |
|---|---|
| `joinedWall` | Confirms wall join; payload includes `wallId` and current openings. |
| `openingChange` | Broadcast of an opening change from another client. |
| `deleteOpening` | Broadcast of a deletion from another client. |
| `error` | Server-side error (e.g. rate limit exceeded). |

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Docker](https://www.docker.com) (optional, for container-based local dev)

### Installation

```bash
git clone https://github.com/akivabuckman/wall-openings.git
cd wall-openings
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_SOCKET_URL=http://localhost:3000   # URL of the backend server
VITE_MODE=development                   # "development" | "production"
```

### Run locally

```bash
npm run dev
```

App will be available at [http://localhost:5173](http://localhost:5173).

### Run with Docker

```bash
docker compose up --build
```

App will be available at [http://localhost:5175](http://localhost:5175).

---

## Deployment

Deployments are triggered automatically when a PR is **merged into `main`**.

The pipeline ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)):

1. Runs `npm audit` (fails on high/critical vulnerabilities)
2. Builds a Docker image tagged with the short Git SHA
3. Pushes the image to **AWS ECR**
4. SSHs into the **EC2** instance, pulls the new image, and restarts the container

### Required GitHub Secrets / Variables

| Name | Type | Description |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | Secret | AWS credentials |
| `AWS_SECRET_ACCESS_KEY` | Secret | AWS credentials |
| `EC2_HOST` | Secret | EC2 public IP or hostname |
| `EC2_SSH_KEY` | Secret | Private SSH key for EC2 |
| `ECR_REGISTRY` | Variable | ECR registry URL |

---

## Undo & Event Replay *(disabled)*

The backend supports a **per-wall undo stack** and **Socket.IO event replay** backed by **AWS ElastiCache (Redis)**. Each wall maintains a Redis Stream of broadcast events (for reconnect replay) and a Redis List acting as an undo stack of up to 20 reversible operations. When a client triggers an undo, the server pops the latest snapshot and restores the opening to its previous state.

This feature is currently **disabled in production** — the ElastiCache instance was deprovisioned to avoid ongoing costs on a personal project. The implementation remains in the backend codebase and can be re-enabled by setting the `REDIS_URL` environment variable. The backend degrades gracefully when Redis is unavailable: all Redis-dependent paths are no-ops, so the core app continues to function normally.

---

## Project Structure

```
src/
├── components/       # React UI components
│   ├── WallEditor    # Root editor component (canvas + sidebar)
│   ├── Sidebar       # Wall ID, save status, openings list
│   ├── AerialView    # Top-down canvas view
│   ├── CrossSectionView # Cross-section canvas view
│   └── ...
├── socketHandlers/   # Client-side handlers for incoming socket events
├── utils/
│   ├── socket.ts     # Socket singleton + emit helpers
│   ├── socketManager.ts
│   └── renderUtils   # Konva rendering utilities
├── types.ts          # Shared TypeScript types (Opening, SaveStatus, …)
└── constants.ts      # App-wide constants and config
```

---


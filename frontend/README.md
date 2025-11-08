# Frontend — Casa De Luna

This is the React frontend for the Casa De Luna restaurant demo. It was created with Create React App and is intended to run alongside the `backend/` service (API on port 5000 by default).

Quick start

1. Install dependencies

```powershell
cd frontend
npm install
```

2. Run the development server

```powershell
npm start
```

3. Build for production

````powershell
# Casa De Luna — Frontend

A clean, responsive React frontend for the Casa De Luna restaurant demo. The app provides a public menu, chef pages, reservation form, newsletter subscription, user profiles and a simple admin surface for managing dish availability. It runs alongside the `backend/` service.

## Tech stack

- React (Create React App)
- React Router
- Redux Toolkit
- Material UI (MUI) + icons
- Emotion (styled components)
- Lucide icons

## Quick setup

### Prerequisites

- Node.js (16+) and npm

### Install

```powershell
cd frontend
npm install
````

### Run (development)

```powershell
npm start
```

### Build (production)

```powershell
npm run build
```

## Environment variables

- The frontend uses Create React App env vars. Define variables with the `REACT_APP_` prefix.
- Important variable:
  - `REACT_APP_API_URL` — Base URL for backend API (default: `http://localhost:5000`).
- Example: copy `frontend/.env.example` to `.env.local` and adjust values. Do NOT commit real secrets.

## Deployment

- Build the app with `npm run build` and serve the `build/` output from any static host.
- Deployment details / hosted link: will be added soon.

## Notes & best practices

- Do not commit `.env` files or other secrets. The frontend `.gitignore` excludes env files and `build/`.
- After changing `REACT_APP_API_URL`, restart the dev server or rebuild the production bundle.
- See inline comments in `src/` for component-level details.

If you want, I can add a matching `backend/README.md`, example curl requests for main APIs, or centralize the API base URL into a small helper module.

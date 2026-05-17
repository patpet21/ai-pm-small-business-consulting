# Practical AI Systems Landing Page

A one-page React + TypeScript + Vite landing page for Practical AI Systems, an AI + Project Management consulting service for small businesses.

## Scripts

- `npm run dev` starts the local Vite development server.
- `npm run build` type-checks the project and creates a production build in `dist/`.
- `npm run preview` serves the production build locally.

## Local development

Install dependencies and run the Vite dev server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Do not open `index.html` directly from the file system or from the repository source view.

## Deployment

This project must be deployed as a built Vite app. The browser cannot run `src/main.tsx` directly as JavaScript; Vite converts the React + TypeScript source into browser-ready JavaScript during `npm run build`.

For GitHub Pages, use the included workflow at `.github/workflows/deploy.yml`. It installs dependencies, runs `npm run build`, and publishes the generated `dist/` directory.

If you see this browser error:

```text
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream".
```

It means the unbuilt source files are being served instead of the Vite production output. Deploy the `dist/` folder, or use the GitHub Pages workflow included in this repository.

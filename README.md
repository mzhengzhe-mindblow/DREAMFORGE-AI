# DreamForge Release Structure

DreamForge has two release forms that share the same UI, logic, API settings, generation workflow, projects, and local account behavior.

## 1. Web Version

These files are the web app:

- `index.html`
- `styles.css`
- `app.js`
- `server.js`
- `assets/`

Use this version when you want to run it in Chrome or deploy it as a web app.

Run locally:

```sh
npm start
```

Open `http://127.0.0.1:4173/index.html`.

## 2. macOS DMG Version

These files are only for the desktop package:

- `electron-main.js`
- `package.json`

The DMG version wraps the same web app in Electron. It starts the local backend inside the app, opens the DreamForge interface in a desktop window, and keeps all existing design and button logic.

Install packaging dependencies once:

```sh
npm install
```

Run the desktop app during development:

```sh
npm run desktop
```

Create a macOS DMG:

```sh
npm run dmg
```

The installer will be created in `release/`.

After changing the web version, rebuild the desktop installer with:

```sh
npm run release:dmg
```

This checks the app scripts first, then packages the latest `index.html`, `styles.css`, `app.js`, `server.js`, and `assets/` into a fresh DMG.

## Local User Data

In the packaged DMG app, account data is stored on the user's own Mac under Electron's app data folder:

`~/Library/Application Support/DreamForge/data`

Passwords used for account login are hashed in the local server database. The optional "remember password" login checkbox stores the remembered email and password locally on that same device only.

## Admin API Keys

API Keys are managed from the Admin backend only. In the app, click `后台`, enter an Admin password, then save API Keys there. The first Admin login creates the local Admin password.

Admin passwords, users, and API Keys are stored under `data/` on the local machine. The repository `.gitignore` excludes `data/`, `node_modules/`, release builds, and `.env` files so private keys are not uploaded to GitHub.

Normal users can only use the product UI and account settings. They cannot see or edit API Keys in the settings UI.

## Recommended Release Flow

```sh
cd "/Users/user/Documents/Codex/2026-05-22/ai-dreamina-ai-ui-ai-project"
npm install
npm run dmg
```

Send the generated `.dmg` file from `release/` to users.

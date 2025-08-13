# Copilot Instructions for AI Coding Agents

## Project Context
Mamba is a smart personal assistant desktop app. Its goal is to help users organize tasks, manage information, and automate workflows using AI. The assistant, called Mamba, provides a modern, efficient interface and leverages AI to anticipate user needs, answer questions, and boost productivity.

Key features:
- Intelligent personal assistant (Mamba) with AI
- Modern UI (React + Tauri)
- Workflow and automation integration
- Multilanguage support (i18n)
- Efficient frontend-backend communication (TypeScript/React ↔ Rust/Tauri)


## Project Overview
- **Stack:** Tauri (Rust backend), React + TypeScript (frontend), Vite (build tool)
- **Structure:**
  - `src/` — React app (entry: `main.tsx`, root: `App.tsx`)
  - `src-tauri/` — Rust backend for Tauri (entry: `main.rs`)
  - `public/` — Static assets
  - `src/components/ui/` — UI components
  - `src/locales/` — i18n JSON files and config

## Key Workflows
- **Dev server:** `npm run dev` (starts Vite + Tauri)
- **Build:** `npm run build` (frontend), `cargo build` (Rust backend)
- **Tauri build:** `npm run tauri build` (full desktop app build)
- **Rust backend:** All Rust code is in `src-tauri/` (main logic: `main.rs`, `lib.rs`)
- **Frontend entry:** `src/main.tsx` → `App.tsx`

## Patterns & Conventions
- **UI:** Use components from `src/components/ui/` for consistency
- **i18n:** Use `src/locales/i18n.ts` for translations; language files in `src/locales/`
- **Assets:** Place SVGs/images in `src/assets/` or `public/`
- **TypeScript config:** See `tsconfig.json` and `tsconfig.app.json`
- **Vite config:** `vite.config.ts` (custom aliases, plugins, etc.)
- **Rust config:** `src-tauri/Cargo.toml`, `tauri.conf.json`

## Integration Points
- **Frontend ↔ Backend:** Use Tauri's IPC (see Tauri docs) for communication between React and Rust
- **External dependencies:**
  - Node: see `package.json`
  - Rust: see `Cargo.toml`

## Examples
- **Add a UI component:** Place in `src/components/ui/`, import in `App.tsx`
- **Add a translation:** Update `src/locales/en.json` and `src/locales/es.json`, use `i18n.ts`
- **Add a Rust command:** Implement in `src-tauri/src/main.rs`, expose via Tauri

## Tips
- **Hot reload:** Works for frontend; restart Tauri for backend changes
- **Debugging:** Use VS Code with rust-analyzer for Rust, built-in tools for TypeScript
- **Do not edit generated files in `src-tauri/gen/` directly**

Refer to this file for project-specific guidance. For general coding, follow best practices for Tauri, React, and Rust.

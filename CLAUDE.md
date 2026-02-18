# CLAUDE.md — AI Assistant Guide for ESIM_Managemen

This file provides context and conventions for AI assistants (such as Claude) working on this repository.

---

## Project Overview

**ESIM_Managemen** is an eSIM (embedded SIM) management system designed for business real service numbers. The project is in its initial/planning stage — no application code exists yet beyond this guide and the README.

**Repository:** `support371/ESIM_Managemen`
**Remote origin:** `http://local_proxy@127.0.0.1:30927/git/support371/ESIM_Managemen`

---

## Current Repository State

As of 2026-02-18, the repository contains only:

- `README.md` — 2-line project stub
- `CLAUDE.md` — this file

No source code, dependencies, build tooling, tests, or infrastructure have been added yet.

---

## Development Branch Policy

- **Default branch:** `master`
- **Feature branches:** Must be prefixed with `claude/` when created by AI assistants
- **Push target:** Always push to the designated feature branch (e.g., `claude/claude-md-mlrv4kcy2ntsg9rr-izaZQ`)
- Never push directly to `master` without explicit permission

### Git Push Pattern

```bash
git push -u origin <branch-name>
```

If push fails due to network errors, retry up to 4 times with exponential backoff: 2s, 4s, 8s, 16s.

---

## Suggested Project Architecture

When development begins, the following structure is recommended for an eSIM management system:

```
ESIM_Managemen/
├── src/                  # Application source code
│   ├── api/              # REST/GraphQL API routes and handlers
│   ├── services/         # Business logic (eSIM provisioning, activation, etc.)
│   ├── models/           # Data models / ORM schemas
│   ├── middleware/        # Auth, logging, error handling
│   └── config/           # App configuration and environment loading
├── tests/                # Test suite
│   ├── unit/
│   └── integration/
├── scripts/              # Utility and migration scripts
├── docs/                 # API documentation, architecture diagrams
├── .env.example          # Template for environment variables
├── README.md
└── CLAUDE.md             # This file
```

---

## Key Domain Concepts

- **eSIM (embedded SIM):** A programmable SIM embedded in a device. Unlike physical SIMs, eSIMs can be provisioned remotely.
- **Business service numbers:** Phone numbers assigned to business accounts, not personal lines. Management includes provisioning, activation, deactivation, and number portability.
- **eSIM Profile:** A network subscription downloaded onto an eSIM. Multiple profiles can coexist on one eSIM.
- **SM-DP+ (Subscription Manager Data Preparation):** The server responsible for eSIM profile preparation and delivery.
- **ICCID:** Integrated Circuit Card Identifier — unique identifier for each eSIM profile.
- **EID:** eSIM Identifier — unique identifier for the eSIM chip itself.

---

## Development Conventions (to be followed when code is added)

### General

- Keep business logic in `src/services/`, not in route handlers
- Use environment variables for all secrets and configuration — never hard-code credentials
- All API endpoints should validate input and return structured error responses
- Use meaningful, descriptive names for variables, functions, and modules

### Git Commits

- Write commit messages in imperative mood: "Add eSIM activation endpoint", not "Added..."
- Keep the subject line under 72 characters
- Reference issue/ticket numbers when applicable

### Security

- Never commit `.env` files or secrets to the repository
- Sanitize all external input (user data, API responses from eSIM providers)
- Use HTTPS for all external service communication
- Store sensitive data (API keys, tokens) in environment variables or a secrets manager

### Testing

- Write unit tests for all service-layer logic
- Write integration tests for API endpoints
- Aim for meaningful test coverage on critical paths (provisioning, activation, deactivation)
- Tests should run without external service dependencies (use mocks/stubs for eSIM provider APIs)

---

## Environment Variables (expected when implemented)

Document all required environment variables in `.env.example`. Expected variables will likely include:

```
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=

# eSIM Provider API
ESIM_PROVIDER_API_URL=
ESIM_PROVIDER_API_KEY=

# Auth
JWT_SECRET=
```

---

## Commands Reference (to be updated as project evolves)

Once the project has tooling set up, expected commands:

```bash
# Install dependencies
npm install          # or: pip install -r requirements.txt

# Start development server
npm run dev          # or equivalent

# Run tests
npm test             # or: pytest

# Lint
npm run lint         # or: flake8 / eslint .

# Build for production
npm run build
```

---

## AI Assistant Instructions

When working on this repository:

1. **Read before editing** — always read a file before modifying it
2. **Check current state** — run `git status` and `git log` to understand where things stand
3. **Stay on the feature branch** — confirm you are on the correct `claude/` branch before committing
4. **Minimal changes** — only make changes directly requested or clearly necessary; do not add unrequested features or refactors
5. **No secrets in code** — never write API keys, passwords, or tokens into source files
6. **Update this file** — if significant new conventions, commands, or structure is added to the project, update CLAUDE.md to reflect the current state
7. **Commit descriptively** — write clear commit messages that explain _why_, not just _what_

---

## Contact / Repository Metadata

- **Owner:** GEM CYBERSECURITY-MONITORING ASSIST
- **Email:** Analyzer@gemcybersecurityassist.com
- **Initial commit:** 2026-02-11

---
name: devops-github
description: Rules and templates for setting up CI/CD pipelines, Git workflows, Vercel deployments, and production releases.
---

# DevOps, CI/CD & Deployment Skill

## Objective

Build a fully automated deployment pipeline. Every push should be tested before deployment. Deployment must be safe, repeatable, and production-ready.

---

# Git Workflow & Commit Conventions

## 1. Git Flow
- `main`: Production branch (only direct releases/stable merges).
- `develop`: Development integration branch.
- `feature/*`: Feature development.
- `bugfix/*` / `hotfix/*`: Fixing issues.

Never commit directly to `main`. Always use Pull Requests (PRs).

## 2. Commit Conventions (Conventional Commits)
- `feat: ...` for new features
- `fix: ...` for bug fixes
- `refactor: ...` for structural edits without functionality changes
- `test: ...` for adding/fixing tests
- `chore: ...` for dependencies and configuration updates

---

# CI/CD Pipeline (GitHub Actions)

Automatically run on every Pull Request and push to `develop` / `main`:
1. **Linting**: `npm run lint`
2. **Type Checking**: `npm run type-check` (via `tsc --noEmit`)
3. **Testing**: Run unit and integration tests.
4. **Build Check**: `npm run build` to verify Next.js builds successfully.
5. **Security Scan**: Verify no secrets are checked into the codebase.

---

# Environment Variables & Deployment (Vercel)

- Configure separate environments for Preview (staging) and Production.
- Maintain environment variables securely:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_APP_URL`
- Never expose server secrets (e.g. `SUPABASE_SERVICE_ROLE_KEY`) using `NEXT_PUBLIC_` prefixes.

---

# Database Migrations & Rollback

- Schema changes must follow a migration-first workflow using Supabase CLI.
- Never edit previous migration files once applied to production.
- **Rollback Strategy**: Always plan a database schema rollback script alongside any complex migration.

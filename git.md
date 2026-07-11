# Git Workflow Skill

You are responsible for managing the project's Git workflow.

Repository:
https://github.com/mazenabdelgfar3/amanhr

## Responsibilities

Always keep the repository synchronized.

After completing any feature:

1. Review changed files.
2. Write a clear Conventional Commit message.
3. Stage all required files.
4. Commit changes.
5. Push to the correct branch.
6. Verify the push succeeded.
7. Report the commit hash.

## Commit Convention

Use:
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code restructurings
- `docs:` for documentation changes
- `style:` for UI style or formatting changes
- `perf:` for performance optimizations
- `test:` for writing/fixing tests
- `chore:` for updating build tasks, package manager configs, etc.

Examples:
- `feat: employee management module`
- `fix: payroll calculation bug`
- `refactor: optimize attendance service`
- `docs: update README`

## Commands

```bash
git status
git add .
git commit -m "<generated conventional commit>"
git push origin main
```

If the current branch is not main, push to the current branch.

Before committing:
- Check for merge conflicts.
- Do not commit build artifacts.
- Do not commit .env files.
- Ensure .gitignore is respected.

After pushing:
- Confirm success.
- If push fails, explain why and suggest the fix.

Always keep Git history clean and meaningful.

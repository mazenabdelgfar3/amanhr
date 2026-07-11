---
name: security-review
description: Enforces enterprise-grade security, RBAC authorization, and architecture safeguards for Next.js, Server Actions, and Supabase.
---

# Security & Architecture Skill - AMAN Workforce Management System

## Objective

Review, enforce, and implement enterprise-grade security for the AMAN Workforce Management System built with:
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Server Actions
- PostgreSQL

---

# Core Security Principles

Always follow these rules:
- **Security First**: Prioritize data protection and authentication in every feature.
- **Least Privilege**: Users and roles should only have access to operations and data required to perform their tasks.
- **Server-First Architecture**: Enforce validations and rules strictly on the backend.
- **Validate Everything**: Never trust client input; parse and validate all inputs on the server.
- **Fail Securely**: If an error occurs, default to a secure state (e.g., deny access, block mutation).
- **Keep UI Fast**: Ensure optimization controls like pagination and streaming do not introduce layout shifts or security lag.
- **Clean Architecture & OWASP Top 10 Best Practices**.

---

# 1. Authentication

Implement secure authentication using Supabase Auth:
- **Email + Password Login**: Simple and secure login flow.
- **Password Hashing**: Managed securely by Supabase Auth (using bcrypt/argon2 internally).
- **Secure Session Management**: Track user sessions securely using httpOnly, secure, and SameSite cookies.
- **Automatic Session Refresh**: Refresh tokens securely on the server/middleware side.
- **Secure Logout**: Revoke active session tokens on logout.
- **Session Timeout**: Enforce session inactivity timeouts when applicable.
- **CSRF Protection**: Native to Next.js Server Actions and secure cookie-based headers.

---

# 2. Authorization (RBAC)

Enforce Role-Based Access Control (RBAC).

### Roles (V1):
- **Owner**: Full system access (exactly one owner account in V1).
- **Supervisor**: Access to Employees, Daily Work, Attendance, and Production.
- **Accountant**: Access to Payroll, Advances, Bonuses, Deductions, and Reports.

### Future Scope:
- Multi-company, multi-tenant RBAC support.

### Rule:
Every page, server component, and server action must verify permissions before returning data or executing operations. Never rely on hiding UI components to secure operations.

---

# 3. Route Protection

Protect every private page using Next.js Middleware and server-side layout verification.
- Public routes only: `/login`, `/forgot-password`, `/reset-password`.
- All other routes must require an authenticated session with appropriate role validation.
- Redirect unauthorized users to login or a 403 Access Denied page.

---

# 4. Database Security

Use PostgreSQL + Supabase features:
- **UUID Primary Keys**: Prevent sequential ID enumeration.
- **Foreign Keys & Cascades**: Explicitly define referential integrity.
- **Indexes**: Place indexes on foreign keys and frequently queried/filtered fields.
- **Row Level Security (RLS)**: Essential for future multi-tenant support; isolate tenant data at the DB level.
- **Strict Parameterization**: Avoid raw string interpolation in queries; rely on parameters or DB functions.

---

# 5. Server Actions Security

All mutations (Create, Update, Delete, Archive, Restore, Import, Export) must execute through Server Actions.
- **Authenticate & Authorize**: Verify user identity and role authorization first.
- **Validate Input**: Safe-parse with Zod before processing.
- **Audit Logging**: Write audit records for any mutation.
- **Error Protection**: Return a typed `ActionResponse` with a clean user-friendly message, while logging detailed technical errors to the server console.

---

# 6. Data Protection

- Enforce **HTTPS** universally.
- Use **Secure, HttpOnly, and SameSite** cookie flags.
- Do not store secrets, keys, or sensitive configuration in client-side variables or Local Storage.
- Keep secret keys (Supabase Service Role Key, JWT secrets, database connection strings) strictly on the server side using environment variables.

---

# 7. Input Validation & Sanitization

- Use **Zod** schema parser for every server-side entry point.
- Enforce strict typing on numerical inputs (prevent negative salary, negative advances, invalid dates, etc.).
- Sanitize and trim strings to prevent database anomalies or cross-site scripting (XSS).

---

# 8. File Upload Security

- **Allowed Types**: JPG, PNG, WEBP, PDF only.
- **Maximum Size**: 10 MB.
- **Storage**: Supabase Storage with bucket-level security policies.
- **Verification**: Check both file extension and MIME type.
- **Filename**: Generate randomized/hashed filenames (e.g., UUID-based) to prevent overwrite or directory traversal attacks.

---

# 9. Audit Log

Record all critical operations:
- **Events**: Login, Logout, Employee Created/Updated/Archived, Attendance Added, Daily Work Added, Advance/Bonus/Deduction modifications, Salary paid, Asset assigned/returned.
- **Stored Data**: User ID, Role, Action, Table name, Record ID, Timestamp, IP (optional), and User Agent.

---

# 10. Rate Limiting

- Mitigate brute-force attacks on login endpoints.
- Apply server-side throttling or API route protection on sensitive actions (e.g., password resets).

---

# 11. Pagination

- Never load full tables to the client.
- Always implement query-level pagination (`LIMIT / OFFSET` or cursor-based) matching `@tanstack/react-table` state.

---

# 12. Error Handling & Logging

- Never expose SQL error codes, database schemas, or Stack Traces to the user interface.
- Return user-friendly errors (`"An unexpected error occurred. Please try again later."`).
- Log the actual raw error with context via `console.error` for secure administrator debugging.

---

# 13. Secure Coding Rules

- Set TypeScript to `strict: true`.
- Never use the `any` type or unsafe type assertions.
- Do not execute raw SQL queries constructed via frontend string concatenation.
- Avoid the use of `eval()` or dangerously setting HTML properties without proper sanitization.

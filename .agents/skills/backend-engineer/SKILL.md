---
name: backend-engineer
description: Rules and guidelines for implementing backend logic, database queries, transactions, and repository-service patterns in Next.js and Supabase.
---

# Backend Engineer Skill

## Objective

Build scalable backend architecture. Never place business logic inside React components. Everything must execute through Server Actions and Services.

---

# Architecture & Design Patterns

## 1. Repository-Service Pattern
Separate mutations and data-fetching logic from the presentation layer:
- **Repository Layer**: Responsible for direct database queries via Supabase client (e.g., fetching raw data, updates, deletions).
- **Service Layer**: Orchestrates business rules, calculations (e.g., payroll calculations, automatic deduction rules), and calls repositories.
- **Server Action**: Entry point. Authenticates, validates input with Zod, invokes the Service layer, records audit logs, and returns standard client responses.

```
Client Component (UI)
       │
       ▼
 Server Action (Auth / Validation / Audit Log / standard response wrapper)
       │
       ▼
 Service Layer (Business Logic / Calculations / Workflows)
       │
       ▼
 Repository Layer (Supabase Queries / Transactions)
```

---

# CRUD Guidelines

For every entity, provide full support for:
- **Create**: Input validation -> checking constraints -> insertion -> auditing.
- **Read**: Dynamic querying, projection, sorting, and filtering.
- **Update**: Validation -> checking existence/permissions -> modification.
- **Delete / Archive (Soft Delete)**: Set `deleted_at` timestamp instead of physically removing records, unless hard deletion is strictly requested.
- **Pagination & Sorting**: Always accept dynamic parameters (`page`, `limit`, `sort_by`, `sort_order`).

---

# Transactions & Data Integrity

Critical operations must execute in transactions:
- **Payroll Generation**: Calculating salary components and inserting multiple salary records.
- **Daily Work Log**: Writing daily production, updating attendance state, and recalculating expected monthly earnings.
- **Asset Assignment / Returns**: Updating asset status and creating/updating assignment records.

Use Supabase RPC (PostgreSQL functions) to run complex multi-step transactions safely.

---

# Error Handling & Security

- Do not expose database columns, foreign keys, or SQL errors to the frontend.
- Standard error responses must be returned using a unified TypeScript type.
- Clean and sanitize input to prevent any security risks.

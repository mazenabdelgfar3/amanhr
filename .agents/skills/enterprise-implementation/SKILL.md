---
name: enterprise-implementation
description: Use this skill to implement enterprise-grade SaaS, ERP, CRM, HR, Inventory, Clinic, School, and Business Management Systems after all planning documents have been completed and approved.
---

# Enterprise Implementation

## Objective

Implement production-ready software using the approved PRD, System Design, UX Flow, API Design, Validation, Security, Database Design, UI Design, and Development Plan.

Never invent requirements.

Always follow the approved documents.

---

# Implementation Rules

Before writing any code verify that these documents already exist:

- Product Requirements Document (PRD)
- System Design
- UX Flow
- API Design
- Validation
- Security
- Database Design
- UI Design
- Development Plan

If any document is missing:

STOP.

Do not implement.

Request the missing document.

---

# Technology Stack

Always use:
- Next.js 15+
- App Router
- TypeScript (Strict)
- Tailwind CSS
- shadcn/ui
- Supabase
- PostgreSQL
- Server Actions
- React Hook Form
- Zod
- TanStack Table
- Recharts
- Lucide Icons

---

# Architecture Rules

Follow Feature-Based Architecture.

Example:
```
features/
  employees/
  attendance/
  daily-work/
  payroll/
  reports/
  assets/
  settings/
```

Each feature contains:
- components
- actions
- hooks
- lib
- validations
- types
- services

Never place everything inside one folder.

---

# Coding Rules

Always write:
- Modular code
- Reusable components
- Strong typing
- Small functions
- Self-documenting code

Avoid:
- Duplicate code
- Large components
- Hardcoded values
- Inline business logic
- Massive files

---

# Implementation Order

Implement ONLY ONE module at a time.

Order:
1. Project Setup
2. Authentication
3. Layout
4. Design System
5. Dashboard
6. Employees
7. Attendance
8. Daily Work
9. Payroll
10. Advances
11. Deductions
12. Bonuses
13. Assets
14. Reports
15. Settings

Never skip the order.

---

# Module Workflow

For every module:
1. Analyze requirements
2. Create folder structure
3. Build UI
4. Build validation
5. Implement business logic
6. Connect Supabase
7. Handle loading states
8. Handle empty states
9. Handle error states
10. Test module
11. Self-review
12. Continue

Never start the next module until the current one is complete.

---

# UI Rules

Every screen must include:
- Loading State
- Empty State
- Error State
- Success Feedback
- Responsive Layout
- Keyboard Accessibility

---

# Forms

Every form must include:
- Zod Validation
- React Hook Form
- Required indicators
- Helpful error messages
- Disabled submit while saving
- Loading state
- Success feedback

---

# Tables

Every table must support:
- Search
- Sorting
- Filters
- Pagination
- Responsive behavior
- Empty state

---

# Performance

Always optimize:
- Server Components where possible
- Lazy Loading
- Code Splitting
- Image Optimization
- Pagination
- Memoization where appropriate

---

# Security

Always implement:
- Authentication
- Authorization
- Input Validation
- Secure Server Actions
- Environment Variables
- Audit Logging where required

Never trust client-side validation alone.

---

# Code Quality

After every module:

Run an internal review checking:
- Clean Code
- Performance
- Accessibility
- Responsiveness
- Security
- TypeScript errors
- Dead code
- Duplicate code

Fix issues before continuing.

---

# Final Rule

Never generate an entire enterprise system in one response.

Work module by module.

Complete.

Review.

Improve.

Then continue.

After generating the Implementation Plan: STOP. Do NOT write any code. Wait for explicit user approval. Only after approval implement ONE module at a time. Never implement more than one module simultaneously.


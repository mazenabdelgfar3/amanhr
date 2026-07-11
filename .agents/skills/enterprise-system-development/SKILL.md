---
name: enterprise-system-development
description: Use this skill whenever building or planning any SaaS, ERP, CRM, HR, Clinic, School, Inventory, or Business Management System. This skill enforces an enterprise-grade workflow before writing any production code.
---

# Enterprise System Development Skill

## Objective

Build scalable, maintainable, production-ready business systems using a structured engineering workflow.

Never start coding immediately.

Always complete the planning documents first.

---

# Required Workflow

Follow these phases in order.

Skipping phases is NOT allowed.

---

## Phase 1 — Product Discovery

Understand:

- Business problem
- Target users
- User roles
- Daily workflow
- Pain points
- Success metrics

Output:

- Product Vision
- Goals
- Scope

---

## Phase 2 — Product Requirements Document (PRD)

Create a complete PRD containing:

- Product Overview
- Goals
- Users
- User Roles
- Features
- Functional Requirements
- Non Functional Requirements
- Business Rules
- Workflows
- Reports
- Settings
- Future Features

---

## Phase 3 — System Design

Design the complete architecture.

Include:

- System Architecture
- Application Layers
- Technology Stack
- Folder Structure
- Modules
- Data Flow
- Business Logic
- Performance Strategy
- Deployment Strategy

---

## Phase 4 — UX Flow

Design every user journey.

Include:

- Login Flow
- Dashboard Flow
- CRUD Flow
- Daily Workflow
- Settings Flow
- Reports Flow
- Error States
- Empty States

Keep navigation simple.

---

## Phase 5 — API Design

Design every operation.

For every module define:

- Create
- Read
- Update
- Delete

If using Next.js Server Actions:

Describe actions instead of REST endpoints.

---

## Phase 6 — Validation

Define:

Field Validation

Business Validation

Calculation Validation

Error Messages

Edge Cases

---

## Phase 7 — Security

Design:

Authentication

Authorization

Session Management

Permissions

Audit Log

Database Security

Input Sanitization

File Security

Rate Limiting

Backup Strategy

Recovery Plan

---

## Phase 8 — Database Design

Design every table.

For each table include:

Table Name

Columns

Types

Primary Keys

Foreign Keys

Indexes

Constraints

Relationships

Normalization

Create an ER Diagram.

---

## Phase 9 — UI Design

Design every screen.

Include:

Layout

Components

Cards

Forms

Dialogs

Tables

Filters

Pagination

Charts

Responsive Behavior

Dark Mode

Accessibility

---

## Phase 10 — Design System

Define:

Typography

Spacing

Radius

Shadow

Buttons

Inputs

Tables

Badges

Colors

Icons

Animation Rules

Loading States

Empty States

Skeletons

---

## Phase 11 — Development Plan

Split development into milestones.

Example:

Phase 1

Project Setup

Phase 2

Authentication

Phase 3

Dashboard

Phase 4

Employees

Phase 5

Daily Work

Phase 6

Payroll

Phase 7

Reports

Phase 8

Testing

Phase 9

Deployment

---

## Phase 12 — Code Implementation

Only after all previous documents are approved.

Requirements:

Clean Architecture

Feature Based Structure

Reusable Components

Server Components where possible

Server Actions

Strict TypeScript

React Hook Form

Zod Validation

Error Boundaries

Loading UI

Optimistic Updates

Pagination

Caching

Proper Error Handling

No duplicated code.

---

## Phase 13 — Testing

Write:

Unit Tests

Integration Tests

UI Tests

Performance Tests

Responsive Tests

Accessibility Tests

---

## Phase 14 — Deployment

Prepare:

Production Environment

Environment Variables

Database Migration

Seed Data

Monitoring

Logging

Backups

Domain

SSL

Analytics

---

# Coding Standards

Always use:

Next.js 15+

TypeScript

TailwindCSS

shadcn/ui

Supabase

PostgreSQL

Server Actions

React Hook Form

Zod

TanStack Table

Recharts

Lucide Icons

---

# UI Principles

Professional

Enterprise

Minimal

Fast

Accessible

Responsive

Consistent

No AI-looking UI.

Avoid:

Rounded giant cards

Random gradients

Huge shadows

Floating effects everywhere

Too many colors

Glassmorphism abuse

---

# UX Principles

Reduce clicks.

Keep forms short.

Always provide:

Loading

Empty

Success

Error

Confirmation

Undo when possible.

---

# Performance

Lazy Loading

Code Splitting

Pagination

Image Optimization

Caching

Debounced Search

Server Components

Streaming

---

# Security Checklist

✓ Authentication

✓ Authorization

✓ Validation

✓ Audit Log

✓ File Validation

✓ SQL Injection Protection

✓ XSS Protection

✓ CSRF Protection

✓ HTTPS

✓ Secure Cookies

✓ Environment Variables

---

# Final Rule

Never generate production code before completing:

1. PRD

2. System Design

3. UX Flow

4. API Design

5. Validation

6. Security

7. Database Design

8. UI Design

9. Design System

10. Development Plan

Only after approval begin implementation.

Never implement more than one phase at a time. Every phase must pass architecture review, security review, testing, and code review before moving to the next phase.

Work like a senior software architect, not just a code generator.

=========================================
# System Architecture Skill (Specification)
## AMAN Workforce Management System v1

### Technology Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui, TanStack Table, React Hook Form, Zod, Recharts, Framer Motion, Lucide Icons.
- **Backend**: Next.js Server Actions, PostgreSQL, Supabase, Edge Middleware.
- **Auth**: Supabase Auth, RBAC (Owner, Supervisor, Accountant).
- **Database**: PostgreSQL (UUID keys, Foreign Keys, Indexes, Constraints, Transactions, Soft Delete, Audit Log).
- **Storage**: Supabase Storage for photos, documents, and reports.

### Layered Architecture
1. **Presentation Layer**: UI Components, Pages, Forms, Tables, Charts, Layouts.
2. **Business Layer**: Core logics (Employees, Attendance, Payroll, Assets, Production, Reports).
3. **Application Layer**: Server Actions, Zod validation, Authorization filters, Services, Utilities.
4. **Data Layer**: PostgreSQL, Supabase queries, Database transactions.
5. **Storage Layer**: File buckets.

### Recommended Folder Structure
- `app/` - Routing & pages
- `components/ui/`, `components/shared/`, `components/layout/` - Shared components
- `features/[module]/` - Feature modules (dashboard, employees, attendance, daily-work, production, payroll, bonuses, deductions, advances, assets, reports, settings) containing their own components, actions, schemas, types, hooks, services.
- `lib/`, `hooks/`, `types/`, `utils/`, `constants/` - Shared helpers
- `middleware.ts` - Session/RBAC routing protection

### Core Workflows
- **Employee Creation**: Form -> React Hook Form -> Zod Validation -> Server Action -> Auth Check -> DB Transaction -> Audit Log -> Refresh.
- **Daily Work Flow**: Supervisor selection -> Enter production -> Validation -> Server Action -> Update Attendance/Production/Payroll -> Refresh.
- **Payroll Logic**: Net Salary = Base Salary + Production Incentives + Bonuses + Overtime - Advances - Deductions.
- **Asset Workflow**: Create -> Assign -> Use -> Return -> Inspection -> Normal Return OR (Damage -> Deduction) -> Archive History.

### Performance Strategy
- Server Components by default.
- Streaming & Suspense boundaries.
- Lazy Loading / Dynamic imports.
- Pagination at DB/Query level.
- Memoization and Indexed tables.
- Next.js Image Optimization.

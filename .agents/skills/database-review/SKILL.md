---
name: database-review
description: Rules, standards, and schemas for reviewing and designing PostgreSQL databases, schema migrations, and indexing strategies.
---

# Database Architect Skill - AMAN Workforce Management System

## Objective

Design and maintain a production-ready, highly normalized, performant, and secure PostgreSQL relational database schema using Supabase.

---

## Core Database Rules

### 1. Schema Conventions
- **Naming**: Use `snake_case` for all table names, column names, indexes, constraints, and database functions.
- **Primary Keys**: Always use `id uuid DEFAULT gen_random_uuid() PRIMARY KEY`.
- **System Columns**: Every table must include:
  - `created_at timestamp with time zone default timezone('utc'::text, now()) not null`
  - `updated_at timestamp with time zone default timezone('utc'::text, now()) not null`
  - `created_by uuid references auth.users(id) on delete set null`
  - `updated_by uuid references auth.users(id) on delete set null`
  - `deleted_at timestamp with time zone` (for Soft Delete support)

### 2. Constraints & Integrity
- Always use `NOT NULL` for required fields.
- Apply `CHECK` constraints for logical values (e.g., `salary >= 0`, `amount > 0`).
- Apply `UNIQUE` constraints where applicable (e.g., phone, national ID, serial number).
- Set foreign key policies strictly: prefer `ON DELETE RESTRICT` (to prevent accidental orphan records) or `ON DELETE CASCADE` (for dependent child records).

### 3. Normalization & Optimization
- Normalize to **3rd Normal Form (3NF)**.
- Avoid storing computed or derived fields (like `net_salary`) unless performance testing proves it is absolutely necessary (and in that case, maintain them via database triggers).
- Index foreign key columns and frequently filtered/searched fields.

---

## Schema Architecture Blueprint

### 1. Employees Table (`employees`)
- `id` UUID (PK)
- `name` VARCHAR(100) NOT NULL
- `phone` VARCHAR(20) UNIQUE NOT NULL
- `national_id` CHAR(14) UNIQUE NOT NULL
- `base_salary` DECIMAL(12, 2) NOT NULL CHECK (base_salary >= 0)
- `hiring_date` DATE NOT NULL
- `status` VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Vacation', 'Suspended', 'Resigned'))

### 2. Daily Work (`daily_work`)
- `id` UUID (PK)
- `date` DATE NOT NULL
- `employee_id` UUID FK -> `employees(id)` ON DELETE RESTRICT
- `attendance` VARCHAR(20) NOT NULL CHECK (attendance IN ('Present', 'Absent', 'Vacation', 'Permission'))
- `production` DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (production >= 0)
- `overtime_hours` DECIMAL(4, 2) DEFAULT 0 CHECK (overtime_hours >= 0 AND overtime_hours <= 24)
- `notes` TEXT

### 3. Advances (`advances`)
- `id` UUID (PK)
- `employee_id` UUID FK -> `employees(id)` ON DELETE RESTRICT
- `amount` DECIMAL(10, 2) NOT NULL CHECK (amount > 0)
- `reason` TEXT NOT NULL
- `date` DATE NOT NULL

### 4. Deductions (`deductions`)
- `id` UUID (PK)
- `employee_id` UUID FK -> `employees(id)` ON DELETE RESTRICT
- `value` DECIMAL(10, 2) NOT NULL CHECK (value > 0)
- `reason` TEXT NOT NULL

### 5. Bonuses (`bonuses`)
- `id` UUID (PK)
- `employee_id` UUID FK -> `employees(id)` ON DELETE RESTRICT
- `value` DECIMAL(10, 2) NOT NULL CHECK (value > 0)
- `reason` TEXT NOT NULL

### 6. Assets Table (`assets`)
- `id` UUID (PK)
- `name` VARCHAR(100) NOT NULL
- `serial_number` VARCHAR(100) UNIQUE NOT NULL
- `status` VARCHAR(20) NOT NULL CHECK (status IN ('Available', 'Assigned', 'Maintenance', 'Damaged', 'Lost'))

### 7. Asset Assignments (`asset_assignments`)
- `id` UUID (PK)
- `asset_id` UUID FK -> `assets(id)` ON DELETE RESTRICT
- `employee_id` UUID FK -> `employees(id)` ON DELETE RESTRICT
- `assigned_at` TIMESTAMP WITH TIME ZONE NOT NULL
- `returned_at` TIMESTAMP WITH TIME ZONE

### 8. Audit Logs (`audit_logs`)
- `id` UUID (PK)
- `user_id` UUID
- `action` VARCHAR(50) NOT NULL
- `table_name` VARCHAR(50) NOT NULL
- `record_id` UUID NOT NULL
- `old_values` JSONB
- `new_values` JSONB

---

## Indexing Strategy
Always generate indexes for:
- `employees(name)`
- `employees(phone)`
- `employees(national_id)`
- `daily_work(date, employee_id)`
- `asset_assignments(asset_id, employee_id)` where `returned_at IS NULL`

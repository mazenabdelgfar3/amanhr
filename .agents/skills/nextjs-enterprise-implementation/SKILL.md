---
name: nextjs-enterprise-implementation
description: Rules and templates for implementing enterprise-grade Next.js features using App Router, TypeScript, TailwindCSS, shadcn/ui, Supabase, Server Actions, React Hook Form, and Zod.
---

# Next.js Enterprise Implementation Skill

## Objective
Implement high-performance, secure, and clean code for enterprise business features in Next.js 15+.

---

# Architecture & Directory Structure

Always use a **Feature-Based (Screaming) Architecture**. Keep code related to a specific feature grouped together.

```
src/
├── app/                  # Routing & Layouts only (no business logic)
│   ├── (auth)/           # Authentication route groups
│   ├── dashboard/        # Main dashboard route
│   └── api/              # Standard REST endpoints (only when necessary)
├── features/             # Business features & modules
│   ├── employees/        # Example feature module
│   │   ├── components/   # Feature-specific UI components
│   │   ├── actions/      # Next.js Server Actions (database operations)
│   │   ├── hooks/        # Custom React hooks for this feature
│   │   ├── schema/       # Zod schemas for validation
│   │   ├── services/     # Feature business logic / data access helpers
│   │   └── types/        # TypeScript types & interfaces
│   └── billing/
├── components/           # Shared global UI components (shadcn/ui)
│   ├── ui/               # Core atomic components
│   └── shared/           # Complex shared components (e.g., GlobalNavbar)
├── lib/                  # Shared utilities & configurations
│   ├── supabase/         # Client and Server Supabase clients
│   └── utils.ts          # Tailwind merge utility
```

---

# Coding Standards

## 1. Server Components vs. Client Components
- **Default to Server Components (RSC)** for all pages, layouts, and components. Fetch data directly in RSCs.
- **Use Client Components (`"use client"`) only for**:
  - Interactive elements (event listeners, state, effects).
  - Using browser APIs.
  - Form wrapper components using React Hook Form.

## 2. Server Actions Pattern
Every state-mutating operation (Create, Update, Delete) must use Next.js Server Actions.

### Rules:
1. Put actions in a dedicated `actions/` folder within the feature directory (e.g., `features/employees/actions/create-employee.ts`).
2. Mark the file with `"use server";` at the top.
3. Validate all inputs using a Zod schema.
4. Catch all errors and return a standardized response format:
   ```typescript
   export type ActionResponse<T> = {
     success: boolean;
     data?: T;
     error?: {
       message: string;
       fields?: Record<string, string[]>;
     };
   };
   ```

### Action Template:
```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { employeeSchema, type EmployeeInput } from "../schema/employee-schema";
import { ActionResponse } from "@/types/actions";
import { revalidatePath } from "next/cache";

export async function createEmployee(
  rawInput: unknown
): Promise<ActionResponse<any>> {
  // 1. Validate inputs
  const parsed = employeeSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        message: "Invalid form data.",
        fields: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      },
    };
  }

  try {
    const supabase = await createClient();
    
    // 2. Perform DB operations
    const { data, error } = await supabase
      .from("employees")
      .insert(parsed.data)
      .select()
      .single();

    if (error) {
      return {
        success: false,
        error: { message: error.message },
      };
    }

    // 3. Revalidate cache
    revalidatePath("/dashboard/employees");

    return {
      success: true,
      data,
    };
  } catch (err) {
    return {
      success: false,
      error: { message: "An unexpected server error occurred." },
    };
  }
}
```

---

# Form Handling & Validation

Always use **React Hook Form** + **Zod** + **shadcn/ui Form Component**.

### Rules:
- Create schemas in `schema/` directory (e.g., `employee-schema.ts`).
- Handle backend validation errors gracefully by mapping `ActionResponse.error.fields` directly back to form fields.
- Show clear loading skeletons or spinner icons in the submit button when `isSubmitting` is true.

---

# Database Guidelines (Supabase & PostgreSQL)

- **SQL Conventions**:
  - Use snake_case for tables, columns, and foreign keys.
  - Add standard columns to all tables: `id (uuid, default gen_random_uuid())`, `created_at`, `updated_at`.
- **Typing**: Use Supabase CLI to generate TypeScript types from the database schema regularly.

---

# UI Guidelines (shadcn/ui & Tailwind)

- Avoid excessive gradients or custom animations. Use standard shadcn classes.
- **Tables**: Use `@tanstack/react-table` for search, filters, pagination, and sorting.
- **Charts**: Use `recharts` wrapped inside shadcn-compatible chart containers.
- **Modals**: Keep configuration modals clean and fast.

---

# Performance Checklist

1. **Streaming & Suspense**: Wrap data-fetching components in `<Suspense fallback={<TableSkeleton />} />` to keep pages responsive.
2. **Debounced Search**: Always debounce real-time search inputs before querying database/server.
3. **Caching**: Utilize `revalidatePath` and `revalidateTag` strategically to keep data fresh without over-fetching.

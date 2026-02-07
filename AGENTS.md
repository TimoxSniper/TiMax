# AGENTS.md for Timax

## Overview

Timax is a Next.js-based platform for AI-powered video/audio transcription and text generation. This document provides guidelines for agents working on this codebase.

## Build/Lint/Test Commands

### Project Structure

All development commands are run from the `my-app` directory:

```bash
cd my-app
```

### Development

```bash
npm run dev              # Start development server on port 3000
npm run build            # Build for production
npm run start            # Start production server
```

### Linting & Formatting

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Auto-fix ESLint issues
npm run format           # Run Prettier formatting
npm run format:check     # Check if files are formatted correctly
```

### Type Checking

```bash
npm run typecheck        # Run TypeScript type checking
```

### Testing

```bash
npm run test             # Run all tests (Vitest in watch mode)
npm run test:ui          # Run Vitest UI for interactive testing
npm run test:coverage    # Run all tests with coverage report
npm run test:ci          # Run all tests in CI mode (no watch)
npm run test:single src/__tests__/utils.test.ts  # Run a single test file (CI mode)
npm run test src/__tests__/utils.test.ts  # Run a single test file (watch mode)
```

### Validation

```bash
npm run validate         # Run typecheck → lint → test:ci (full validation)
```

### MCP Server

```bash
npm run mcp:server       # Start MCP server
```

### Other

```bash
npm run analyze          # Run Next.js bundle analyzer
npm run prepare          # Install Husky Git hooks
```

## Code Style Guidelines

### 1. File Structure & Naming

#### Directory Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── [route]/
│   │   ├── page.tsx         # Route component
│   │   ├── layout.tsx       # Route layout
│   │   └── error.tsx        # Error boundary
├── components/              # React components
│   ├── ui/                  # Shadcn/ui components
│   ├── [feature]/           # Feature-specific components
│   └── layout/              # Layout components
├── lib/                     # Utility functions & helpers
│   ├── __tests__/           # Unit tests
│   ├── [feature]/           # Feature-specific utilities
│   └── index.ts             # Exports
├── hooks/                   # Custom React hooks
└── middleware.ts            # Next.js middleware
```

#### Naming Conventions

- **Files**: Use kebab-case (e.g., `text-generator.tsx`, `utils.test.ts`)
- **Directories**: Use kebab-case (e.g., `text-generator`, `__tests__`)
- **Components**: Use PascalCase (e.g., `TranscriptViewer`, `FileUpload`)
- **Functions**: Use camelCase (e.g., `getUserFriendlyError`, `validateFilename`)
- **Variables**: Use camelCase (e.g., `uploadConfig`, `isFileSizeAllowed`)
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `UPLOAD_CONFIG`, `ERROR_MESSAGES`)
- **Types/Interfaces**: Use PascalCase (e.g., `UserFriendlyError`, `ChatMessage`)

### 2. Imports

#### Import Order

```typescript
// 1. External libraries (React, Next.js, third-party)
import { useState, useEffect } from "react";
import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";

// 2. Internal utilities & helpers
import { ERROR_MESSAGES } from "@/lib/errors";
import { validateFilename } from "@/lib/validation";

// 3. Components
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/upload/file-upload";
```

#### Import Paths

- Use `@/` alias for imports from `src/` directory
- Absolute paths are required for all imports
- Avoid relative imports like `../lib/utils`

### 3. Code Formatting

#### General Rules

- Use Prettier for automatic formatting
- Max line length: 120 characters
- 2 spaces per indentation level

#### React/TSX Guidelines

```typescript
// ✓ Good
function Component({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState<StateType>(initialValue);

  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  return (
    <div className="container">
      <h1 className="text-xl font-bold">Title</h1>
      <p className="text-muted-foreground">Content</p>
    </div>
  );
}

// ✓ Good (memoized component)
import { memo } from 'react';

const MemoizedComponent = memo(function MemoizedComponent({ data }) {
  return <div>{data}</div>;
});

export default MemoizedComponent;

// ✓ Good (complex logic)
import { useMemo } from 'react';

function Component({ items }) {
  const processedItems = useMemo(() => {
    return items.map(item => processItem(item));
  }, [items]);

  return <div>{processedItems}</div>;
}
```

#### Tailwind CSS Guidelines

- Use `cn()` utility for class merging (import from `@/lib/utils`)
- Prefer responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Use Tailwind constants for spacing, colors, etc.
- Example:

```typescript
import { cn } from '@/lib/utils';

function Component() {
  const isActive = true;

  return (
    <div className={cn(
      "base-class",
      "md:md-class",
      isActive ? "active-class" : "inactive-class"
    )}>
      Content
    </div>
  );
}
```

### 4. Types & Interfaces

#### TypeScript Guidelines

- Use `strict: true` configuration (enforced)
- Prefer type aliases over interfaces for complex types
- Use `zod` for validation schemas

#### Example Validation Schema

```typescript
import { z } from "zod";

export const chatSchema = z.object({
  message: z
    .string()
    .min(1, "Nachricht darf nicht leer sein")
    .max(10000, "Nachricht ist zu lang. Maximum: 10000 Zeichen")
    .refine((msg) => !containsDangerousContent(msg), {
      message: "Nachricht enthält unerlaubte Inhalte",
    }),
  chat_id: z.string().nullish(),
  sessionId: z
    .string()
    .min(1, "sessionId ist erforderlich")
    .max(255, "sessionId ist zu lang"),
});
```

#### Error Handling

- Use centralized error handling from `@/lib/errors`
- Always return user-friendly error messages in German
- Example:

```typescript
import { getUserFriendlyError, handleApiCall } from "@/lib/errors";

async function fetchData() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw { status: response.status, error: await response.json() };
    }
    return await response.json();
  } catch (error) {
    const friendlyError = getUserFriendlyError(error);
    console.error(friendlyError.technical);
    return { error: friendlyError };
  }
}

// Or use the helper
const result = await handleApiCall(() => fetch("/api/data"), {
  onError: (error) => {
    console.error(error);
  },
});
```

### 5. Testing

#### Test Structure

- Tests are located in `src/__tests__/` directory
- Use Vitest as test runner
- Test files follow `[filename].test.ts` or `[filename].test.tsx` pattern

#### Test Format

```typescript
import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("Utils", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      const result = cn("class1", "class2");
      expect(result).toBe("class1 class2");
    });

    it("should handle conditional classes", () => {
      const isActive = true;
      const result = cn("base", isActive && "active");
      expect(result).toBe("base active");
    });
  });
});
```

#### Mocking

- Use Vitest's mocking capabilities
- Setup file: `src/__tests__/setup.ts`
- For API tests, consider using `msw`

### 6. Error Handling & Security

#### Input Validation

- Always validate user input on both client and server
- Use `zod` for schema validation
- Sanitize all user input before processing/displaying

#### Dangerous Content Detection

- Use `containsDangerousContent()` from `@/lib/validation`
- Sanitize AI outputs with `sanitizeAIOutput()`

#### API Routes

- All API routes must validate inputs
- Return appropriate HTTP status codes
- Use `handleApiCall()` helper for consistent error handling

### 7. Performance Optimization

#### Component Optimization

- Use `memo()` for expensive components
- Use `useMemo()` for expensive calculations
- Use `useCallback()` for callbacks

#### Image Optimization

- Use Next.js `Image` component
- Always specify `width` and `height`
- Consider `placeholder="blur"` for better UX

#### Code Splitting

- Use dynamic imports for large components
- Next.js automatically code splits pages

### 8. Documentation

#### Comments

- Write comments in German (user-facing messages are in German)
- Use JSDoc for functions/classes
- Explain why, not what

#### Example

```typescript
/**
 * Validates a filename against security rules
 * Prevents path traversal and dangerous characters
 */
export function validateFilename(filename: string): boolean {
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return false;
  }

  const filenameRegex = /^[a-zA-Z0-9._-]+$/;
  return filenameRegex.test(filename);
}
```

### 9. Git Guidelines

#### Commit Messages

- Use clear, concise German messages
- Reference issues if applicable
- Examples:
  - `fix: Behebe Dateigrößenlimit-Validation`
  - `feat: Füge Chat-Historie-Validation hinzu`
  - `refactor: Optimisiere Error Handling für API Calls`

#### Branching

- Create feature branches for new functionality
- Use `feature/` prefix (e.g., `feature/chat-validation`)
- Merge into `main` via PR with reviews

#### Husky Hooks

- Pre-commit hooks run `lint-staged` (formatting & linting)
- Ensure your code passes these checks before committing

## Project-Specific Rules

### 1. Design System

- Uses Shadcn/ui components
- Customizes components with Tailwind CSS
- Uses `class-variance-authority` (CVA) for variants
- Example:

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-button-class", {
  variants: {
    variant: {
      default: "default-styles",
      destructive: "destructive-styles",
    },
    size: {
      default: "default-size",
      sm: "small-size",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});
```

### 2. Locale

- All user-facing text is in German
- Use `ERROR_MESSAGES` from `@/lib/errors` for consistent error messages
- Centralize UI text in constants files

### 3. Environment Variables

- Use `.env.local` for local development
- Reference `.env.local.example` for required variables
- Validate environment variables in `src/lib/env.ts`

### 4. Database

- Uses Supabase (PostgreSQL)
- Database types are generated from Supabase schema
- Use `@/lib/supabase` for database operations

## Key Files & Directories

- `src/lib/errors.ts` - Centralized error handling
- `src/lib/validation.ts` - Input validation & sanitization
- `src/lib/utils.ts` - Utility functions (includes `cn()` for class merging)
- `src/lib/upload-config.ts` - Upload configuration & validation
- `src/components/ui/` - Shadcn/ui components
- `src/app/` - Next.js App Router pages
- `src/__tests__/` - Unit tests

## Common Workflows

### Adding a New Component

1. Create component file in `src/components/[feature]/`
2. Use Shadcn/ui patterns if applicable
3. Add tests in `src/__tests__/`
4. Import using `@/components/[feature]/[filename]` syntax

### Adding a New API Route

1. Create route file in `src/app/api/[route]/route.ts`
2. Validate inputs using `zod` schema
3. Handle errors using `handleApiCall()`
4. Return appropriate JSON response

### Fixing a Bug

1. Reproduce the bug
2. Write a test that fails
3. Fix the bug
4. Ensure all tests pass
5. Run `npm run validate` to ensure everything works

## Troubleshooting

### Common Issues

- **Type errors**: Check TypeScript types with `npm run typecheck`
- **Linting errors**: Fix with `npm run lint:fix`
- **Formatting issues**: Run `npm run format`
- **Test failures**: Run `npm run test` to debug

### Debugging

- Use `console.error()` with `friendlyError.technical` for debugging
- Check browser console for frontend errors
- Check Vercel logs for production errors

This document provides a comprehensive guide for agents working on the Timax codebase. Always follow these guidelines to ensure consistency, maintainability, and quality in the codebase.

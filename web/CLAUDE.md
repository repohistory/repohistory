# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Repohistory is a Next.js web application that provides an open-source dashboard for tracking GitHub repository traffic history beyond the default 14-day limit. The application integrates with GitHub OAuth and Supabase for authentication and data persistence.

## Package Manager

This project uses pnpm as the package manager.

## Key Components Structure
- `src/app/(dashboard)/` - Protected dashboard pages
- `src/components/charts/` - Chart components using D3 and Recharts
- `src/components/repo/` - Repository-related UI components
- `src/components/ui/` - Shadcn/ui components (button, card, tooltip, etc.)
- `src/utils/supabase/` - Supabase client utilities
- `src/utils/octokit/` - GitHub API integration

## Code Style Guidelines

When coding, only write comments when the code is extremely difficult to understand by just reading the code. Only add comments in cases where the logic is genuinely complex or non-obvious. Otherwise, write plain code without comments (following clean code methodology).

Never use the `any` type in TypeScript. Always use proper type definitions, interfaces, or union types to maintain type safety.

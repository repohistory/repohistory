# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Repohistory is a Next.js web application that provides an open-source dashboard for tracking GitHub repository traffic history beyond the default 14-day limit. The application integrates with GitHub OAuth and Supabase for authentication and data persistence.

## Development Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production application
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Key Components Structure
- `src/app/(dashboard)/` - Protected dashboard pages
- `src/components/charts/` - Chart components using D3 and Recharts
- `src/components/repo/` - Repository-related UI components
- `src/components/ui/` - Shadcn/ui components (button, card, tooltip, etc.)
- `src/utils/supabase/` - Supabase client utilities
- `src/utils/octokit/` - GitHub API integration

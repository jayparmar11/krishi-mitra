# Krishi Mitra Project Summary

## Project Overview
Full-stack monorepo template with authentication & AI chatbot capabilities. Built for Windows development environment.

## Architecture
Monorepo Structure: Turbo + PNPM workspace
- `apps/native` - React Native (Expo)
- `apps/server` - Hono API server  
- `apps/web` - Next.js web app

## Tech Stack

### Native App (`apps/native`)
- Framework: React Native 0.79.1 + Expo 53
- Styling: NativeWind (Tailwind for RN)
- Navigation: Expo Router + React Navigation
- State: TanStack Query + React Form
- Icons: Lucide React Native

### Server (`apps/server`)
- Runtime: Bun
- Framework: Hono 4.8.2
- Database: MongoDB + Mongoose 8.14.0
- Auth: Better Auth 1.3.4 + MongoDB adapter
- AI: Vercel AI SDK + Google AI
- Type Safety: oRPC 1.5.0 + Zod 4.0.2

### Web App (`apps/web`)
- Framework: Next.js 15.3.0 + Turbopack
- Styling: Tailwind CSS 4.1.10
- UI: Radix UI + Shadcn/ui components
- State: TanStack Query + React Form
- Theme: Next Themes
- AI: Vercel AI SDK React

## Key Features
- Authentication: Better Auth with email/password, Expo support
- Type Safety: oRPC for end-to-end type safety across all apps
- Database: MongoDB with Docker Compose setup
- AI Integration: Chatbot functionality with Google AI
- Development: Hot reload, TUI, lint-staged with Husky

## Database Setup
MongoDB via Docker Compose:
- Container: `krishi-mitra-mongodb`
- Port: 27017
- Credentials: root/password
- Database: krishi-mitra

## Scripts
- `pnpm dev` - Start all apps
- `pnpm dev:native/web/server` - Start specific app
- `pnpm db:start/stop/watch/down` - MongoDB container management

## File Structure Notes
- Auth context shared via oRPC procedures (public/protected)
- Better Auth session management across native/web
- Shared types via TypeScript workspace references
- Environment variables per app (.env files)

---

act as full stack developer know all about AI and react, react-native and its all libraries.

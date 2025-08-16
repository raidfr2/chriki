# Overview

This is a full-stack web application built with Express.js backend and React frontend. The project uses a monorepo structure with shared TypeScript schemas and follows modern development practices. The application appears to be in early development stages with basic contact form functionality and a simple user system.

# User Preferences

Preferred communication style: Simple, everyday language.
Suggestions feature: Make suggestions sound like the user is asking Chriki questions, not like suggestions from Chriki. Use natural Algerian Darija phrasing that sounds authentic.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for development and production
- **Chat Features**: Progressive message chunking, RTL Arabic support, AI-generated follow-up suggestions

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints with `/api` prefix
- **AI Integration**: Google Gemini API with hardcoded API key (AIzaSyCSVcstOgN6aNSaoVigFyDn2FZFQF2dhZk)
- **Session Management**: Removed - stateless operation
- **Database**: Removed to simplify architecture

## Data Storage
- **Storage**: Local storage for conversation history
- **Database**: Removed to simplify the application architecture
- **User Profiles**: Removed - no longer tracking user information

## Development Setup
- **Monorepo Structure**: Shared code in `/shared`, client in `/client`, server in `/server`
- **Hot Reloading**: Vite dev server with HMR for frontend
- **Development Server**: Express server with TypeScript compilation via tsx
- **Path Aliases**: Configured for clean imports (`@/` for client, `@shared/` for shared code)

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Uses `@neondatabase/serverless` driver for edge compatibility

## UI and Styling
- **Shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Low-level UI primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Replit Integration**: Custom Vite plugins for Replit environment
- **TypeScript**: Full type safety across the stack
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

## Runtime Dependencies
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form handling with performance optimization
- **Date-fns**: Date manipulation utilities
- **Class Variance Authority**: Type-safe CSS class variants
- **Wouter**: Lightweight routing library
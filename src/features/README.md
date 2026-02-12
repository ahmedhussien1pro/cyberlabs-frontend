# Features Module

Feature-based architecture - each feature is self-contained.

## ?? Features

- `auth/` - Authentication (login, register, verification)
- `courses/` - Course management and viewing
- `profile/` - User profiles
- `dashboard/` - User dashboard
- `website/` - Public website pages

## ??? Feature Structure

Each feature contains:
- `components/` - Feature-specific components
- `hooks/` - Feature-specific hooks
- `pages/` - Route pages
- `services/` - API services
- `store/` - Feature state (Zustand)
- `schemas/` - Validation schemas (Zod)
- `types/` - Feature types

## ?? Best Practices

1. Keep features isolated
2. Share via `shared/` module
3. Use absolute imports (@/*)
4. Follow naming conventions

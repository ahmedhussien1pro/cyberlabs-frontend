# ?? CyberLabs Frontend V2 - Core Setup Plan

## Priority 1: Essential Configuration (?????? ??????)

### 1. API Client Layer ?
- [ ] src/core/api/client.ts - Axios instance configuration
- [ ] src/core/api/interceptors.ts - Request/Response interceptors
- [ ] src/core/api/endpoints.ts - API endpoint constants
- [ ] src/core/api/index.ts - Export all

### 2. Utilities ?
- [ ] src/shared/utils/storage.ts - LocalStorage/SessionStorage wrapper
- [ ] src/shared/utils/crypto.ts - Encryption utilities (using crypto-js)
- [ ] src/shared/utils/sanitize.ts - XSS protection (using DOMPurify)
- [ ] src/shared/utils/format.ts - Date/number formatting
- [ ] src/shared/utils/error-handler.ts - Global error handling
- [ ] src/shared/utils/validation.ts - Common validation helpers
- [ ] src/shared/utils/index.ts - Export all

### 3. i18n Configuration ?
- [ ] src/core/config/i18n.config.ts - i18next setup
- [ ] public/locales/en/common.json - English translations
- [ ] public/locales/ar/common.json - Arabic translations
- [ ] public/locales/en/auth.json
- [ ] public/locales/ar/auth.json

### 4. React Query Configuration ?
- [ ] src/core/config/query-client.config.ts - TanStack Query setup

### 5. Core Providers ?
- [ ] src/core/providers/query-provider.tsx - React Query provider
- [ ] src/core/providers/theme-provider.tsx - Dark/Light mode (next-themes)
- [ ] src/core/providers/i18n-provider.tsx - i18next provider
- [ ] src/core/providers/app-providers.tsx - Combine all providers
- [ ] src/core/providers/index.ts - Export all

### 6. Router Setup ?
- [ ] src/core/router/index.tsx - React Router v7 setup
- [ ] src/core/router/routes.tsx - Route definitions
- [ ] src/core/router/protected-route.tsx - Auth guard
- [ ] src/core/router/lazy-routes.tsx - Code splitting

### 7. Auth Store (Zustand) ?
- [ ] src/features/auth/store/auth.store.ts - Auth state management

### 8. Theme Store (Zustand) ?
- [ ] src/core/store/theme.store.ts - Theme state
- [ ] src/core/store/ui.store.ts - UI state (sidebar, modals, etc.)
- [ ] src/core/store/index.ts - Export all

### 9. Update Main Files ?
- [ ] src/main.tsx - Setup providers
- [ ] src/App.tsx - Setup router
- [ ] index.html - Add RTL support

---

## Priority 2: Feature Development (Team Tasks - Export to CSV)

### Auth Feature
### Courses Feature  
### Profile Feature
### Dashboard Feature
### Website/Landing Pages


cyberlabs-frontend/
├── public/
│   ├── locales/                    # ملفات الترجمة
│   │   ├── ar/
│   │   │   └── translation.json
│   │   └── en/
│   │       └── translation.json
│   └── assets/
│       └── images/
│           └── logo.svg
│
├── src/
│   ├── app/
│   │   ├── App.tsx                 # Main App Component
│   │   ├── router.tsx              # React Router Config
│   │   └── providers.tsx           # All Providers
│   │
│   ├── features/                   # Feature-based Modules
│   │   ├── auth/
│   │   │   ├── api/
│   │   │   │   └── authApi.ts
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── ForgotPasswordForm.tsx
│   │   │   │   └── TwoFactorAuthDialog.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useRegister.ts
│   │   │   │   └── useLogout.ts
│   │   │   ├── stores/
│   │   │   │   └── authStore.ts    # Zustand store
│   │   │   ├── types/
│   │   │   │   └── auth.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── labs/
│   │   │   ├── api/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/
│   │   │   └── types/
│   │   │
│   │   ├── courses/
│   │   ├── gamification/
│   │   ├── dashboard/
│   │   └── profile/
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ... (other shadcn components)
│   │   │
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Navigation.tsx
│   │   │   │   ├── ProfileDropdown.tsx
│   │   │   │   ├── GlobalSearch.tsx
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   ├── LanguageToggle.tsx
│   │   │   │   └── MobileMenu.tsx
│   │   │   ├── Footer/
│   │   │   │   └── Footer.tsx
│   │   │   ├── Sidebar/
│   │   │   │   └── Sidebar.tsx
│   │   │   └── DashboardLayout.tsx
│   │   │
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       ├── ProtectedRoute.tsx
│   │       ├── PageLoader.tsx
│   │       └── NotFound.tsx
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── axios.ts            # Axios instance + interceptors
│   │   │   ├── endpoints.ts        # API endpoints constants
│   │   │   └── queryClient.ts      # React Query config
│   │   │
│   │   ├── i18n/
│   │   │   ├── config.ts           # i18n configuration
│   │   │   ├── resources.ts        # Translation resources
│   │   │   └── useTranslation.ts   # Custom hook
│   │   │
│   │   ├── utils/
│   │   │   ├── cn.ts               # clsx + tailwind-merge
│   │   │   ├── formatters.ts       # Date, Number formatters
│   │   │   └── validators.ts       # Zod schemas
│   │   │
│   │   └── constants/
│   │       ├── routes.ts
│   │       ├── config.ts
│   │       └── enums.ts
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useTheme.ts
│   │   ├── useLanguage.ts
│   │   └── useOnClickOutside.ts
│   │
│   ├── stores/
│   │   ├── themeStore.ts           # Zustand: Dark/Light mode
│   │   ├── languageStore.ts        # Zustand: AR/EN
│   │   └── searchStore.ts          # Zustand: Global search
│   │
│   ├── types/
│   │   ├── api.types.ts
│   │   ├── common.types.ts
│   │   └── env.d.ts
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   └── animations.css
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LabsPage.tsx
│   │   ├── CoursesPage.tsx
│   │   ├── ProfilePage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── .env.example
├── .env.local
├── .gitignore
├── .prettierrc
├── components.json                 # shadcn config
├── eslint.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json

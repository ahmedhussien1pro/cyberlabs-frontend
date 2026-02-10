import { ReactNode, useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { I18nextProvider } from 'react-i18next'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/api/queryClient'
import i18n from '@/lib/i18n/config'
import { useThemeStore } from '@/stores/themeStore'
import { useLanguageStore } from '@/stores/languageStore'

interface ProvidersProps {
  children: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  const { theme } = useThemeStore()
  const { language } = useLanguageStore()

  // Initialize theme and language on mount
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = language
  }, [theme, language])

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </I18nextProvider>
    </QueryClientProvider>
  )
}

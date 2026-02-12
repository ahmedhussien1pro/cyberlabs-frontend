import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Logo } from "@/components/common/logo"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { LanguageSwitcher } from "@/components/common/language-switcher"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      {/* Background Pattern (CSS Only) */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Theme & Language Toggles */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="bg-card border shadow-2xl rounded-2xl p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {subtitle && (
              <p className="text-muted-foreground">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          <div>{children}</div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {t("common:app.tagline")}
        </p>
      </div>
    </div>
  )
}

export default AuthLayout

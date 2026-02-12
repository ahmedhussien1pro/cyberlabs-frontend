import { useTranslation } from "react-i18next"
import { AuthLayout } from "@/components/layout/auth-layout"
import { LoginForm } from "../components/login-form"

export default function LoginPage() {
  const { t } = useTranslation()

  return (
    <AuthLayout
      title={t("auth:login.title")}
      subtitle={t("auth:login.subtitle")}
    >
      <LoginForm />
    </AuthLayout>
  )
}

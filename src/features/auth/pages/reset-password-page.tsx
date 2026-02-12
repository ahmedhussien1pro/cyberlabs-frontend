import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ResetPasswordPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth:resetPassword.title")}</CardTitle>
          <CardDescription>{t("auth:resetPassword.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Reset password form coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

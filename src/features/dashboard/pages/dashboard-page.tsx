import { useTranslation } from "react-i18next"

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">{t("common:navigation.dashboard")}</h1>
      <p className="mt-4 text-muted-foreground">Dashboard coming soon...</p>
    </div>
  )
}

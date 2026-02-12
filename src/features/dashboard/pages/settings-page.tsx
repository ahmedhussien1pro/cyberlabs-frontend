import { useTranslation } from "react-i18next"

export default function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">{t("common:settings.title")}</h1>
      <p className="mt-4 text-muted-foreground">Settings page coming soon...</p>
    </div>
  )
}

import { useTranslation } from "react-i18next"

export default function CoursesListPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold">{t("common:navigation.courses")}</h1>
      <p className="mt-4 text-muted-foreground">Courses list coming soon...</p>
    </div>
  )
}

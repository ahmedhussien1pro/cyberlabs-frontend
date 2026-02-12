import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { MainLayout } from "@/components/layout/main-layout"
import { ROUTES } from "@/shared/constants"

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <MainLayout>
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-background p-8">
        <div className="text-center space-y-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground">
            {t("common:app.name")}
          </h1>
          <p className="text-2xl md:text-3xl text-primary font-semibold">
            {t("common:app.tagline")}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {t("common:app.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button size="lg" asChild>
              <Link to={ROUTES.COURSES.LIST}>Browse Courses</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={ROUTES.ABOUT}>Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

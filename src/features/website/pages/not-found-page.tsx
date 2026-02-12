import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/shared/constants"

export default function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-semibold">
        {t("errors:notFound")}
      </h2>
      <p className="mt-2 text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button asChild className="mt-8">
        <Link to={ROUTES.HOME}>
          {t("common:actions.back")} {t("common:navigation.home")}
        </Link>
      </Button>
    </div>
  )
}

import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Logo } from "@/components/common/logo"
import { ROUTES } from "@/shared/constants"

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              {t("common:app.description")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.HOME} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("common:navigation.home")}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.COURSES.LIST} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("common:navigation.courses")}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ABOUT} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("common:navigation.about")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={ROUTES.CONTACT} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("common:navigation.contact")}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRICING} className="text-muted-foreground hover:text-foreground transition-colors">
                  {t("common:navigation.pricing")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} {t("common:app.name")}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import { Suspense } from "react"
import { RouteObject } from "react-router-dom"
import * as Pages from "./lazy-routes"
import { ROUTES } from "@/shared/constants"
import { LoadingSpinner } from "@/components/common/loading-spinner"

const LazyPage = ({ Component }: { Component: React.LazyExoticComponent<() => JSX.Element> }) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
)

export const routes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: <LazyPage Component={Pages.HomePage} />,
  },
  
  // Test login WITHOUT ProtectedRoute
  {
    path: ROUTES.AUTH.LOGIN,
    element: <LazyPage Component={Pages.LoginPage} />,
  },
  
  {
    path: ROUTES.AUTH.REGISTER,
    element: <LazyPage Component={Pages.RegisterPage} />,
  },

  {
    path: "*",
    element: <LazyPage Component={Pages.NotFoundPage} />,
  },
]

export default routes

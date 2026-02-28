import { Navigate, Outlet, useLocation } from "react-router-dom"

export default function LabProtectedRoute() {
    const location = useLocation()

    const isLoggedIn =
        localStorage.getItem("lab_logged_in") === "true"

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/temp-lab/login"
                state={{ from: location }}
                replace
            />
        )
    }

    return <Outlet />
}
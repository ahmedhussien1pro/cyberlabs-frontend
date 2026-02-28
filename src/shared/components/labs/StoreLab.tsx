import { NavigationLab } from "./NavigationLab"
import { Outlet } from "react-router-dom"

export default function StoreLab() {
    return (
        <div className="min-h-screen flex flex-col bg-muted/20">
            <NavigationLab />
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    )
}
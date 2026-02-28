"use client"

import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const LOGIN_KEY = "lab_logged_in"

export function NavigationLab() {

    const loggedIn =
        typeof window !== "undefined" &&
        localStorage.getItem(LOGIN_KEY) === "true"

    const handleLogout = () => {
        localStorage.removeItem(LOGIN_KEY)
        window.location.reload()
    }

    return (
        <nav className="border-b bg-background">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/temp-lab" className="text-xl font-bold tracking-tight">
                    ShopZone
                </Link>

                <div className="flex items-center gap-6 text-sm">

                    <Link to="/temp-lab" className="hover:text-primary">
                        Shopping
                    </Link>

                    <Link to="/temp-lab/cart" className="hover:text-primary">
                        Cart
                    </Link>

                    <Link to="/temp-lab/account" className="hover:text-primary">
                        My Account
                    </Link>

                    {loggedIn ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    ) : (
                        <Link to="/temp-lab/login">
                            <Button size="sm">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
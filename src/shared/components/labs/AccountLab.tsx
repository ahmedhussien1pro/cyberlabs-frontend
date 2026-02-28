"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

const LOGIN_KEY = "lab_logged_in"

export default function MyAccountPageLab() {
    const navigate = useNavigate()

    const [user, setUser] = useState({
        name: "",
        email: "",
        balance: 0,
    })

    useEffect(() => {
        const loggedIn = localStorage.getItem(LOGIN_KEY) === "true"

        if (!loggedIn) {
            navigate("/temp-lab/login", { replace: true })
            return
        }

        const name = localStorage.getItem("lab_user_name") || "User"
        const email = localStorage.getItem("lab_user_email") || "user@example.com"
        const balance = parseFloat(
            localStorage.getItem("lab_user_balance") || "100"
        )

        setUser({ name, email, balance })
    }, [navigate])

    return (
        <div className="min-h-screen bg-muted/40 p-6">
            <div className="max-w-4xl mx-auto space-y-8">

                <h2 className="text-3xl font-bold tracking-tight">
                    My Account
                </h2>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                    </CardHeader>

                    <CardContent className="grid md:grid-cols-3 gap-6 items-center">

                        {/* Avatar */}
                        <div className="flex justify-center">
                            <Avatar className="h-32 w-32 text-4xl">
                                <AvatarFallback>
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* User Data */}
                        <div className="md:col-span-2 space-y-4">

                            <h3 className="text-2xl font-semibold">
                                Hello,{" "}
                                <span className="text-primary">
                                    {user.name}
                                </span>
                            </h3>

                            <Separator />

                            <div className="space-y-2 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Email
                                    </span>
                                    <span className="font-medium">
                                        {user.email}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Balance
                                    </span>
                                    <span className="font-semibold text-green-600">
                                        ${user.balance.toFixed(2)}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </CardContent>
                </Card>

                <footer className="text-center text-sm text-muted-foreground pt-8">
                    © 2025 CyberLabs. All rights reserved.
                </footer>

            </div>
        </div>
    )
}
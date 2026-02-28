import usersData from "./users1.json"
import { useEffect, useState } from "react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

type User = {
    id: string
    username: string
    password: string
}

const UsersPage = () => {
    const [users, setUsers] = useState<User[] | null>(null)

    useEffect(() => {
        setUsers(usersData)
    }, [])

    if (!users) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/40 p-6">
            <Card className="max-w-3xl mx-auto shadow-lg rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Users List
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Password</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Badge variant="secondary">{user.id}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {user.username}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.password}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default UsersPage
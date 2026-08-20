"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { EditUserItem } from "./EditUserItem";
import { User } from "@prisma/client";

export default function UserList({ users }: { users: User[] }) {
    const [filter, setFilter] = useState("");

    const filteredUsers = users.filter(
        (u) =>
            u.firstName.toLowerCase().includes(filter.toLowerCase()) ||
            u.lastName.toLowerCase().includes(filter.toLowerCase()) ||
            u.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div>
            <Input
                placeholder="Filter users..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mb-4"
            />

            <Table className="border-b-2">
                <TableHeader>
                    <TableRow className="bg-blue-600">
                        <TableHead>First Name</TableHead>
                        <TableHead>Last Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user, index) => (
                        <TableRow
                            key={user.id}
                            className={index % 2 === 0 ? "bg-bgBlue" : undefined}
                        >
                            <TableCell>{user.firstName}</TableCell>
                            <TableCell>{user.lastName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.employeeId ?? "-"}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <EditUserItem item={{
                                    id: user.id,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    employeeId: user.employeeId ?? "",
                                    role: user.role
                                }} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
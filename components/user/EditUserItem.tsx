"use client";

import toast from "react-hot-toast";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"; // shadcn/ui import
import { editUserItemAction } from "@/utils/actions";
import { Button } from "../ui/button";

export function EditUserItem({ item }: { item: { id: string; firstName: string; lastName: string; employeeId: string; role: string } }) {
    const handleSubmit = async (formData: FormData) => {
        const result = await editUserItemAction(item.id, formData);
        const parsedMessage = JSON.parse(result.message);
        if (parsedMessage.length == 2 && parsedMessage[1].result == 'success') {
            toast.success(parsedMessage[0].message);
        } else {
            toast.error(parsedMessage[0].message);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={<Button className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 rounded-md">Edit</Button>}
            />
            <AlertDialogContent className="bg-white border border-gray-200 rounded-lg p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold">Edit Rice Item</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-500">
                        Update the details below and save changes.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form action={handleSubmit} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Rice First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        defaultValue={item.firstName}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Rice Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        defaultValue={item.lastName}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <input
                        type="text"
                        name="employeeId"
                        defaultValue={item.employeeId}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        name="role"
                        defaultValue={item.role}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                        <option value="ADMIN">ADMIN</option>
                        <option value="USER">USER</option>
                        <option value="SUPERUSER">SUPERUSER</option>
                    </select>
                    <AlertDialogFooter className="flex flex-row gap-2">
                        <AlertDialogCancel className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogCancel
                            type="submit"
                            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                        // className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                        >
                            Save
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
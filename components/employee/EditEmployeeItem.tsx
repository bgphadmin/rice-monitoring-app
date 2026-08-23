"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"; // shadcn/ui import
import { deleteEmployeeItemAction, editEmployeeItemAction } from "@/utils/actions";
import LoadingButton from "../utils/LoadingButton";
import toast from "react-hot-toast";
import { useState } from "react";
import LoadingDeleteButton from "../utils/LoadingDeleteButton";
import { ConfirmDeleteDialog } from "../utils/ConfirmDeleteDialog";
import { Employee } from "@prisma/client";

export function EditEmployeeItem({
    item,
    open,
    onOpenChange,
    onEditSuccess,
    onDeleteSuccess, }: { item: Employee, open: boolean, onOpenChange: (open: boolean) => void, showTrigger?: boolean, onEditSuccess?: (updated: Employee) => void, onDeleteSuccess?: (deleteId: string) => void }) {

    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setSaving(true);
        const result = await editEmployeeItemAction(item.id, formData);
        const parsedMessage = JSON.parse(result.message);

        if (parsedMessage.length == 3 && parsedMessage[1].result == 'success') {
            toast.success(parsedMessage[0].message);
            const updatedRow: Employee = {
                ...item,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                employeeId: formData.get("employeeId") as string,
                phone: formData.get("phone") as string || null,
                active: formData.has("active"),
            };
            onOpenChange(false);
            onEditSuccess?.(updatedRow);
        } else {
            toast.error(parsedMessage[0].message);
        }

        setSaving(false);
    }

    const handleDelete = async () => {
        setDeleting(true);
        const result = await deleteEmployeeItemAction(item.id);
        const parsedMessage = JSON.parse(result.message);
        if (parsedMessage[1].result === "success") {
            toast.success(parsedMessage[0].message);
            onOpenChange(false);
            onDeleteSuccess?.(item.id);
        } else {
            toast.error(parsedMessage[0].message);
        }
        setDeleting(false);
    };
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="bg-background border border-gray-200 rounded-lg p-6">
                <form action={handleSubmit} className="space-y-4">
                    <label className="block text-sm font-medium text-foreground">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        defaultValue={item.firstName}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-foreground">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        defaultValue={item.lastName}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-foreground">Employee ID</label>
                    <input
                        type="text"
                        name="employeeId"
                        defaultValue={item.employeeId}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-foreground">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        defaultValue={item.phone || ""}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="active"
                            defaultChecked={item.active}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label className="text-sm font-medium text-foreground">Active</label>
                    </div>

                    <AlertDialogFooter className="flex flex-row gap-2">
                        <AlertDialogCancel className="flex-1 items-center justify-center gap-2 rounded-md bg-slate-500 px-6 py-2 text-white hover:bg-slate-700 disabled:opacity-50 shadow-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 h-11">
                            Cancel
                        </AlertDialogCancel>
                        <LoadingButton
                            loading={saving}
                            type="submit"
                            className="flex-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                        >
                            Save
                        </LoadingButton>
                        <ConfirmDeleteDialog
                            itemName={item.firstName + " " + item.lastName}
                            deleting={deleting}
                            onDelete={handleDelete}
                            trigger={
                                <LoadingDeleteButton
                                    loading={deleting}
                                    type="button"
                                    className="flex-1 h-11 rounded-md bg-red-600 text-white hover:bg-red-700 px-8"
                                >
                                    Delete
                                </LoadingDeleteButton>
                            }
                        />
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
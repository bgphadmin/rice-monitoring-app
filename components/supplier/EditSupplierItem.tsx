"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"; // shadcn/ui import
import { deleteSupplierItemAction, editSupplierItemAction } from "@/utils/actions";
import LoadingButton from "../utils/LoadingButton";
import toast from "react-hot-toast";
import { useState } from "react";
import LoadingDeleteButton from "../utils/LoadingDeleteButton";
import { ConfirmDeleteDialog } from "../utils/ConfirmDeleteDialog";
import { Supplier } from "@prisma/client";

export function EditSupplierItem({
    item,
    open,
    onOpenChange,
    onEditSuccess,
    onDeleteSuccess, }: { item: Supplier, open: boolean, onOpenChange: (open: boolean) => void, showTrigger?: boolean, onEditSuccess?: (updated: Supplier) => void, onDeleteSuccess?: (deleteId: string) => void }) {

    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setSaving(true);
        const result = await editSupplierItemAction(item.id, formData);
        const parsedMessage = JSON.parse(result.message);

        if (parsedMessage.length == 3 && parsedMessage[1].result == 'success') {
            toast.success(parsedMessage[0].message);
            const updatedRow: Supplier = {
                ...item,
                name: formData.get("name") as string,
                address: formData.get("address") as string || null,
                phone: formData.get("phone") as string || null,
                email: formData.get("email") as string || null,
                contact: formData.get("contact") as string || null
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
        const result = await deleteSupplierItemAction(item.id);
        const parsedMessage = JSON.parse(result.message);
        if (parsedMessage[1].result === "success") {
            toast.success(parsedMessage[0].message);
            onOpenChange(false);
            // Instead of updated row, you may want to trigger a refresh in parent
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
                    <label className="block text-sm font-medium text-foreground">Rice Variety</label>
                    <input
                        type="text"
                        name="name"
                        readOnly
                        defaultValue={item.name}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-foreground">Contact</label>
                    <input
                        type="text"
                        name="contact"
                        defaultValue={item.contact || ""}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-foreground">Address</label>
                    <input
                        type="text"
                        name="address"
                        defaultValue={item.address || ""}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-foreground">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        defaultValue={item.phone || ""}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-foreground">Email</label>
                    <input
                        type="text"
                        name="email"
                        defaultValue={item.email || ""}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />

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
                            itemName={item.name}
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
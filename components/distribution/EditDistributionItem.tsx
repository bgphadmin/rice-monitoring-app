"use client";

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
import { deleteDistributionItemAction, editDistributionAction, getRiceItem} from "@/utils/actions";
import { Button } from "../ui/button";
import LoadingButton from "../utils/LoadingButton";
import toast from "react-hot-toast";
import { useState } from "react";
import LoadingDeleteButton from "../utils/LoadingDeleteButton";
import { DistributionRow } from "@/utils/types";
import { revalidatePath } from "next/cache";

// export type DistributionRow = {
//     id: string
//     firstName: string
//     lastName: string
//     employeeId: string
//     rice: {
//         name: string
//     }
//     quantityKg: number
//     comment: string | null
//     dateGiven: string
//     createdBy: {
//         firstName: string
//         lastName: string
//     }
// }

export type RiceOption = {
    id: string
    name: string
};


export function EditDistributionItem({
    item,
    open,
    onOpenChange,
    onEditSuccess,
    onDeleteSuccess,
    riceOptions }: { item: { id: string; firstName: string; lastName: string; employeeId: string; rice: { id: string; name: string; }; quantityKg: number; dateGiven: string; createdBy: { firstName: string; lastName: string; }; comment: string | null; }, open: boolean, onOpenChange: (open: boolean) => void, showTrigger?: boolean, onEditSuccess?: (updated: DistributionRow) => void, onDeleteSuccess?: (deleteId: string) => void, riceOptions: RiceOption[] }) {

    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setSaving(true);
        const result = await editDistributionAction(item.id, formData);
        const parsedMessage = JSON.parse(result.message);

        if (parsedMessage.length == 3 && parsedMessage[1].result == 'success') {
            toast.success(parsedMessage[0].message);
            const riceItem = await getRiceItem(formData.get("riceId") as string);
            const updatedRow: DistributionRow = {
                ...item,
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                employeeId: formData.get("employeeId") as string,
                rice: {
                    name: riceItem?.name as string,
                    id: formData.get("riceId") as string
                },
                quantityKg: Number(formData.get("quantityKg")),
                dateGiven: formData.get("dateGiven") as string,
                comment: formData.get("comment") as string || null,
            };
            onOpenChange(false);
            onEditSuccess?.(updatedRow);
            revalidatePath("/distribution");
        } else {
            toast.error(parsedMessage[0].message);
        }
        setSaving(false);
    }

    const handleDelete = async () => {
        setDeleting(true);
        const result = await deleteDistributionItemAction(item.id);
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
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        defaultValue={item.firstName}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
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
                    <label className="block text-sm font-medium text-gray-700"> Rice Variety</label>
                    <select
                        name="riceId"
                        defaultValue={item.rice.id}
                        id="name"
                        // id="name"
                        required
                        className="flex h-11 w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                        <option value="">Select a rice variety</option>
                        {riceOptions.map((rice) => (
                            <option key={rice.id} value={rice.id}>
                                {rice.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="quantityKg"
                        defaultValue={item.quantityKg}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Date Given</label>
                    <input
                        type="date"
                        name="dateGiven"
                        // defaultValue={item.dateGiven}
                        defaultValue={
                            item.dateGiven
                                ? new Date(item.dateGiven).toISOString().split("T")[0]
                                : ""
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Comment</label>
                    <input
                        type="text"
                        name="comment"
                        defaultValue={item.comment || ""}
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
                        <LoadingDeleteButton
                            onClick={handleDelete}
                            loading={deleting}
                            type="button"
                            className="flex-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                        >
                            Delete
                        </LoadingDeleteButton>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
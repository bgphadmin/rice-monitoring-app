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
import { editRiceItemAction } from "@/utils/actions";
import { Button } from "../ui/button";
import LoadingButton from "../utils/LoadingButton";
import { InventoryRow } from "./InventoryGrid";
import toast from "react-hot-toast";


export function EditRiceItem({
    item,
    open,
    onOpenChange,
    onEditSuccess, }: { item: { id: string; name: string; stockKg: number; reorderLevel: number; comment: string | null; addedBy: { firstName: string; lastName: string; }; }, open: boolean, onOpenChange: (open: boolean) => void, showTrigger?: boolean, onEditSuccess?: (updated: InventoryRow) => void }) {

    const handleSubmit = async (formData: FormData) => {
        const result = await editRiceItemAction(item.id, formData);
        const parsedMessage = JSON.parse(result.message);

        if (parsedMessage.length == 3 && parsedMessage[1].result == 'success') {
            toast.success(parsedMessage[0].message);
            const updatedRow: InventoryRow = {
                ...item,
                name: formData.get("name") as string,
                stockKg: Number(formData.get("stockKg")),
                reorderLevel: Number(formData.get("reorderLevel")),
                comment: formData.get("comment") as string || null,
            };
            onOpenChange(false);
            onEditSuccess?.(updatedRow);
        } else {
            toast.error(parsedMessage[0].message);
        }
    }

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

                {/* <form action={async (formData: FormData) => {
                    await editRiceItemAction(item.id, formData);

                    const updatedRow: InventoryRow = {
                        ...item,
                        name: formData.get("name") as string,
                        stockKg: Number(formData.get("stockKg")),
                        reorderLevel: Number(formData.get("reorderLevel")),
                        comment: formData.get("comment") as string || null,
                    };
                    onOpenChange(false);
                    onEditSuccess?.(updatedRow); */}
                <form action={handleSubmit} className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Rice Variety</label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={item.name}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Stock (kg)</label>
                    <input
                        type="number"
                        step="0.25"
                        name="stockKg"
                        defaultValue={item.stockKg}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Reorder Level (kg)</label>
                    <input
                        type="number"
                        step="0.25"
                        name="reorderLevel"
                        defaultValue={item.reorderLevel}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    <label className="block text-sm font-medium text-gray-700">Comments</label>
                    <input
                        type="text"
                        name="comment"
                        defaultValue={item.comment || ""}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                    {/* <label className="block text-sm font-medium text-gray-700">Added By</label> */}
                    <input
                        hidden
                        type="text"
                        name="addedBy"
                        defaultValue={item.addedBy === null ? "" : `${item.addedBy.firstName} ${item.addedBy.lastName}`}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />

                    <AlertDialogFooter className="flex flex-row gap-2">
                        <AlertDialogCancel className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                            Cancel
                        </AlertDialogCancel>
                        <LoadingButton >
                            Save
                        </LoadingButton>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
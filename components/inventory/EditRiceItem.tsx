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
import { editRiceItemAction } from "@/utils/actions";
import { Button } from "../ui/button";

export function EditRiceItem({ item }: { item: { id: string; name: string; stockKg: number; reorderLevel: number; comment: string } }) {
    const handleSubmit = async (formData: FormData) => {
        const result = await editRiceItemAction(item.id, formData);
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
                        defaultValue={item.comment}
                        className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />

                    <AlertDialogFooter className="flex flex-row gap-2">
                        <AlertDialogCancel className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogCancel
                            type="submit"
                            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                        >
                            Save
                        </AlertDialogCancel>
                        {/* <LoadingButton loading={loading}>
                            Add Distribution
                        </LoadingButton> */}
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
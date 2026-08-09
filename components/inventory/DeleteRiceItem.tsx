"use client";

import { deleteRiceItemAction } from "@/utils/actions";
import toast from "react-hot-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { IconButton } from "../utils/Buttons";
import FormContainer from "../utils/FormContainer";
import { Button } from "../ui/button";

export function DeleteRiceItem({ id, riceName }: { id: string; riceName?: string }) {
    const handleDelete = async () => {
        try {
            const result = await deleteRiceItemAction(id);
            if (result.success) {
                toast.success("Rice item deleted successfully!");
                return { message: "Rice item deleted successfully!" };
            } else {
                const errorMessage = result.error || "Error deleting rice item";
                toast.error(errorMessage);
                return { message: errorMessage };
            }
        } catch (error) {
            console.error("Error deleting rice item:", error);
            const errorMessage = "Error deleting rice item";
            toast.error(errorMessage);
            return { message: errorMessage };
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger
                render={<Button className="bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 rounded-md">Delete</Button>}
            />
            <AlertDialogContent className="bg-white border border-gray-200 rounded-lg p-6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold">
                        Delete {riceName}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-gray-500">
                        Are you sure you want to delete this rice item? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <FormContainer action={handleDelete}>
                    <AlertDialogFooter className="flex flex-row gap-2">
                        <AlertDialogCancel className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction type="submit" className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </FormContainer>
            </AlertDialogContent>
        </AlertDialog>

    );
}
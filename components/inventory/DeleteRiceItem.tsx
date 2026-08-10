"use client";

import { deleteRiceItemAction } from "@/utils/actions";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import FormContainer from "../utils/FormContainer";
import LoadingButton from "../utils/LoadingButton";
import { Button } from "../ui/button";

export function DeleteRiceItem({ id, riceName }: { id: string; riceName?: string }) {
    // deletion handled by server action via FormContainer

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
                <FormContainer action={deleteRiceItemAction}>
                    {({ loading }) => (
                        <>
                            <input type="hidden" name="id" value={id} />
                            <AlertDialogFooter className="flex flex-row gap-2">
                                <AlertDialogCancel className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300">
                                    Cancel
                                </AlertDialogCancel>
                                <LoadingButton loading={loading}>
                                    Delete
                                </LoadingButton>
                            </AlertDialogFooter>
                        </>
                    )}
                </FormContainer>
            </AlertDialogContent>
        </AlertDialog>

    );
}
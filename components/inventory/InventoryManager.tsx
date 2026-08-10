"use client"

import * as React from "react"
import InventoryGrid, { type InventoryRow } from "@/components/inventory/InventoryGrid"
import AddInvetoryButton from "@/components/inventory/AddInventoryButton"
import FormContainer from "@/components/utils/FormContainer"
import LoadingButton from "@/components/utils/LoadingButton"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addRiceItem } from "@/utils/actions"

interface InventoryManagerProps {
    initialRows: InventoryRow[]
}

const defaultFormState = {
    name: "",
    stockKg: "",
    reorderLevel: "",
    comment: "",
}

export default function InventoryManager({ initialRows }: InventoryManagerProps) {
    const [rows, setRows] = React.useState<InventoryRow[]>(initialRows)
    const [formValues, setFormValues] = React.useState(defaultFormState)

    const handleFormChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddSuccess = (state: { message: string }) => {
        const parsed = JSON.parse(state.message)
        const inventory = parsed[2]?.inventory as InventoryRow | undefined
        if (inventory) {
            setRows((prev) => [inventory, ...prev])
            setFormValues(defaultFormState)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-blue-700">Rice Inventory Items</h2>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger render={<AddInvetoryButton className="w-full sm:w-auto bg-blue-300 py-7 text-lg rounded-md shadow-xl" />}>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold">Add Rice Variety</AlertDialogTitle>
                        </AlertDialogHeader>
                        <FormContainer action={addRiceItem} onSuccess={handleAddSuccess}>
                            {({ loading }) => (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Variety</label>
                                            <Input name="name" value={formValues.name} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Stock (kg)</label>
                                            <Input type="number" step="0.5" name="stockKg" value={formValues.stockKg} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Reorder Level</label>
                                            <Input type="number" step="0.5" name="reorderLevel" value={formValues.reorderLevel} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-slate-700">Comment</label>
                                            <Textarea name="comment" value={formValues.comment} onChange={handleFormChange} rows={3} />
                                        </div>
                                    </div>
                                    <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-2">
                                        <AlertDialogCancel className="rounded bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
                                            Cancel
                                        </AlertDialogCancel>
                                        <LoadingButton loading={loading}>
                                            Add Rice
                                        </LoadingButton>
                                    </AlertDialogFooter>
                                </>
                            )}
                        </FormContainer>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <InventoryGrid inventory={rows} />
        </div>
    )
}

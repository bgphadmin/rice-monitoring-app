"use client"

import * as React from "react"
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
import { addStockLogAction } from "@/utils/actions"
import StockLogGrid from "./StockLogGrid"
import { StockLog } from "@/utils/types"
import AddStockLogButton from "./AddStockLogButton"

interface RiceOption {
    name: string
    id: string
}

interface StockLogManagerProps {
    initialRows: StockLog[]
    riceOptions: RiceOption[]
}

const defaultFormState = {
    riceId: "",
    quantityKg: 0,
    action: "ADD",
    comment: "",
}

export default function StockLogManager({ initialRows, riceOptions = [] }: StockLogManagerProps) {
    const [rows, setRows] = React.useState<StockLog[]>(initialRows)
    const [formValues, setFormValues] = React.useState(defaultFormState)
    // const [selectedRow, setSelectedRow] = React.useState<StockLog | null>(null);

    const handleFormChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddSuccess = (state: { message: string }) => {
        const parsed = JSON.parse(state.message)
        const stockLog = parsed[2]?.result as StockLog | undefined
        if (stockLog) {
            setRows((prev) => [stockLog, ...prev])
            setFormValues(defaultFormState)
        }
    }

    // const handleEditSuccess = (updated: StockLog) => {
    //     setRows((prev) =>
    //         prev.map((row) => row.id === updated.id ? updated : row)
    //     );
    //     setSelectedRow(null);
    // };

    // const handleDeleteSuccess = (deletedId: string) => {
    //     setRows((prev) => prev.filter((row) => row.id !== deletedId)); // ✅ remove row
    //     setSelectedRow(null);
    //     // router.refresh();
    // };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-700">Stock Logs</h2>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger render={<AddStockLogButton className="w-full sm:w-auto bg-slate-300 py-7 text-lg rounded-md shadow-xl" />}>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold">Add Rice Stock</AlertDialogTitle>
                        </AlertDialogHeader>
                        <FormContainer action={addStockLogAction} onSuccess={handleAddSuccess}>
                            {({ loading }) => (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Rice Variety</label>
                                            <select
                                                name="riceId"
                                                value={formValues.riceId}
                                                onChange={handleFormChange}
                                                required
                                                className="flex h-11 w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            >
                                                <option value="">Select a rice option</option>
                                                {riceOptions.map((rice) => (
                                                    <option key={rice.id} value={rice.id}>
                                                        {rice.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Quantity (kg)</label>
                                            <Input type="number" step="0.5" name="quantityKg" value={formValues.quantityKg} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Action</label>
                                            <select
                                                name="action"
                                                value={formValues.action}
                                                onChange={handleFormChange}
                                                required
                                                className="flex h-11 w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            >
                                                <option value="">ADD/REMOVE</option>
                                                {["ADD", "REMOVE"].map((action) => (
                                                    <option key={action} value={action}>
                                                        {action}
                                                    </option>
                                                ))}
                                            </select>
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
                                            Submit
                                        </LoadingButton>
                                    </AlertDialogFooter>
                                </>
                            )}
                        </FormContainer>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <StockLogGrid
                stockLog={rows}
                // onRowClick={(row) => setSelectedRow(row)} // row click opens dialog 
            />

            {/* {selectedRow && (
                <EditStockLog
                    item={ { item: selectedRow } }
                    open={true}
                    onOpenChange={(open) => !open && setSelectedRow(null)}
                    onEditSuccess={handleEditSuccess}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )} */}
        </div>
    )
}

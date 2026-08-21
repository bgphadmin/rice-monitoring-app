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
import { addStockLogAction, getStockLogs } from "@/utils/actions"
import StockLogGrid from "./StockLogGrid"
import AddStockLogButton from "./AddStockLogButton"
import { StockLog } from "@/utils/types"

interface RiceOption {
    name: string
    id: string
}

interface StockLogManagerProps {
    initialRows: StockLog[]
    riceOptions: RiceOption[]
    supplierOptions: { name: string; id: string }[]
    total: number
}

const defaultFormState = {
    riceId: "",
    quantityKg: 0,
    supplierId: "",
    price: 0,
    action: "ADD",
    comment: "",
}

export default function StockLogManager({ initialRows, riceOptions = [], total, supplierOptions = [] }: StockLogManagerProps) {
    const [rows, setRows] = React.useState<StockLog[]>(initialRows)
    const [formValues, setFormValues] = React.useState(defaultFormState)
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

    // NEW: date range state
    const [startDate, setStartDate] = React.useState<string>("")
    const [endDate, setEndDate] = React.useState<string>("")
    const [globalFilter, setGlobalFilter] = React.useState("")

    React.useEffect(() => {
        async function fetchPage() {
            const { safeRows } = await getStockLogs(
                pagination.pageIndex,
                pagination.pageSize,
                startDate ? new Date(startDate) : undefined,
                endDate ? new Date(endDate) : undefined
            )
            setRows(
                safeRows.map((record) => ({
                    id: record.id,
                    riceId: record.riceId,
                    rice: { name: record.rice.name, id: record.rice.id },
                    price: record.price,
                    supplierId: record.supplierId as string,
                    supplier: { name: record.supplier.name, id: record.supplier.id },
                    quantityKg: record.quantityKg,
                    action: record.action,
                    comment: record.comment || null || undefined,
                    createdAt: record.createdAt,
                    createdById: record.createdById,
                    createdBy: {
                        firstName: record.createdBy.firstName,
                        lastName: record.createdBy.lastName,
                    },
                }))
            )
        }
        fetchPage()
    }, [pagination, startDate, endDate])

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-700">Stock Logs</h2>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger render={<AddStockLogButton className="w-full sm:w-auto bg-bgSlate py-7 text-lg rounded-md shadow-xl" />}>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-background border border-gray-200 rounded-2xl p-6 shadow-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold">Add Rice Stock</AlertDialogTitle>
                        </AlertDialogHeader>
                        <FormContainer action={addStockLogAction} onSuccess={handleAddSuccess}>
                            {({ loading }) => (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Rice Variety</label>
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
                                            <label className="text-sm font-medium text-foreground">Quantity (kg)</label>
                                            <Input type="number" step="0.5" name="quantityKg" min="1" value={formValues.quantityKg} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Supplier</label>
                                            <select
                                                name="supplierId"
                                                value={formValues.supplierId}
                                                onChange={handleFormChange}
                                                required
                                                className="flex h-11 w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            >
                                                <option value="">Select a supplier</option>
                                                {supplierOptions.map((supplier) => (
                                                    <option key={supplier.id} value={supplier.id}>
                                                        {supplier.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-slate-700">Price (Kg)</label><label className="text-sm font-medium text-slate-700"></label>
                                            <Input type="number" step="0.5" name="price" min="1" value={formValues.price} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Add/Remove</label>
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

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                {/* Global text filter */}
                <Input
                    placeholder="Filter stock logs..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-md"
                />
                <div className="flex items-center gap-2">
                    {/* Date range filter */}
                    <label>From</label>
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full sm:w-40"
                    />
                    <label>To</label>
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full sm:w-40"
                    />
                    {/* Clear button */}
                    <button
                        onClick={() => {
                            setStartDate("")
                            setEndDate("")
                        }}
                        className="px-3 py-1 rounded bg-background shadow-lg text-sm hover:bg-slate-300"
                    >
                        Clear
                    </button>
                </div>
            </div>
            <StockLogGrid
                stockLog={rows}
                total={total}
                pagination={pagination}
                onPaginationChange={setPagination}
                globalFilter={globalFilter} // 👈 new prop
            />
        </div>
    )
}

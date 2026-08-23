"use client"

import * as React from "react"
import DistributionGrid, { type DistributionRow } from "@/components/distribution/DistributionGrid"
import DistributeRiceButton from "@/components/distribution/DistributeRiceButton"
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
import { addDistributionAction, getDistributionsPerPage } from "@/utils/actions"
import { EditDistributionItem } from "./EditDistributionItem"
import { SortingState } from "@tanstack/react-table"

interface RiceOption {
    id: string
    name: string
}

interface EmployeeOption {
    id: string
    firstName: string
    lastName: string
}

interface DistributionManagerProps {
    initialRows: DistributionRow[]
    riceOptions: RiceOption[]
    employeeOptions: EmployeeOption[]
    total: number
}

const defaultFormState = {
    firstName: "",
    lastName: "",
    employeeId: "",
    riceId: "",
    quantityKg: "",
    comment: "",
    dateGiven: new Date().toISOString().slice(0, 10),
}

export default function DistributionManager({ initialRows, riceOptions, employeeOptions, total }: DistributionManagerProps) {
    const [rows, setRows] = React.useState<DistributionRow[]>(initialRows)
    const [formValues, setFormValues] = React.useState(defaultFormState)
    const [selectedRow, setSelectedRow] = React.useState<DistributionRow | null>(null);

    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [startDate, setStartDate] = React.useState("")
    const [endDate, setEndDate] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [totalCount, setTotalCount] = React.useState(total)

    React.useEffect(() => {
        async function fetchPage() {
            try {
                setLoading(true); setError(null)
                const { safeRows, total } = await getDistributionsPerPage({
                    pageIndex: pagination.pageIndex,
                    pageSize: pagination.pageSize,
                    q: globalFilter, startDate, endDate, sort: sorting,
                })
                setRows(safeRows.map(r => ({
                    id: r.id,
                    rice: { 
                        id: r.rice.id, 
                        name: r.rice.name 
                    },
                    employee: { 
                        id: r.employee.id, 
                        firstName: r.employee.firstname, 
                        lastName: r.employee.lastName 
                    },
                    quantityKg: r.quantityKg, comment: r.comment || "",
                    dateGiven: r.dateGiven,
                    createdBy: { 
                        firstName: r.createdBy.firstName, 
                        lastName: r.createdBy.lastName 
                    }
                })))
                setTotalCount(total)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message)
                } else {
                    setError("Unexpected error")
                }
            } finally { setLoading(false) }
        }
        fetchPage()
    }, [pagination, globalFilter, startDate, endDate, sorting])

    const handleFormChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddSuccess = (state: { message: string }) => {
        const parsed = JSON.parse(state.message)
        const distribution = parsed[2]?.distribution as DistributionRow | undefined
        console.log('distribution: ', distribution)
        if (distribution) {
            setRows((prev) => [distribution, ...prev])
            setFormValues(defaultFormState)
        }
    }

    const handleEditSuccess = (updated: DistributionRow) => {
        setRows((prev) =>
            prev.map((row) => row.id === updated.id ? updated : row)
        );
        setSelectedRow(null);
    };

    const handleDeleteSuccess = (deletedId: string) => {
        setRows((prev) => prev.filter((row) => row.id !== deletedId)); // ✅ remove row
        setSelectedRow(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-green-700">Employee Rice Distribution</h2>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger render={<DistributeRiceButton className="w-full sm:w-auto bg-bgGreen py-7 text-lg rounded-md shadow-xl" />}>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-background border border-gray-200 rounded-2xl p-6 shadow-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold">Add Rice Distribution</AlertDialogTitle>
                        </AlertDialogHeader>
                        <FormContainer action={addDistributionAction} onSuccess={handleAddSuccess}>
                            {({ loading }) => (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Employee Name</label>
                                            <select
                                                name="employeeId"
                                                value={formValues.employeeId}
                                                onChange={handleFormChange}
                                                required
                                                className="flex h-11 w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            >
                                                <option value="">Select employee</option>
                                                {employeeOptions.map((emp) => (
                                                    <option key={emp.id} value={emp.id}>
                                                        {emp.firstName + " " + emp.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Rice Variety</label>
                                            <select
                                                name="riceId"
                                                value={formValues.riceId}
                                                onChange={handleFormChange}
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
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Quantity (kg)</label>
                                            <Input
                                                name="quantityKg"
                                                type="number"
                                                min="1"
                                                value={formValues.quantityKg}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-foreground">Date Given</label>
                                            <Input name="dateGiven" type="date" value={formValues.dateGiven} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">Comment</label>
                                            <Textarea name="comment" value={formValues.comment} onChange={handleFormChange} rows={3} />
                                        </div>
                                    </div>
                                    <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-2">
                                        <AlertDialogCancel className="rounded bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
                                            Cancel
                                        </AlertDialogCancel>
                                        <LoadingButton loading={loading}>
                                            Add Distribution
                                        </LoadingButton>
                                    </AlertDialogFooter>
                                </>
                            )}
                        </FormContainer>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <Input placeholder="Search..." value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} className="max-w-md" />
                <div className="flex items-center gap-2">
                    <label>From</label>
                    <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <label>To</label>
                    <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    <button onClick={() => { setStartDate(""); setEndDate("") }} className="px-2 py-1 bg-background border border-gray-200 shadow-lg rounded text-sm">Clear</button>
                </div>
            </div>

            <DistributionGrid
                distributions={rows}
                total={totalCount}
                pagination={pagination}
                onPaginationChange={setPagination}
                onRowClick={row => setSelectedRow(row)}
                sorting={sorting}
                onSortingChange={setSorting}
            />
            {loading && <div className="text-sm text-slate-500">Loading…</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}

            {selectedRow && (
                <EditDistributionItem
                    item={selectedRow}
                    open={true}
                    onOpenChange={(open) => !open && setSelectedRow(null)}
                    onEditSuccess={handleEditSuccess}
                    onDeleteSuccess={handleDeleteSuccess}
                    riceOptions={riceOptions}
                />
            )}
        </div>
    )
}

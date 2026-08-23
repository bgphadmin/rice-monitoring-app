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
import { addEmployeeItem, getEmployeesPerPage, } from "@/utils/actions"
import { Employee } from "@prisma/client"
import { EditEmployeeItem } from "./EditEmployeeItem"
import AddEmployeeButton from "./AddEmployeeButton"
import EmployeeGrid from "./EmployeeGrid"

interface EmployeeManagerProps {
    initialRows: Employee[]
    total: number
}

const defaultFormState = {
    firstName: "",
    lastName: "",
    employeeId: "",
    active: true,
    phone: "",
}

export default function EmployeeManager({ initialRows, total }: EmployeeManagerProps) {
    const [rows, setRows] = React.useState<Employee[]>(initialRows)
    const [formValues, setFormValues] = React.useState(defaultFormState)
    const [selectedRow, setSelectedRow] = React.useState<Employee | null>(null);
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
    const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }[]>([])
    const [filter, setFilter] = React.useState("")

    React.useEffect(() => {
        async function fetchPage() {
            const { safeRows } = await getEmployeesPerPage({
                pageIndex: pagination.pageIndex,
                pageSize: pagination.pageSize,
                q: filter,
                sort: sorting,
            })
            setRows(safeRows)
        }
        fetchPage()
    }, [pagination, sorting, filter])

    const handleFormChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddSuccess = (state: { message: string }) => {
        const parsed = JSON.parse(state.message)
        const employee = parsed[2]?.employee as Employee | undefined
        if (employee) {
            setRows((prev) => [employee, ...prev])
            setFormValues(defaultFormState)
        }
    }

    const handleEditSuccess = (updated: Employee) => {
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
                    <h2 className="text-2xl font-bold text-blue-700">Employees</h2>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger render={<AddEmployeeButton className="w-full sm:w-auto bg-bgBlue py-7 text-lg rounded-md shadow-xl" />}>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-background border border-gray-200 rounded-2xl p-6 shadow-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg text font-semibold">Add Employee</AlertDialogTitle>
                        </AlertDialogHeader>
                        <FormContainer action={addEmployeeItem} onSuccess={handleAddSuccess}>
                            {({ loading }) => (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">First Name</label>
                                            <Input name="firstName" value={formValues.firstName} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">Last Name</label>
                                            <Input name="lastName" value={formValues.lastName} onChange={handleFormChange} />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">Employee ID</label>
                                            <Input type="text" name="employeeId" value={formValues.employeeId} onChange={handleFormChange} />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">Phone</label>
                                            <Input type="tel" name="phone" value={formValues.phone} onChange={handleFormChange} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="active"
                                                defaultChecked
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label className="text-sm font-medium text-foreground">Active</label>
                                        </div>
                                    </div>

                                    <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-2">
                                        <AlertDialogCancel className="rounded bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
                                            Cancel
                                        </AlertDialogCancel>
                                        <LoadingButton loading={loading}>
                                            Add Employee
                                        </LoadingButton>
                                    </AlertDialogFooter>
                                </>
                            )}
                        </FormContainer>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <EmployeeGrid
                employees={rows}
                onRowClick={(row) => setSelectedRow(row)}
                total={total}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                filter={filter}
                onFilterChange={setFilter}
            />

            {selectedRow && (
                <EditEmployeeItem
                    item={selectedRow}
                    open={true}
                    onOpenChange={(open) => !open && setSelectedRow(null)}
                    onEditSuccess={handleEditSuccess}
                    onDeleteSuccess={handleDeleteSuccess}
                />
            )}
        </div>
    )
}

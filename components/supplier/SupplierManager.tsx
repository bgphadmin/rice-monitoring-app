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
import { addSupplierItem, getSuppliersPerPage } from "@/utils/actions"
import { Supplier } from "@prisma/client"
import SupplierGrid from "./SupplierGrid"
import { EditSupplierItem } from "./EditSupplierItem"
import AddSupplierButton from "./AddSupplierButton"

interface SupplierManagerProps {
    initialRows: Supplier[]
    total: number
}

const defaultFormState = {
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
}

export default function SupplierManager({ initialRows, total }: SupplierManagerProps) {
    const [rows, setRows] = React.useState<Supplier[]>(initialRows)
    const [formValues, setFormValues] = React.useState(defaultFormState)
    const [selectedRow, setSelectedRow] = React.useState<Supplier | null>(null);
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

    React.useEffect(() => {
        async function fetchPage() {
            const { safeRows } = await getSuppliersPerPage(pagination.pageIndex, pagination.pageSize)
            setRows(safeRows.map((record) => ({
                id: record.id,
                name: record.name,
                contact: record.contact,
                phone: record.phone,
                email: record.email,
                address: record.address,
                createdAt: new Date(),
                updatedAt: new Date(),
            })))
        }
        fetchPage()
    }, [pagination])

    const handleFormChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddSuccess = (state: { message: string }) => {
        const parsed = JSON.parse(state.message)
        const supplier = parsed[2]?.supplier as Supplier | undefined
        if (supplier) {
            setRows((prev) => [supplier, ...prev])
            setFormValues(defaultFormState)
        }
    }

    const handleEditSuccess = (updated: Supplier) => {
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
                    <h2 className="text-2xl font-bold text-blue-700">Suppliers</h2>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger render={<AddSupplierButton className="w-full sm:w-auto bg-bgBlue py-7 text-lg rounded-md shadow-xl" />}>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-background border border-gray-200 rounded-2xl p-6 shadow-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg text font-semibold">Add Supplier</AlertDialogTitle>
                        </AlertDialogHeader>
                        <FormContainer action={addSupplierItem} onSuccess={handleAddSuccess}>
                            {({ loading }) => (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">Supplier Name</label>
                                            <Input name="name" value={formValues.name} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">Contact</label>
                                            <Input name="contact" value={formValues.contact} onChange={handleFormChange} />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">Phone</label>
                                            <Input type="tel" name="phone" value={formValues.phone} onChange={handleFormChange} />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">Email</label>
                                            <Input type="email" name="email" value={formValues.email} onChange={handleFormChange} />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <label className="text-sm font-medium text-foreground">Address</label>
                                            <Input name="address" value={formValues.address} onChange={handleFormChange} />
                                        </div>
                                    </div>
                                    <AlertDialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end mt-2">
                                        <AlertDialogCancel className="rounded bg-slate-100 px-4 py-2 text-sm text-slate-700 hover:bg-slate-200">
                                            Cancel
                                        </AlertDialogCancel>
                                        <LoadingButton loading={loading}>
                                            Add Supplier
                                        </LoadingButton>
                                    </AlertDialogFooter>
                                </>
                            )}
                        </FormContainer>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <SupplierGrid
                suppliers={rows}
                onRowClick={(row) => setSelectedRow(row)}
                total={total}
                pagination={pagination}
                onPaginationChange={setPagination}
            />

            {selectedRow && (
                <EditSupplierItem
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

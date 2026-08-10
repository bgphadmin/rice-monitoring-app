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
import { addDistributionAction } from "@/utils/actions"

interface RiceOption {
    id: string
    name: string
}

interface DistributionManagerProps {
    initialRows: DistributionRow[]
    riceOptions: RiceOption[]
}

const defaultFormState = {
    firstName: "",
    lastName: "",
    employeeId: "",
    riceName: "",
    quantityKg: "",
    comment: "",
    dateGiven: new Date().toISOString().slice(0, 10),
}

export default function DistributionManager({ initialRows, riceOptions }: DistributionManagerProps) {
    const [rows, setRows] = React.useState<DistributionRow[]>(initialRows)
    const [formValues, setFormValues] = React.useState(defaultFormState)

    const handleFormChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddSuccess = (state: { message: string }) => {
        const parsed = JSON.parse(state.message)
        const distribution = parsed[2]?.distribution as DistributionRow | undefined
        if (distribution) {
            setRows((prev) => [distribution, ...prev])
            setFormValues(defaultFormState)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-green-700">Employee Rice Distribution</h2>
                </div>
                <AlertDialog>
                    <AlertDialogTrigger render={<DistributeRiceButton className="w-full sm:w-auto bg-green-300 py-7 text-lg rounded-md shadow-xl" />}>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold">Add Distribution</AlertDialogTitle>
                        </AlertDialogHeader>
                        <FormContainer action={addDistributionAction} onSuccess={handleAddSuccess}>
                            {({ loading }) => (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">First Name</label>
                                            <Input name="firstName" value={formValues.firstName} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Last Name</label>
                                            <Input name="lastName" value={formValues.lastName} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Employee ID</label>
                                            <Input name="employeeId" value={formValues.employeeId} onChange={handleFormChange} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Rice Variety</label>
                                            <select
                                                name="riceName"
                                                value={formValues.riceName}
                                                onChange={handleFormChange}
                                                required
                                                className="flex h-11 w-full rounded-xl border border-input bg-input/30 px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            >
                                                <option value="">Select a rice variety</option>
                                                {riceOptions.map((rice) => (
                                                    <option key={rice.id} value={rice.name}>
                                                        {rice.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">Quantity (kg)</label>
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
                                            <label className="text-sm font-medium text-slate-700">Date Given</label>
                                            <Input name="dateGiven" type="date" value={formValues.dateGiven} onChange={handleFormChange} required />
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
                                            Add Distribution
                                        </LoadingButton>
                                    </AlertDialogFooter>
                                </>
                            )}
                        </FormContainer>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <DistributionGrid distributions={rows} />
        </div>
    )
}

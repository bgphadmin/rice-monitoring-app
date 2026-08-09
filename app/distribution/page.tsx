import DistributionGrid, { DistributionRow } from "@/components/distribution/DistributionGrid"
import { getDistributions } from "@/utils/actions"
import SkeletonTable from "@/components/utils/SkeletonTable"
import { Suspense } from "react"
import verifyUser from "@/utils/userValidation"
import { redirect } from "next/navigation"


const DistributionPage = async () => {
    const isSuperuser = await verifyUser("SUPERUSER");
    const isAdmin = await verifyUser("ADMIN");
    if (!isSuperuser && !isAdmin) return redirect('/');

    const distributions = await getDistributions()

    const rows: DistributionRow[] = distributions.map((record) => ({
        id: record.id,
        firstName: record.firstName,
        lastName: record.lastName,
        employeeId: record.employeeId,
        rice: {
            name: record.rice.name,
        },
        quantityKg: record.quantityKg,
        comment: record.comment,
        dateGiven: record.dateGiven.toISOString(),
        createdBy: {
            firstName: record.createdBy.firstName,
            lastName: record.createdBy.lastName,
        },
    }))

    return (
        <section className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-green-700">Employee Rice Distribution</h2>
                    <p className="max-w-2xl text-sm text-slate-600">
                        Review and manage rice distributions with sorting and filtering directly in the grid.
                    </p>
                </div>
            </div>

            <Suspense fallback={<SkeletonTable />}>
                <DistributionGrid distributions={rows} />
            </Suspense>
        </section>
    )
}

export default DistributionPage

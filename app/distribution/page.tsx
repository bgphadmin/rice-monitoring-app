import dynamic from "next/dynamic"
import type { DistributionRow } from "@/components/distribution/DistributionGrid"
import { getDistributionsPerPage, getEmplpoyeeItems, getRiceItems } from "@/utils/actions"
import SkeletonTable from "@/components/utils/SkeletonTable"
import verifyUser from "@/utils/userValidation"
import { redirect } from "next/navigation"

const DistributionManager = dynamic(
    () => import("@/components/distribution/DistributionManager"),
    {
        ssr: false,
        loading: () => <SkeletonTable />,
    }
)


const DistributionPage = async () => {
    const isSuperuser = await verifyUser("SUPERUSER");
    const isAdmin = await verifyUser("ADMIN");
    if (!isSuperuser && !isAdmin) return redirect('/');

    const { safeRows: distributions, total } = await getDistributionsPerPage({ pageIndex: 0, pageSize: 10 })
    const riceItems = await getRiceItems()
    const employeeItems = await getEmplpoyeeItems()

    const rows: DistributionRow[] = distributions.map((record) => ({
        id: record.id,
        employee: {
            id: record.employee.id,
            firstName: record.employee.firstname,
            lastName: record.employee.lastName
        },
        rice: {
            name: record.rice.name,
            id: record.rice.id
        },
        quantityKg: record.quantityKg,
        comment: record.comment,
        dateGiven: record.dateGiven,
        createdBy: {
            firstName: record.createdBy.firstName,
            lastName: record.createdBy.lastName,
        },
    }))

    return (
        <section className="space-y-8">
            <DistributionManager
                initialRows={rows}
                riceOptions={riceItems.map((rice) => ({ id: rice.id, name: rice.name }))}
                employeeOptions={employeeItems.map((employee) => ({ id: employee.id, firstName: employee.firstName, lastName: employee.lastName }))}
                total={total}
            />
        </section>
    )
}

export default DistributionPage

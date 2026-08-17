import dynamic from "next/dynamic"
import SkeletonTable from "@/components/utils/SkeletonTable"
import verifyUser from "@/utils/userValidation"
import { redirect } from "next/navigation"
import { InventoryRow } from "@/components/inventory/InventoryGrid"
import { getRiceItemsPerPage } from "@/utils/actions"

const InventoryManager = dynamic(
    () => import("@/components/inventory/InventoryManager"),
    {
        ssr: false,
        loading: () => <SkeletonTable />,
    }
)

const InventoryPage = async () => {
    const isSuperuser = await verifyUser("SUPERUSER");
    const isAdmin = await verifyUser("ADMIN");
    if (!isSuperuser && !isAdmin) return redirect('/');

    // const distributions = await getDistributions()
    const { safeRows: inventory, total } = await getRiceItemsPerPage(0, 10)

    const rows: InventoryRow[] = inventory.map((record) => ({
        id: record.id,
        name: record.name,
        stockKg: Number(record.stockKg),
        reorderLevel: Number(record.reorderLevel),
        comment: record.comment,
        addedBy: {
            firstName: record.addedBy.firstName,
            lastName: record.addedBy.lastName,
        }
    }))

    return (
        <section className="space-y-8">
            <InventoryManager
                initialRows={rows}
                total={total}
            />
        </section>
    )
}

export default InventoryPage

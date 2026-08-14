import dynamic from "next/dynamic"
import SkeletonTable from "@/components/utils/SkeletonTable"
import verifyUser from "@/utils/userValidation"
import { redirect } from "next/navigation"
import { getRiceItems, getStockLogs } from "@/utils/actions"
import { StockLog } from "@/utils/types"

const StockLogManager = dynamic(
    () => import("@/components/stockLog/StockLogManager"),
    {
        ssr: false,
        loading: () => <SkeletonTable />,
    }
)

const StockLogPage = async () => {
    const isSuperuser = await verifyUser("SUPERUSER");
    const isAdmin = await verifyUser("ADMIN");
    if (!isSuperuser && !isAdmin) return redirect('/');

    const stockLogs = await getStockLogs()
    const riceItems = await getRiceItems()

    const rows: StockLog[] = stockLogs.map((record) => ({
        id: record.id,
        rice: {
            name: record.rice.name,
            id: record.rice.id
        },
        quantityKg: record.quantityKg.toNumber(),
        action: record.action,
        comment: record.comment,
        createdAt: record.createdAt.toISOString(),
        createdBy: {
            firstName: record.createdBy.firstName,
            lastName: record.createdBy.lastName,
        }
    }
    ))

    return (
        <section className="space-y-8">
            <StockLogManager
                initialRows={rows}
                riceOptions={riceItems.map((rice) => ({ id: rice.id, name: rice.name }))}
            />
        </section>
    )
}

export default StockLogPage

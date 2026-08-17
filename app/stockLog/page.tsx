import dynamic from "next/dynamic"
import SkeletonTable from "@/components/utils/SkeletonTable"
import verifyUser from "@/utils/userValidation"
import { redirect } from "next/navigation"
import { getRiceItems, getStockLogs } from "@/utils/actions"
import { StockLog } from "@/utils/types"

// ✅ Dynamically import StockLogManager with client-only rendering
const StockLogManager = dynamic(
  () => import("@/components/stockLog/StockLogManager"),
  {
    ssr: false,
    loading: () => <SkeletonTable />,
  }
)

const StockLogPage = async () => {
  // ✅ Authorization check
  const isSuperuser = await verifyUser("SUPERUSER")
  const isAdmin = await verifyUser("ADMIN")
  if (!isSuperuser && !isAdmin) return redirect("/")

  // ✅ Fetch initial data
  const { safeRows: stockLogs, total } = await getStockLogs(0, 10) // first page only
  const riceItems = await getRiceItems()

  // ✅ Map rows into StockLog type
  const mappedRows: StockLog[] = stockLogs.map((record) => ({
    id: record.id,
    rice: {
      name: record.rice.name,
      id: record.rice.id,
    },
    quantityKg: record.quantityKg,
    action: record.action,
    comment: record.comment,
    createdAt: record.createdAt,
    createdBy: {
      firstName: record.createdBy.firstName,
      lastName: record.createdBy.lastName,
    },
  }))

  return (
    <section className="space-y-8">
      <StockLogManager
        initialRows={mappedRows}
        total={total} // 👈 pass total count for pagination
        riceOptions={riceItems.map((rice) => ({ id: rice.id, name: rice.name }))}
      />
    </section>
  )
}

export default StockLogPage

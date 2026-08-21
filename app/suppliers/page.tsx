import dynamic from "next/dynamic"
import SkeletonTable from "@/components/utils/SkeletonTable"
import verifyUser from "@/utils/userValidation"
import { redirect } from "next/navigation"
import { getSuppliersPerPage } from "@/utils/actions"
import { Supplier } from "@prisma/client"

const SupplierManager = dynamic(
    () => import("@/components/supplier/SupplierManager"),
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
    const { safeRows: suppliers, total } = await getSuppliersPerPage(0, 10)

    const rows: Supplier[] = suppliers.map((record) => ({
        id: record.id,
        name: record.name,
        contact: record.contact,
        phone: record.phone,
        email: record.email,
        address: record.address,
        createdAt: new Date(),
        updatedAt: new Date(),
    }))

    return (
        <section className="space-y-8">
            <SupplierManager
                initialRows={rows}
                total={total}
            />
        </section>
    )
}

export default InventoryPage

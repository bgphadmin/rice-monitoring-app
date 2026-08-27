import dynamic from "next/dynamic"
import { getRiceItems } from "@/utils/actions"
import SkeletonTable from "@/components/utils/SkeletonTable"
import verifyUser from "@/utils/userValidation"
import { redirect } from "next/navigation"

const ScannerManager = dynamic(
    () => import("@/components/scanner/ScannerManager"),
    {
        ssr: false,
        loading: () => <SkeletonTable />,
    }
)

const ScannerPage = async () => {
    const isSuperuser = await verifyUser("SUPERUSER");
    const isAdmin = await verifyUser("ADMIN");
    if (!isSuperuser && !isAdmin) return redirect('/');
    const riceItems = await getRiceItems()

    return (
        <section className="space-y-8">
            <ScannerManager
                riceOptions={riceItems.map((rice) => ({ id: rice.id, name: rice.name }))}
            />
        </section>
    )
}

export default ScannerPage
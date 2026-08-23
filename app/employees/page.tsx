import dynamic from "next/dynamic"
import SkeletonTable from "@/components/utils/SkeletonTable"
import verifyUser from "@/utils/userValidation"
import { redirect } from "next/navigation"
import { getEmployeesPerPage } from "@/utils/actions"
import { Employee } from "@prisma/client"

const EmployeeManager = dynamic(
    () => import("@/components/employee/EmployeeManager"),
    {
        ssr: false,
        loading: () => <SkeletonTable />,
    }
)

const EmployeePage = async () => {
    const isSuperuser = await verifyUser("SUPERUSER");
    const isAdmin = await verifyUser("ADMIN");
    if (!isSuperuser && !isAdmin) return redirect('/');

    // const distributions = await getDistributions()
    const { safeRows: employees } = await getEmployeesPerPage({pageIndex: 0, pageSize: 10})

    const rows: Employee[] = employees.map((record) => ({
        id: record.id,
        firstName: record.firstName,
        lastName: record.lastName,
        employeeId: record.employeeId,
        phone: record.phone,
        active: record.active,
        createdAt: new Date(),
        updatedAt: new Date(),
    }))

    return (
        <section className="space-y-8">
            <EmployeeManager
                initialRows={rows}
            />
        </section>
    )
}

export default EmployeePage
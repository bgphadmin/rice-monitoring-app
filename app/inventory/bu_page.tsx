import { Suspense } from "react";
import RiceList from "@/components/inventory/RiceList";
import RiceForm from "@/components/inventory/RiceForm";
import SkeletonTable from "@/components/utils/SkeletonTable";

import verifyUser from "@/utils/userValidation";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
  const isSuperuser = await verifyUser("SUPERUSER");
  const isAdmin = await verifyUser("ADMIN");
  if (!isSuperuser && !isAdmin) return redirect('/');

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-green-700">Rice Inventory</h2>
      <RiceForm />
      <Suspense fallback={<SkeletonTable />}>
        <RiceList />
      </Suspense>
    </section>
  );
}
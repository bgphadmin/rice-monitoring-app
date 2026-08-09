import { Suspense } from "react";
import RiceList from "@/components/inventory/RiceList";
import RiceForm from "@/components/inventory/RiceForm";
import SkeletonTable from "@/components/utils/SkeletonTable";

export default function InventoryPage() {
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
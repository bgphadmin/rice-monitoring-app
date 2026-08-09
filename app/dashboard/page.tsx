import InventoryChart from "@/components/dashboard/InventoryChart";
import SummaryCards from "@/components/dashboard/SummaryCards";


export default function DashboardPage() {
  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-green-700">Dashboard Overview</h2>
      <SummaryCards />
      <InventoryChart />
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Low Stock Alerts</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Jasmine Rice — 120kg (Reorder at 200kg)</li>
          <li>Brown Rice — 75kg (Reorder at 100kg)</li>
        </ul>
      </div>
    </section>
  );
}
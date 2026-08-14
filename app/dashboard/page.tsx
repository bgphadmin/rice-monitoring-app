'use client'

import InventoryChart from "@/components/dashboard/InventoryChart";
import RicePieChart from "@/components/dashboard/RicePieChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import { getRiceItemsWithStock } from "@/utils/actions";
import { useEffect, useState } from "react";


export default function DashboardPage() {

  const [riceData, setRiceData] = useState<{ name: string; stockKg: number }[]>([]);
  const [totalStock, setTotalStock] = useState<number>(0);

  useEffect(() => {
    const fetchRiceData = async () => {
      const { riceItems, totalStock } = await getRiceItemsWithStock();
      setRiceData(riceItems);
      setTotalStock(totalStock);
    };
    fetchRiceData();
  }, []);

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-green-700">Dashboard Overview</h2>
      <SummaryCards totalStock={totalStock} />
      <InventoryChart data={riceData} />
      <RicePieChart data={riceData} />
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
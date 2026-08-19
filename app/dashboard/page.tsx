'use client'

import InventoryChart from "@/components/dashboard/InventoryChart";
import RicePieChart from "@/components/dashboard/RicePieChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import { getDashboardMetrics } from "@/utils/actions";
import { useEffect, useState } from "react";


export default function DashboardPage() {

  const [riceData, setRiceData] = useState<{ name: string; stockKg: number; reorderLevel: number }[]>([]);
  const [totalStock, setTotalStock] = useState<number>(0);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);

  useEffect(() => {
    const fetchRiceData = async () => {
      // const { riceItems, totalStock } = await getRiceItemsWithStock();
      // const monthTotal = await getCurrentMonthDistributionTotal();
      const { riceItems, totalStock, monthlyTotal } = await getDashboardMetrics();
      setRiceData(riceItems);
      setTotalStock(totalStock);
      setMonthlyTotal(monthlyTotal);
    };
    fetchRiceData();
  }, []);

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-green-700">Dashboard Overview</h2>
      <SummaryCards totalStock={totalStock} monthlyTotal={monthlyTotal} />
      <InventoryChart data={riceData} />
      <RicePieChart data={riceData} />
    </section>
  );
}
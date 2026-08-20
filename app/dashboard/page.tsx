'use client'

import InventoryChart from "@/components/dashboard/InventoryChart";
import RicePieChart from "@/components/dashboard/RicePieChart";
import SummaryCards from "@/components/dashboard/SummaryCards";
import MonthlyDistributionChart from "@/components/distribution/MonthlyDistributionCharts";
import { ThemeToggle } from "@/components/utils/ThemeToggle";
import { getDashboardMetrics, getMonthlyDistributionTotals } from "@/utils/actions";
import { useEffect, useState } from "react";


export default function DashboardPage() {

  const [riceData, setRiceData] = useState<{ name: string; stockKg: number; reorderLevel: number }[]>([]);
  const [totalStock, setTotalStock] = useState<number>(0);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [monthlyData, setMonthlyData] = useState<{ month: string; total: number; cumulative: number }[]>([]);
  const [yearlyTotal, setYearlyTotal] = useState<number>(0);

  useEffect(() => {
    const fetchRiceData = async () => {
      // const { riceItems, totalStock } = await getRiceItemsWithStock();
      // const monthTotal = await getCurrentMonthDistributionTotal();
      const { riceItems, totalStock, monthlyTotal, yearlyTotal } = await getDashboardMetrics();
      setRiceData(riceItems);
      setTotalStock(totalStock);
      setMonthlyTotal(monthlyTotal);
      setYearlyTotal(yearlyTotal);
    };
    fetchRiceData();
  }, []);

  // Second useEffect → yearly chart data
  useEffect(() => {
    const fetchMonthlyData = async () => {
      const data = await getMonthlyDistributionTotals();
      setMonthlyData(data);
    };
    fetchMonthlyData();
  }, []);

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-bold text-green-700">Dashboard Overview</h2>
      <ThemeToggle />
      <SummaryCards totalStock={totalStock} monthlyTotal={monthlyTotal} yearlyTotal={yearlyTotal} />
      <InventoryChart data={riceData} />
      <MonthlyDistributionChart data={monthlyData} />
      <RicePieChart data={riceData} />
    </section>
  );
}
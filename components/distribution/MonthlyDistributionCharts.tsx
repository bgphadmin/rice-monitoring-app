// components/dashboard/MonthlyDistributionChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function MonthlyDistributionChart({ data }: { data: { month: string; total: number }[] }) {
    const year = new Date().getFullYear();
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Distribution ({year})</h3>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip
                            formatter={(value: string | number | readonly (string | number)[] | undefined) => {
                                if (typeof value === "number") return `${value} kg`;
                                if (Array.isArray(value)) return value.join(", ");
                                return value ?? "";
                            }}
                        />
                        <Bar dataKey="total" fill="#16a34a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
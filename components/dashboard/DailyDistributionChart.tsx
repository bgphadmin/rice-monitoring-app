// components/dashboard/DailyDistributionChart.tsx
"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DailyDistributionChart({ data }: { data: { date: string; total: number }[] }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Daily Distribution (Current Month)</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis
                            dataKey="date"
                            tickFormatter={(date: string) => new Date(date).getDate().toString()}
                        />
                        <YAxis />
                        <Tooltip
                            formatter={(value: string | number | readonly (string | number)[] | undefined) => {
                                if (Array.isArray(value)) {
                                    return value.join(", ");
                                }
                                if (typeof value === "number") {
                                    return `${value} kg`;
                                }
                                return value ?? "";
                            }}
                        />
                        <Bar dataKey="total" fill="#2563eb" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
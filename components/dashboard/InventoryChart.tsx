"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

type Props = {
  data: { name: string, stockKg: number, reorderLevel: number }[];
};

export default function InventoryChart({ data }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Inventory Overview</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="stockKg">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.stockKg < entry.reorderLevel ? "#dc2626" : "#16a34a"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>      {/* Custom Legend */}
      <div className="flex items-center space-x-4 mt-4 text-sm text-gray-700">
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-red-600 inline-block rounded-sm"></span>
          <span>At or below reorder threshold</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-3 h-3 bg-green-600 inline-block rounded-sm"></span>
          <span>Stock is healthy</span>
        </div>
      </div>
    </div >
  );
}
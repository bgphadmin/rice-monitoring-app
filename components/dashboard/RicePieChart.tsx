"use client";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

type CustomTooltipPayload = {
  payload: {
    name: string;
    stockKg: number;
    percent: string;
  };
};
type Props = {
  data: { name: string; stockKg: number }[];
};

const COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#dc2626", "#9333ea", "#8b5cf6", "#db2777", "#f43f5e"];

export default function RicePieChart({ data }: Props) {
  // compute grand total
  const totalStock = data.reduce((sum, item) => sum + item.stockKg, 0);

  // add percentage field for labels
  const dataWithPercent = data.map(item => ({
    ...item,
    percent: ((item.stockKg / totalStock) * 100).toFixed(1), // one decimal place
  }));

  // custom tooltip with relaxed typing
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: CustomTooltipPayload[];
  }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload as {
        name: string;
        stockKg: number;
        percent: string;
      };
      return (
        <div className="bg-white border rounded p-2 text-sm">
          <p className="font-semibold">{entry.name}</p>
          <p>
            {entry.stockKg} kg ({entry.percent}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Rice Stock Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart className="pb-4">
            <Pie
              data={dataWithPercent}
              dataKey="stockKg"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} (${percent}%)`}
            >
              {dataWithPercent.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

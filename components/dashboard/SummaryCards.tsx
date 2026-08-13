export default function SummaryCards({totalStock}: {totalStock: number}) {
  const stats = [
    { label: "Total Stock", value: "8,250 kg" },
    { label: "Low Stock", value: "3 Items" },
    { label: "New Orders", value: "5 Orders" },
    { label: "Monthly Sales", value: "1,200 kg" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow p-4 text-center"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-xl font-bold text-green-700">{totalStock}</p>
        </div>
      ))}
    </div>
  );
}
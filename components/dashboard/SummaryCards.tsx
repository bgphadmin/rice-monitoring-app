export default function SummaryCards({
  totalStock,
  monthlyTotal,
  yearlyTotal,
}: {
  totalStock: number;
  monthlyTotal: number;
  yearlyTotal: number;
}) {

  // Get current month name
  const monthName = new Date().toLocaleString("default", { month: "long" });
  const year = new Date().getFullYear();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-bgGreen rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-foreground">Total Stock</h3>
        <p className="text-2xl font-bold text-green-600">{totalStock} kg</p>
      </div>
      <div className="bg-bgBlue rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-foreground">{monthName} {year} Distribution</h3>
        <p className="text-2xl font-bold text-blue-600">{monthlyTotal} kg</p>
      </div>
      <div className="bg-bgRed rounded-lg shadow-xl p-6">
        <h3 className="text-lg font-semibold text-foreground">Total {year} Distribution</h3>
        <p className="text-2xl font-bold text-red-600">{yearlyTotal} kg</p>
      </div>
    </div>
  );
}
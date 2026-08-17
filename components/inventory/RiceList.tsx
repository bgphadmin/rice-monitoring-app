
import { getRiceItems } from "@/utils/actions";
import { DeleteRiceItem } from "./DeleteRiceItem";

export default async function RiceList() {

    // await new Promise((resolve) => setTimeout(resolve, 2000));
    const riceItems = await getRiceItems();


    return (
        <div className="bg-white rounded-lg shadow p-3 overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead>
                    <tr className="border-b">
                        <th className="px-2 py-2 text-left">Variety</th>
                        <th className="px-2 py-2 text-left">Stock (kg)</th>
                        <th className="px-2 py-2 text-left">Reorder Level (kg)</th>
                        <th className="px-2 py-2 text-left hidden md:table-cell">Comments</th>
                    </tr>
                </thead>
                <tbody>
                    {riceItems.map((rice) => (
                        <tr
                            key={rice.id}
                            className={`border-b ${rice.stockKg <= rice.reorderLevel ? "bg-pink-200" : ""
                                }`}
                        >
                            <td className="px-2 py-1">{rice.name}</td>
                            <td className="px-2 py-1">{rice.stockKg.toFixed(2)}</td>
                            <td className="px-2 py-1">{rice.reorderLevel.toFixed(2)}</td>
                            <td className="px-2 py-1 hidden md:table-cell">{rice.comment ?? ""}</td>
                            <td className="px-2 py-1 text-right">
                                <div className="inline-flex flex-col md:flex-row gap-1">
                                    {/* <EditRiceItem item={{
                                        id: rice.id,
                                        name: rice.name,
                                        stockKg: rice.stockKg.toNumber(),
                                        reorderLevel: rice.reorderLevel.toNumber(),
                                        comment: rice.comment ?? ""
                                    }} /> */}
                                    <DeleteRiceItem id={rice.id} riceName={rice.name} />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
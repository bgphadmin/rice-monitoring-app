// // "use client";

// // import { getStockLogs } from "@/utils/actions";
// // import { StockLog } from "@/utils/types";
// // import { useEffect, useState } from "react";
// // // import { getStockLogs } from "@/app/actions/getStockLogs";

// // // type Log = {
// // //   id: string;
// // //   rice: { name: string };
// // //   quantityKg: string;
// // //   action: "ADD" | "REMOVE";
// // //   comment?: string;
// // //   createdAt: string;
// // //   createdBy: { firstName: string; lastName: string };
// // // };

// // export default function StockLogTable() {
// //   const [logs, setLogs] = useState<StockLog[]>([]);
// //   const [page, setPage] = useState(0);
// //   const [actionFilter, setActionFilter] = useState<"ADD" | "REMOVE" | undefined>();
// //   const [startDate, setStartDate] = useState<string>("");
// //   const [endDate, setEndDate] = useState<string>("");

// //   useEffect(() => {
// //     getStockLogs({
// //       skip: page * 10,
// //       take: 10,
// //       action: actionFilter,
// //       startDate: startDate ? new Date(startDate) : undefined,
// //       endDate: endDate ? new Date(endDate) : undefined,
// //     }).then(setLogs);
// //   }, [page, actionFilter, startDate, endDate]);

// //   return (
// //     <div className="bg-white rounded-lg shadow p-6">
// //       {/* Filters */}
// //       <div className="flex items-center space-x-4 mb-4">
// //         <select
// //           value={actionFilter || ""}
// //           onChange={(e) =>
// //             setActionFilter(e.target.value ? (e.target.value as "ADD" | "REMOVE") : undefined)
// //           }
// //           className="border rounded px-2 py-1 text-sm"
// //         >
// //           <option value="">All Actions</option>
// //           <option value="ADD">Additions</option>
// //           <option value="REMOVE">Removals</option>
// //         </select>

// //         <input
// //           type="date"
// //           value={startDate}
// //           onChange={(e) => setStartDate(e.target.value)}
// //           className="border rounded px-2 py-1 text-sm"
// //         />
// //         <input
// //           type="date"
// //           value={endDate}
// //           onChange={(e) => setEndDate(e.target.value)}
// //           className="border rounded px-2 py-1 text-sm"
// //         />
// //       </div>

// //       {/* Table */}
// //       <table className="w-full text-sm text-left border-collapse">
// //         <thead>
// //           <tr className="border-b">
// //             <th className="py-2 px-3">Date</th>
// //             <th className="py-2 px-3">Rice</th>
// //             <th className="py-2 px-3">Action</th>
// //             <th className="py-2 px-3">Quantity (kg)</th>
// //             <th className="py-2 px-3">By</th>
// //             <th className="py-2 px-3">Comment</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {logs.map((log) => (
// //             <tr key={log.id} className="border-b">
// //               <td className="py-2 px-3">{new Date(log.createdAt).toLocaleString()}</td>
// //               <td className="py-2 px-3">{log.rice.name}</td>
// //               <td
// //                 className={`py-2 px-3 font-semibold ${
// //                   log.action === "REMOVE" ? "text-red-600" : "text-green-600"
// //                 }`}
// //               >
// //                 {log.action}
// //               </td>
// //               <td className="py-2 px-3">{log.quantityKg}</td>
// //               <td className="py-2 px-3">
// //                 {log.createdBy.firstName} {log.createdBy.lastName}
// //               </td>
// //               <td className="py-2 px-3">{log.comment || "-"}</td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>

// //       {/* Pagination */}
// //       <div className="flex justify-between mt-4">
// //         <button
// //           disabled={page === 0}
// //           onClick={() => setPage((p) => Math.max(p - 1, 0))}
// //           className="px-3 py-1 border rounded disabled:opacity-50"
// //         >
// //           Previous
// //         </button>
// //         <button
// //           onClick={() => setPage((p) => p + 1)}
// //           className="px-3 py-1 border rounded"
// //         >
// //           Next
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


// "use client";

// import { getStockLogs } from "@/utils/actions";
// import { StockLog } from "@/utils/types";
// import { useEffect, useState } from "react";
// // import { getStockLogs } from "@/app/actions/getStockLogs";

// type Log = {
//     id: string;
//     rice: { name: string };
//     quantityKg: string;
//     action: "ADD" | "REMOVE";
//     comment?: string;
//     createdAt: string;
//     createdBy: { firstName: string; lastName: string };
// };

// export default function StockLogTable() {
//     const [logs, setLogs] = useState<StockLog[]>([]);
//     const [page, setPage] = useState(0);
//     const [total, setTotal] = useState(0);
//     const [actionFilter, setActionFilter] = useState<"ADD" | "REMOVE" | undefined>();
//     const [startDate, setStartDate] = useState<string>("");
//     const [endDate, setEndDate] = useState<string>("");

//     useEffect(() => {
//         getStockLogs({
//             skip: page * 10,
//             take: 10,
//             action: actionFilter,
//             startDate: startDate ? new Date(startDate) : undefined,
//             endDate: endDate ? new Date(endDate) : undefined,
//         }).then(({ stocks, total }) => {
//             setLogs(stocks);
//             setTotal(total);
//         });
//     }, [page, actionFilter, startDate, endDate]);

//     const totalPages = Math.ceil(total / 10);

//     return (
//         <div className="bg-white rounded-lg shadow p-6">
//             {/* Filters */}
//             <div className="flex flex-wrap items-center gap-4 mb-4">
//                 <select
//                     value={actionFilter || ""}
//                     onChange={(e) =>
//                         setActionFilter(e.target.value ? (e.target.value as "ADD" | "REMOVE") : undefined)
//                     }
//                     className="border rounded px-2 py-1 text-sm"
//                 >
//                     <option value="">All Actions</option>
//                     <option value="ADD">Additions</option>
//                     <option value="REMOVE">Removals</option>
//                 </select>

//                 <input
//                     type="date"
//                     value={startDate}
//                     onChange={(e) => setStartDate(e.target.value)}
//                     className="border rounded px-2 py-1 text-sm"
//                 />
//                 <input
//                     type="date"
//                     value={endDate}
//                     onChange={(e) => setEndDate(e.target.value)}
//                     className="border rounded px-2 py-1 text-sm"
//                 />
//             </div>

//             {/* Table for md+ screens */}
//             <div className="hidden md:block overflow-x-auto">
//                 <table className="min-w-full text-sm text-left border-collapse">
//                     <thead>
//                         <tr className="border-b">
//                             <th className="py-2 px-3">Date</th>
//                             <th className="py-2 px-3">Rice</th>
//                             <th className="py-2 px-3">Action</th>
//                             <th className="py-2 px-3">Quantity (kg)</th>
//                             <th className="py-2 px-3">By</th>
//                             <th className="py-2 px-3">Comment</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {logs.map((log) => (
//                             <tr key={log.id} className="border-b">
//                                 <td className="py-2 px-3">{new Date(log.createdAt).toLocaleString()}</td>
//                                 <td className="py-2 px-3">{log.rice.name}</td>
//                                 <td
//                                     className={`py-2 px-3 font-semibold ${log.action === "REMOVE" ? "text-red-600" : "text-green-600"
//                                         }`}
//                                 >
//                                     {log.action}
//                                 </td>
//                                 <td className="py-2 px-3">{log.quantityKg}</td>
//                                 <td className="py-2 px-3">
//                                     {log.createdBy.firstName} {log.createdBy.lastName}
//                                 </td>
//                                 <td className="py-2 px-3">{log.comment || "-"}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             {/* Card layout for mobile */}
//             <div className="space-y-4 md:hidden">
//                 {logs.map((log) => (
//                     <div key={log.id} className="border rounded p-3 shadow-sm">
//                         <div className="flex justify-between">
//                             <span className="font-semibold">{log.rice.name}</span>
//                             <span
//                                 className={`font-semibold ${log.action === "REMOVE" ? "text-red-600" : "text-green-600"
//                                     }`}
//                             >
//                                 {log.action}
//                             </span>
//                         </div>
//                         <div className="text-sm text-gray-600">
//                             {new Date(log.createdAt).toLocaleString()}
//                         </div>
//                         <div className="mt-2 text-sm">
//                             <p>Quantity: {log.quantityKg} kg</p>
//                             <p>By: {log.createdBy.firstName} {log.createdBy.lastName}</p>
//                             <p>Comment: {log.comment || "-"}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-between mt-4">
//                 <button
//                     disabled={page === 0}
//                     onClick={() => setPage((p) => Math.max(p - 1, 0))}
//                     className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                     Previous
//                 </button>
//                 <button
//                     disabled={page + 1 >= totalPages}
//                     onClick={() => setPage((p) => p + 1)}
//                     className="px-3 py-1 border rounded disabled:opacity-50"
//                 >
//                     Next
//                 </button>
//             </div>
//         </div>
//     );
// }

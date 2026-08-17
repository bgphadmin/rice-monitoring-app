import * as React from "react"
import {
    flexRender,
    SortingState,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    createColumnHelper,
} from "@tanstack/react-table"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type InventoryRow = {
    id: string
    name: string
    stockKg: number
    reorderLevel: number
    comment: string | null
    addedBy: {
        firstName: string
        lastName: string
    }
}

const columnHelper = createColumnHelper<InventoryRow>()

const columns = [
    columnHelper.accessor(
        (row) => row.stockKg <= row.reorderLevel, // accessor returns boolean
        {
            id: "status",
            header: "Status",
            cell: (info) =>
                info.getValue() ? (
                    <div className="flex items-center justify-center">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                    </div>
                ) : null,
            enableSorting: true,
        }
    ),
    columnHelper.accessor("name", {
        header: "Variety",
    }),
    columnHelper.accessor("stockKg", {
        header: "Stock (kg)",
    }),
    columnHelper.accessor("reorderLevel", {
        header: "Reorder Level (kg)",
    }),
    columnHelper.accessor("comment", {
        header: "Comments",
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor((row) => `${row.addedBy.firstName} ${row.addedBy.lastName}`, {
        id: "createdBy",
        header: "Entered By",
    }),
]

interface InventoryGridProps {
    inventory: InventoryRow[]
    total: number
    pagination: { pageIndex: number; pageSize: number }
    onPaginationChange: React.Dispatch<
        React.SetStateAction<{ pageIndex: number; pageSize: number }>
    >
    onRowClick?: (row: InventoryRow) => void
}

export default function InventoryGrid({
    inventory,
    total,
    pagination,
    onPaginationChange,
    onRowClick, }: InventoryGridProps) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")
    const table = useReactTable({
        data: inventory,
        columns,
        state: { sorting, globalFilter, pagination },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange,
        pageCount: Math.ceil(total / pagination.pageSize), // 👈 server-side page count
        manualPagination: true, // 👈 tells TanStack we fetch data manually
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Input
                    placeholder="Filter distributions..."
                    value={globalFilter}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-md"
                />
            </div>

            <div className="overflow-auto bg-background shadow-sm">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="whitespace-nowrap bg-blue-300">
                                        {header.isPlaceholder ? null : (
                                            <button
                                                type="button"
                                                onClick={header.column.getToggleSortingHandler()}
                                                className={cn(
                                                    "flex items-center gap-2 text-left text-sm font-semibold text-slate-900",
                                                    header.column.getCanSort() ? "cursor-pointer" : "cursor-default"
                                                )}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getCanSort() ? (
                                                    <span className="text-slate-500">
                                                        {header.column.getIsSorted() === "asc" && "↑"}
                                                        {header.column.getIsSorted() === "desc" && "↓"}
                                                        {header.column.getIsSorted() === false && <ChevronDownIcon className="h-4 w-4 opacity-50" />}
                                                    </span>
                                                ) : null}
                                            </button>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row, rowIndex) => (
                                <TableRow
                                    key={row.id}
                                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                                    className={cn(
                                        rowIndex % 2 === 0 ? "bg-blue-100" : undefined,
                                        onRowClick ? "cursor-pointer hover:bg-blue-200" : undefined
                                    )}
                                >
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id} className="align-top py-3 px-3 text-sm text-slate-700">
                                            {cell.column.id === "quantityKg" ? (
                                                <span className="font-medium">{String(cell.getValue())}</span>
                                            ) : (
                                                <span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-6 text-center text-sm text-slate-500">
                                    No rice records match your filter.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-3 py-1 bg-slate-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>
                    Page {pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-3 py-1 bg-slate-300 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}
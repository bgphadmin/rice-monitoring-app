"use client"

import * as React from "react"
import {
    ColumnDef,
    createCoreRowModel,
    createFilteredRowModel,
    createSortedRowModel,
    flexRender,
    globalFilteringFeature,
    rowSortingFeature,
    columnFilteringFeature,
    SortingState,
    tableFeatures,
    useTable,
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

const features = tableFeatures({
    rowSortingFeature,
    globalFilteringFeature,
    columnFilteringFeature,
    coreRowModel: createCoreRowModel(),
    filteredRowModel: createFilteredRowModel(),
    sortedRowModel: createSortedRowModel(),
    filterFns: {
        fuzzy: (row, columnId, filterValue) => {
            const value = row.getValue<unknown>(columnId)
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase())
        },
    },
})

const columns: ColumnDef<typeof features, InventoryRow>[] = [
    {
        id: "name",
        header: "Variety",
        sortFn: (a, b) => a.original.name.localeCompare(b.original.name),
        accessorFn: (row: InventoryRow) => `${row.name}`,
    },
    {
        accessorKey: "stockKg",
        header: "Stock (kg)",
        sortFn: (a, b) => a.original.stockKg - b.original.stockKg,
    },
    {
        accessorKey: "reorderLevel",
        header: "Reorder Level (kg)",
        sortFn: (a, b) => a.original.reorderLevel - b.original.reorderLevel,
    },
    {
        accessorKey: "comment",
        header: "Comments",
        cell: (info) => info.getValue() ?? "-",
    },
    {
        id: "addedBy",
        header: "Entered By",
        sortFn: (a, b) => a.original.addedBy.firstName.localeCompare(b.original.addedBy.firstName),
        accessorFn: (row: InventoryRow) => `${row.addedBy.firstName} ${row.addedBy.lastName}`
    },
]

export default function InventoryGrid({ inventory }: { inventory: InventoryRow[] }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useTable({
        features,
        data: inventory,
        columns,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: "fuzzy",
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
                                    className={rowIndex % 2 === 0 ? "bg-blue-100" : undefined}
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
        </div>
    )
}

"use client"

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
import { cn } from "@/lib/utils"
import mlaTimeConvert from "@/utils/mlaTimeConvert"

export type DistributionRow = {
    id: string
    firstName: string
    lastName: string
    employeeId: string
    rice: {
        name: string
        id: string
    }
    quantityKg: number
    comment: string | null
    dateGiven: string
    createdBy: {
        firstName: string
        lastName: string
    }
}


const columnHelper = createColumnHelper<DistributionRow>()

const columns = [
    columnHelper.accessor("firstName", {
        header: "First Name",
    }),
    columnHelper.accessor("lastName", {
        header: "Last Name",
    }),
    columnHelper.accessor("rice.name", {
        header: "Rice Type",
    }),
    columnHelper.accessor("quantityKg", {
        header: "Quantity (kg)",
    }),
    columnHelper.accessor("dateGiven", {
        header: "Date Given",
        cell: (info) => {
            const value = info.getValue() as string
            return mlaTimeConvert(value, true)
        },
    }),
    columnHelper.accessor("comment", {
        header: "Comment",
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor((row) => `${row.createdBy.firstName} ${row.createdBy.lastName}`, {
        id: "createdBy",
        header: "Entered By",
    }),
]

interface DistributionGridProps {
    distributions: DistributionRow[]
    total: number
    pagination: { pageIndex: number; pageSize: number }
    onPaginationChange: React.Dispatch<
        React.SetStateAction<{ pageIndex: number; pageSize: number }>
    >
    onRowClick?: (row: DistributionRow) => void
    sorting: SortingState
    onSortingChange: (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => void
    globalFilter?: string
    onGlobalFilterChange?: (value: string) => void
}

export default function DistributionGrid({
    distributions,
    total,
    pagination,
    onPaginationChange,
    onRowClick,
    sorting,
    onSortingChange,
    globalFilter = "",
    onGlobalFilterChange,
}: DistributionGridProps) {

    const table = useReactTable({
        data: distributions,
        columns,
        state: { sorting, globalFilter, pagination },
        onSortingChange,
        onGlobalFilterChange,
        onPaginationChange,
        pageCount: Math.ceil(total / pagination.pageSize), // 👈 server-side page count
        manualPagination: true, // 👈 tells TanStack we fetch data manually
        manualSorting: true, // 👈 important: sorting handled server-side
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="space-y-4">
            <div className="overflow-auto bg-background shadow-sm">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="whitespace-nowrap bg-green-300">
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
                                        rowIndex % 2 === 0 ? "bg-green-100" : undefined,
                                        onRowClick ? "cursor-pointer hover:bg-green-200" : undefined
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
                                    No distribution records match your filter.
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

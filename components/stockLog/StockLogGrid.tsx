"use client"
import * as React from "react"
import {
  useReactTable,
  createColumnHelper,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
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
import { StockLog } from "@/utils/types"

interface StockLogGridProps {
  stockLog: StockLog[]
  total: number
  pagination: { pageIndex: number; pageSize: number }
  onPaginationChange: React.Dispatch<
    React.SetStateAction<{ pageIndex: number; pageSize: number }>
  >
  onRowClick?: (row: StockLog) => void
  globalFilter: string // 👈 new prop
}

const columnHelper = createColumnHelper<StockLog>()

const columns = [
  columnHelper.accessor((row) => row.rice.name, {
    id: "name",
    header: "Rice",
  }),
  columnHelper.accessor("quantityKg", {
    header: "Quantity (kg)",
  }),
  columnHelper.accessor("action", {
    header: "Add/Remove",
  }),
  columnHelper.accessor("comment", {
    header: "Comments",
    cell: (info) => info.getValue() ?? "-",
  }),
  columnHelper.accessor((row) => `${row.createdBy.firstName} ${row.createdBy.lastName}`, {
    id: "createdBy",
    header: "Entered By",
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => mlaTimeConvert(info.getValue() as string, false),
  }),
]

export default function StockLogGrid({
  stockLog,
  total,
  pagination,
  onPaginationChange,
  onRowClick,
  globalFilter,
}: StockLogGridProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    data: stockLog,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
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
      <div className="overflow-auto bg-background shadow-sm">
        <Table className="min-w-full">
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap bg-slate-500">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          "flex items-center gap-2 text-left text-sm font-semibold text-background",
                          header.column.getCanSort() ? "cursor-pointer" : "cursor-default"
                        )}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <span className="text-slate-500">
                            {header.column.getIsSorted() === "asc" && "↑"}
                            {header.column.getIsSorted() === "desc" && "↓"}
                            {header.column.getIsSorted() === false && (
                              <ChevronDownIcon className="h-4 w-4 opacity-50" />
                            )}
                          </span>
                        )}
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
                    rowIndex % 2 === 0 ? "bg-bgSlate" : undefined,
                    onRowClick ? "cursor-pointer hover:bg-slate-300" : undefined
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top py-3 px-3 text-sm text-foreground">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-6 text-center text-sm text-slate-500">
                  No stock logs match your filter.
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
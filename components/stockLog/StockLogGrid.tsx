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
import { StockLog } from "@/utils/types"

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

const columns: ColumnDef<typeof features, StockLog>[] = [

    {
        id: "name",
        header: "Rice",
        sortFn: (a, b) => a.original.rice.name.localeCompare(b.original.rice.name),
        accessorFn: (row: StockLog) => row.rice.name,
    },
    {
        accessorKey: "quantityKg",
        header: "Quantity (kg)",
        sortFn: (a, b) => a.original.quantityKg - b.original.quantityKg,
    },
    {
        accessorKey: "action",
        header: "Add/Remove",
        sortFn: (a, b) => a.original.action.localeCompare(b.original.action),

    },
    {
        accessorKey: "comment",
        header: "Comments",
        cell: (info) => info.getValue() ?? "-",
    },
    {
        id: "createdBy",
        header: "Entered By",
        sortFn: (a, b) => a.original.createdBy.firstName.localeCompare(b.original.createdBy.firstName),
        accessorFn: (row: StockLog) => `${row.createdBy.firstName} ${row.createdBy.lastName}`
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        sortFn: (a, b) => a.original.createdAt.localeCompare(b.original.createdAt),
        cell: (info) => {
            const value = info.getValue() as string
            const date = new Date(value)
            return new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
                timeZone: "UTC",
            }).format(date)
        },
    },
]

export default function StockLogGrid({ stockLog, onRowClick }: { stockLog: StockLog[]; onRowClick?: (row: StockLog) => void }) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [globalFilter, setGlobalFilter] = React.useState("")


    const table = useTable({
        features,
        data: stockLog,
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
                                    <TableHead key={header.id} className="whitespace-nowrap bg-slate-300">
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
                                        rowIndex % 2 === 0 ? "bg-slate-200" : undefined,
                                        onRowClick ? "cursor-pointer hover:bg-slate-300" : undefined
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
                                    No stock logs match your filter.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
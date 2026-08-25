import * as React from "react"
import {
    flexRender,
    useReactTable,
    getCoreRowModel,
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
import { Employee } from "@prisma/client"
import Spinner from "../ui/Spinner"
import toast from "react-hot-toast"
import { useEffectRunCounter } from "@/utils/hooks/customHooks"

const columnHelper = createColumnHelper<Employee>()

const columns = [
    columnHelper.accessor("firstName", {
        header: "First Name",
    }),
    columnHelper.accessor("lastName", {
        header: "Last Name",
    }),
    columnHelper.accessor("employeeId", {
        header: "Employee ID",
    }),
    columnHelper.accessor("phone", {
        header: "Phone",
    }),
    columnHelper.accessor("active", {
        header: "Active",
    }),
]

interface EmployeeGridProps {
    employees: Employee[]
    total: number
    pagination: { pageIndex: number; pageSize: number }
    onPaginationChange: React.Dispatch<
        React.SetStateAction<{ pageIndex: number; pageSize: number }>
    >
    onRowClick?: (row: Employee) => void
    sorting: { id: string; desc: boolean }[]
    onSortingChange: React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }[]>>
    filter: string
    onFilterChange: React.Dispatch<React.SetStateAction<string>>
}

export default function EmployeeGrid({
    employees,
    total,
    pagination,
    onPaginationChange,
    sorting,
    onSortingChange,
    filter,
    onFilterChange,
    onRowClick,
}: EmployeeGridProps) {
    const [localFilter, setLocalFilter] = React.useState(filter)
    const [loadingState, setLoadingState] = React.useState(false)
    const { increment } = useEffectRunCounter()

    // 🔑 Debounce: update parent filter only after 300ms pause
    React.useEffect(() => {
        const runCount = increment();

        // Skip first 2 runs (StrictMode double invoke)
        if (runCount <= 2) return

        setLoadingState(true)
        const handler = setTimeout(() => {
            try {
                onFilterChange(localFilter)
                onPaginationChange({ pageIndex: 0, pageSize: pagination.pageSize }) // reset to first page
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message)
                } else {
                    toast.error("Something went wrong")
                }
            }
            finally {
                setLoadingState(false)
            }
        }, 2000)

        return () => clearTimeout(handler)
    }, [localFilter, onFilterChange, onPaginationChange, pagination.pageSize, increment])

    const table = useReactTable({
        data: employees,
        columns,
        state: { sorting, pagination },
        onSortingChange,
        onPaginationChange,
        pageCount: Math.ceil(total / pagination.pageSize),
        manualPagination: true,
        manualSorting: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div className="space-y-4">
            {/* 🔑 Filter input with debounce */}
            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative">
                    <Input
                        placeholder="Filter employees..."
                        value={localFilter}
                        onChange={(event) => setLocalFilter(event.target.value)}
                        className="max-w-md"
                    />
                    {loadingState && (
                        <span className="absolute right-3 top-2">
                            <Spinner />
                        </span>
                    )}
                </div>
            </div>
            <div className="overflow-auto bg-background shadow-sm">
                <Table className="min-w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="whitespace-nowrap bg-blue-500">
                                        {header.isPlaceholder ? null : (
                                            <button
                                                type="button"
                                                onClick={header.column.getToggleSortingHandler()}
                                                className={cn(
                                                    "flex items-center gap-2 text-left text-sm font-semibold text-foreground",
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
                                        rowIndex % 2 === 0 ? "bg-bgBlue" : undefined,
                                        onRowClick ? "cursor-pointer hover:bg-blue-500" : undefined
                                    )}
                                >
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id} className="align-top py-3 px-3 text-sm text-foreground">
                                            <span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="p-6 text-center text-sm text-slate-500">
                                    No supplier records match your filter.
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
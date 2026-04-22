import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
// import { Card } from "@/components/ui/card";
import SearchInput from "./SearchInput";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchColumnKey?: string;
  searchPlaceholder?: string;
  showFooter?: boolean;
  footerContent?: React.ReactNode;
  paginationEnabled?: boolean;
  filterEnabled?: boolean;
  initialPageSize?: number; // Add pageSize prop
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchColumnKey,
  searchPlaceholder,
  showFooter = false,
  footerContent,
  paginationEnabled = true,
  filterEnabled = true,
  initialPageSize = 20, // Default to 10 rows per page
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  // Manage pagination state: pageIndex and pageSize
  const [pagination, setPagination] = React.useState({
    pageIndex: 0, // Starting from page 0 (first page)
    pageSize: initialPageSize,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: paginationEnabled
      ? getPaginationRowModel()
      : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: filterEnabled ? getFilteredRowModel() : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination, // Add the pagination state here
      rowSelection,
    },
    onPaginationChange: setPagination, // Add handler to update pagination state
  });

  return (
    <div>
      <div className="flex flex-row items-center justify-start">
        <div className="flex items-center pt-4 pb-2 space-x-2">
          {searchColumnKey && (
            <div className="flex items-center justify-end h-1">
              <div>
                <div className="relative ml-auto flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
                  <SearchInput
                    columnKey={searchColumnKey}
                    table={table}
                    placeholder={searchPlaceholder}
                  />
                </div>
              </div>
            </div>
          )}
          {filterEnabled && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto h-8">
                  Filter Columns
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <Card className="p-0">
        <Table>
          <TableHeader className="h-8 text-xs bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="whitespace-nowrap text-auto"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {showFooter && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={columns.length} className="text-right">
                  {footerContent}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </Card>

      {paginationEnabled && (
        <div className="flex items-center justify-between py-2 space-x-4">
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="pageSize"
              className="text-xs font-medium text-gray-600 whitespace-nowrap"
            >
              Rows per page:
            </label>
            <Select
              value={pagination.pageSize.toString()}
              onValueChange={(value) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(value),
                }))
              }
            >
              <SelectTrigger className="h-8 bg-white border border-gray-300 rounded-md shadow-sm w-2/3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((size) => (
                  <SelectItem
                    key={size}
                    value={size.toString()}
                    className="text-sm"
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex - 1,
                }))
              }
              disabled={!table.getCanPreviousPage()}
              className={`h-7 ${
                !table.getCanPreviousPage()
                  ? "text-gray-300 border-gray-300"
                  : ""
              } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500`}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* current page indicator */}
            <span className="text-xs text-gray-700">
              Page {pagination.pageIndex + 1} of {table.getPageCount()}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={!table.getCanNextPage()}
              className={`h-7 ${
                !table.getCanNextPage() ? "text-gray-500 border-gray-300" : ""
              } bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500`}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

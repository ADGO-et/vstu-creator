import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toDate } from "@/lib/admin-utils";
import {
  ColumnDef,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { AxiosError } from "axios";
import { useRef, useState } from "react";
import { AiOutlineArrowDown, AiOutlineArrowUp } from "react-icons/ai";
import { BsArrowDownUp } from "react-icons/bs";
import { GrNext, GrPrevious } from "react-icons/gr";
import ErrorMessage from "../status/ErrorMessage";
import Loading from "../status/Loading";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | null;
  isLoading: boolean;
  error: AxiosError | null;
  retry?: () => void;
  sortIds?: ColumnSort["id"][];
  pageSize?: number;
  search?: string;
  enablePagination?: boolean;
}

export function AdminTable<TData, TValue>({
  columns,
  data,
  isLoading,
  error,
  retry,
  pageSize = 6,
  sortIds = [],
  search = "",
  enablePagination = false,

}: DataTableProps<TData, TValue>) {
  const [pagination, onPaginationChange] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const isSortable = (id: string) => sortIds.includes(id);

  // not inline [] as it somehow makes the table rerender infinitely
  const emptyArray = useRef([]);
  const table = useReactTable({
    data: data || emptyArray.current,
    columns,
    enableGlobalFilter: true,

    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, colId, search) => {
      const val = row.getValue(colId) || "";
      if (!val) return false;

      const rowLower = val.toString().toLowerCase();
      const dateLower = toDate(rowLower);
      const sLower = search.toLowerCase();
      if (rowLower.includes(sLower) || dateLower.includes(sLower)) {
        return true;
      }

      return false;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange,
    state: { pagination, globalFilter: search },
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-primary">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const dir = header.column.getIsSorted();
                const isAsc = dir === "asc";
                const isDesc = dir === "desc";
                const isNoSort = !isSortable(header.id);
                const isNeutral = dir === false && !isNoSort;
                return (
                  <TableHead key={header.id} className="text-background">
                    <div className={`flex gap-1 ${columns.length === 2 ? "justify-around w-full" : "items-center"}`}>
                      <button
                        onClick={() => { header.column.toggleSorting(); }}
                        className={`${isNoSort ? "pointer-events-none" : ""} flex items-center gap-1`}
                      >
                        {isAsc && <div><AiOutlineArrowUp /></div>}
                        {isDesc && <div><AiOutlineArrowDown /></div>}
                        {isNeutral && <div><BsArrowDownUp /></div>}
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </button>
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row, rowI) => (
              <TableRow
                className={`${rowI % 2 == 0 ? "bg-primary/30" : ""}`}
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {columns.length === 2 ? (
                      <div className="w-full flex justify-around">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {(isLoading || error) && (
                  <div className="flex justify-center">
                    <Loading isLoading={isLoading} />
                    <ErrorMessage error={error} retry={retry} />
                  </div>
                )}
                {!isLoading &&
                  !error &&
                  data &&
                  table.getRowModel().rows.length === 0 && (
                    <span>No results</span>
                  )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {enablePagination && data && table.getRowModel().rows.length > 0 && (
        <div className="px-4 pt-12 pb-3 flex justify-between items-center text-sm">
          <div>
            <Select
              onValueChange={(v) => table.setPageIndex(+v)}
              value={table.getState().pagination.pageIndex.toString()}
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Page" />
              </SelectTrigger>
              <SelectContent>
                {new Array(table.getPageCount()).fill(0).map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <GrPrevious />
            </Button>
            <Button
              size="sm"
              variant={"outline"}
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <GrNext />
            </Button>
          </div>
          <div>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
        </div>
      )}
    </div>
  );
}

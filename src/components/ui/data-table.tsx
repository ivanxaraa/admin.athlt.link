"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { ChevronDown, Columns, Columns3, Edit2, Plus } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  add?: {
    key?: string;
    label: string;
    click: Function;
  };
  actions?: {
    custom?: {
      key?: string;
      label: string;
      click: Function;
    }[];
  };
  hide?: {
    columns?: boolean;
    filter?: boolean;
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  add,
  actions,
  hide,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="!text-xs">
      {/* handlers */}
      {!hide?.columns || !hide?.filter && (
      <div className="flex items-center justify-between gap-4 pb-4">
        {!hide?.filter && (
        <div className="flex w-full items-center gap-4">
          <Input
            placeholder="Filter by username..."
            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("username")?.setFilterValue(event.target.value)
            }
            className="max-w-sm !border text-xs"
          />
        </div>
        )}
        <div className="flex items-center gap-4">
          {actions && !!table.getFilteredSelectedRowModel().rows.length && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button>
                  <ChevronDown color="white" size={16} strokeWidth={1} />
                  <span className="ml-2 text-xs">
                    Actions ( {table.getFilteredSelectedRowModel().rows.length} )
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {actions.custom?.length &&
                  actions.custom.map((custom) => (
                    <DropdownMenuItem
                      onClick={() =>
                        custom.click(
                          custom.key,
                          table.getFilteredSelectedRowModel().rows.map((x) => x.original),
                        )
                      }
                      key={custom.label}
                    >
                      {custom.label}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* add product */}
          {add && (
            <Button onClick={() => add.click(add.key, {})}>
              <Plus color="white" size={16} strokeWidth={1} />
              <span className="ml-2 text-xs">{add.label}</span>
            </Button>
          )}
          {/* columns */}
          {!hide?.columns && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Columns3 size={16} strokeWidth={1} />
                  <span className="ml-2 text-xs">Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      column.columnDef.header && (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value: any) => column.toggleVisibility(!!value)}
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      )}
      {/* table */}
      <div className="rounded-md bg-white">
        <Table className="text-xs">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

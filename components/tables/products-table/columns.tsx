"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/constants/data";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type Product = {
  id: number;
  price: number;
  category: string;
  updated_at: string; // Alternatively, you can use Date if you plan to parse this string into a Date object
  photo_url: string;
  name: string;
  description: string;
  created_at: string; // Alternatively, you can use Date if you plan to parse this string into a Date object
};
export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    id: "photo_url",
    cell: ({ row }) => (
      <img
        src={row.original.photo_url}
        alt={row.original.name}
        className="w-20 h-20 rounded-sm"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "category",
    header: "CATEGORY",
  },
  {
    accessorKey: "price",
    header: "PRICE",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";

function decodeBase64Id(encodedString) {
  try {
    // Decode the URL-encoded string
    const decodedUrlString = decodeURIComponent(encodedString);

    // Validate the Base64 encoded string
    if (!/^[A-Za-z0-9+/=]+$/.test(decodedUrlString)) {
      throw new Error("Invalid Base64 string");
    }

    // Decode the Base64 encoded string
    const decodedString = atob(decodedUrlString);

    // The decoded string is in the format `product:97`, split it to get the ID
    const parts = decodedString.split(":");
    if (parts.length !== 2 || parts[0] !== "product") {
      throw new Error("Invalid format after decoding");
    }

    return parts[1];
  } catch (error) {
    console.error("Failed to decode Base64 string:", error);
    return null; // or handle the error as needed
  }
}

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
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const base64Id = decodeBase64Id(row.original.id);
      return <div>{base64Id}</div>;
    },
  },

  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center gap-2 w-full max-w-60 items-center">
          <img
            src={row.original.featuredImage?.node?.sourceUrl}
            alt={row.original.name}
            className="w-20 h-20 rounded-sm"
          />
          <div className="truncate w-40">{row.original.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div
        className="w-full max-w-md"
        dangerouslySetInnerHTML={{ __html: row.original.shortDescription }}
      ></div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="w-full max-w-md">{row.original.type}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={
          row.original?.status == "publish" ? "secondary" : "destructive"
        }
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

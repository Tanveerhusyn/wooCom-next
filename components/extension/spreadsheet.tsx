import React, { useState, useMemo, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { updateProductTableData } from "@/lib/queries";
import toast from "react-hot-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const OPTIONS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "X-Large" },
];

const bodyParts = [
  "Neck Girth",
  "Chest Girth",
  "Waist Girth",
  "Maximum Hip Girth",
  "Upper Arm Girth",
  "Elbow Girth",
  "Wrist Girth",
  "Thigh Girth",
  "Calf Girth",
  "Ankle Girth",
  "Across Back Shoulder Width",
  "Shoulder Length",
  "Torso Height",
  "Upper Arm Length",
  "Lower Arm Length",
  "Arm Length",
  "Inside Leg Height",
];

const BodyPartCell = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full px-3 py-2 border border-gray-700 bg-black rounded-md shadow-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-white"
    >
      {bodyParts.map((part) => (
        <option key={part} value={part} className="text-white">
          {part}
        </option>
      ))}
    </select>
  );
};

const HeaderSelect = ({ value, onChange, opt }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full px-3 py-2 border border-gray-700 bg-black rounded-md shadow-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-white"
    >
      {opt.map((option) => (
        <option key={option.name} value={option.name} className="text-white">
          {option.name}
        </option>
      ))}
    </select>
  );
};

const EditableCell = ({ initialValue, columnId, rowIndex, updateData }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    updateData(rowIndex, columnId, value);
  };

  return (
    <input
      type="number"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full px-3 py-2 border border-gray-700 bg-black rounded-md shadow-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm text-white"
    />
  );
};

const App = ({
  productId,
  product,
  markTabAsEdited,

  selectedImage,
  globalSizes,
  sessionUser,
  setSelectedImage,
}) => {
  console.log(globalSizes);
  const columns = useMemo(
    () => [
      {
        header: "Body Part",
        accessorKey: "bodyPart",
        cell: ({ getValue, row: { index }, column: { id }, table }) => (
          <BodyPartCell
            value={getValue()}
            onChange={(newValue) =>
              table.options.meta?.updateData(index, id, newValue)
            }
          />
        ),
      },
      ...globalSizes?.map((option) => ({
        header: ({ column }) => (
          <HeaderSelect
            opt={globalSizes}
            value={option.name}
            onChange={(newValue) =>
              table.options.meta?.updateData(-1, column.id, newValue)
            }
          />
        ),
        accessorKey: option.name,
        cell: ({ getValue, row: { index }, column: { id }, table }) => (
          <EditableCell
            initialValue={getValue()}
            columnId={id}
            rowIndex={index}
            updateData={table.options.meta?.updateData}
          />
        ),
      })),
      {
        header: () => <span>Actions</span>,
        accessorKey: "actions",
        cell: ({ row }) => (
          <div
            onClick={() => handleDelete(row.index)}
            className="flex space-x-2 cursor-pointer"
          >
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
        ),
      },
    ],
    [],
  );

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product?.tableData) {
      const first = product.tableData?.tableData?.replace(/`/g, '"');
      if (first) {
        const parsedTable = JSON.parse(first);
        if (parsedTable && typeof parsedTable.tableData === "string") {
          const deeperParsedTable = JSON.parse(parsedTable.tableData);
          if (
            deeperParsedTable &&
            typeof deeperParsedTable.value === "string"
          ) {
            if (!selectedImage) {
              setSelectedImage(deeperParsedTable?.image);
            }
            let jsonString = deeperParsedTable.value.replace(
              /([{,])(\s*)([A-Za-z0-9_]+?)\s*:/g,
              '$1"$3":',
            );
            jsonString = jsonString.replace(/'/g, '"');
            try {
              const deepestParsedTable = JSON.parse(jsonString);
              const formattedData = deepestParsedTable.map((row) => {
                const formattedRow = {};
                row.forEach((cell, index) => {
                  if (index === 0) {
                    formattedRow["bodyPart"] = cell.value;
                  } else {
                    formattedRow[OPTIONS[index - 1].value] = cell.value;
                  }
                });
                return formattedRow;
              });
              setData(formattedData);
            } catch (error) {
              console.error("Error parsing JSON", error);
            }
          }
        }
      }
    }
  }, [product]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
    },
  });

  const handleStoreData = async () => {
    try {
      setLoading(true);
      markTabAsEdited("size");
      const parsedValue = sessionUser ? sessionUser : {};

      if (parsedValue && parsedValue.user.accessToken) {
        const dynamicValues = data.map((row) =>
          Object.keys(row).map((key) => {
            const value = row[key];
            if (typeof value === "number") {
              return `{'value':${value}}`;
            } else if (key === "bodyPart") {
              return `{'value':'${value}'}`;
            } else {
              return `{'value':'${value}'}`;
            }
          }),
        );

        const values = `{
        "image": {
          "id": ${selectedImage.id},
          "source_url": "${selectedImage.source_url}"
        },
        "value": "${JSON.stringify(dynamicValues).replace(/"/g, "")}"
      }`;

        const formattedJSON = values
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"');

        const result = await updateProductTableData(
          productId,
          formattedJSON,
          parsedValue.user.accessToken,
        );

        if (result) {
          toast.success("Data saved successfully.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.error("Something went wrong");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Failed to handle store data:", err);
      toast.error(err.message);
    }
  };

  const handleDelete = (rowIndex) => {
    markTabAsEdited("size");

    setData((old) => old.filter((_, index) => index !== rowIndex));
  };

  return (
    <div className="container mx-auto bg-black text-white border border-gray-800 p-4 w-full min-w-[800px]">
      <div className="w-full flex flex-col h-full">
        <div className="grid grid-cols-2 gap-2 max-w-[350px] mb-4">
          <Button
            onClick={() => {
              markTabAsEdited("size");

              setData([
                { bodyPart: "", small: "", medium: "", large: "", xlarge: "" },
                ...data,
              ]);
            }}
            className="w-40"
            variant=""
          >
            <Plus className="w-5 h-5" />
            Add New
          </Button>
          <Button
            disabled={!selectedImage?.id}
            onClick={handleStoreData}
            className="w-40"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Save Data"
            )}
          </Button>
        </div>
        <ScrollArea className="h-[500px] overflow-y-auto">
          <table className="w-full bg-black text-white border-separate border-spacing-0">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className=" bg-white/10">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="py-2 px-4 border border-gray-700  bg-gray-800 text-center font-bold"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-black">
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-700">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="py-2 px-4 border border-gray-700 text-center"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  );
};

export default App;

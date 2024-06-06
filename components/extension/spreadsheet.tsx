import React, { useEffect, useState } from "react";
import Spreadsheet, { CellBase, DataEditor, Matrix } from "react-spreadsheet";
import { Button } from "../ui/button";
import { updateProductMetaData, updateProductTableData } from "@/lib/queries";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

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

const sizes = ["Small", "Medium", "Large", "X-Large"];

const HeaderSelect = ({ cell, onChange }) => {
  return (
    <select
      value={cell.value}
      onChange={(e) => onChange({ ...cell, value: e.target.value })}
      className="block w-full px-3 py-2 border border-gray-300 bg-white/10 rounded-md shadow-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
    >
      {sizes.map((part) => (
        <option key={part} value={part} className="text-gray-700">
          {part}
        </option>
      ))}
    </select>
  );
};

const BodyPartEditor = ({ cell, onChange }) => {
  return (
    <select
      value={cell.value}
      onChange={(e) => onChange({ ...cell, value: e.target.value })}
      className="block w-full px-3 py-2 border border-gray-300 bg-white/10 rounded-md shadow-lg focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
    >
      {bodyParts.map((part) => (
        <option key={part} value={part} className="text-gray-700">
          {part}
        </option>
      ))}
    </select>
  );
};

function parseTableData(jsonString) {
  try {
    // Parse the outer JSON string
    let parsedData = JSON.parse(jsonString);

    // Parse the nested JSON string within tableData
    parsedData.tableData = JSON.parse(parsedData.tableData);

    return parsedData;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return null;
  }
}

const transformData = (data) => {
  return data.map((row, index) => {
    return row.map((cell, cellIndex) => {
      // Check if cell.value is a string before calling includes()
      const value = String(cell.value); // Convert to string to safely use includes()

      // For the header row, apply HeaderSelect editor to all but the first cell
      if (index === 0 && cellIndex !== 0) {
        return { ...cell, DataEditor: HeaderSelect, className: "header-cell" };
      }
      // For all 'Girth', 'Width', 'Length', 'Height' measurements, apply BodyPartEditor
      else if (
        value.includes("Girth") ||
        value.includes("Width") ||
        value.includes("Length") ||
        value.includes("Height")
      ) {
        return { ...cell, DataEditor: BodyPartEditor };
      }
      // Return the cell as is if no conditions apply
      return cell;
    });
  });
};
const App = ({
  productId,
  product,
  selectedImage,
  sessionUser,
  setSelectedImage,
}) => {
  const [headerSelectValue, setHeaderSelectValue] = useState("");

  const [data, setData] = useState<Matrix<CellBase>>([]);
  const [loading, setLoading] = useState(false);

  function fixJsonError(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Original JSON error: ", error.message);

      const position = parseInt(error.message.match(/position (\d+)/)[1], 10);
      console.log(`Error at position: ${position}`);

      // Let's try to correct by escaping the problematic string
      const part1 = jsonString.slice(0, position);
      const part2 = jsonString.slice(position);
      const corrected = part1
        .replace(/(?<=":\s*")(?=[^"]*?{)/g, "\\")
        .concat(part2);

      // Check if the correction solves the issue
      try {
        return JSON.parse(corrected);
      } catch (err) {
        console.error("Failed to auto-correct JSON:", err.message);
        // Show a preview of where the issue might be
        console.log(
          "Problem near:",
          jsonString.substring(position - 20, position + 20),
        );
        return null; // Return null if we can't auto-correct
      }
    }
  }
  useEffect(() => {
    if (product.tableData) {
      const first = product.tableData?.tableData.replace(/`/g, '"');
      console.log("FIXED JSON", typeof first);
      if (first) {
        console.log("FIXED BEFORE", first);
        const parsedTable = JSON.parse(first); // Initial JSON parsing.
        console.log("FIXED AFTER", parsedTable);
        // Ensure deeper parsing for nested JSON strings.
        if (parsedTable && typeof parsedTable.tableData === "string") {
          const deeperParsedTable = JSON.parse(parsedTable.tableData);
          console.log("DEEPER PARSED TABLE", deeperParsedTable);
          // Check if the 'value' property needs further parsing.
          if (
            deeperParsedTable &&
            typeof deeperParsedTable.value === "string"
          ) {
            if (!selectedImage) {
              setSelectedImage(deeperParsedTable?.image);
            }
            // Use a regex to correctly format the JSON keys by adding double quotes around them.
            let jsonString = deeperParsedTable.value.replace(
              /([{,])(\s*)([A-Za-z0-9_]+?)\s*:/g,
              '$1"$3":',
            );
            jsonString = jsonString.replace(/'/g, '"'); // Replace all single quotes with double quotes
            console.log("JSON STRING FOR PARSING", jsonString); // Log the string to verify it's correctly formatted.
            try {
              const deepestParsedTable = JSON.parse(jsonString);
              console.log("DEEPEST PARSED TABLE", deepestParsedTable);
              const transformedData = transformData(deepestParsedTable);
              setData(transformedData);
            } catch (error) {
              console.error("Error parsing JSON", error); // This will give more insight into what might be wrong if it fails again.
            }
          }
        }
      }
      //   ? parseTableData(product.tableData.tableData)
      //   : {};
      // console.log("PARSED TABLE", product.tableData);
      // if (parsedTable) {
      //   setData(parsedTable.value);
      // }
    }
  }, [product]);

  const addRow = () => {
    const newRow = [
      { value: "", DataEditor: BodyPartEditor },
      ...new Array(data[0].length - 1).fill({ value: "" }),
    ];
    setData([...data, newRow]);
  };

  const addColumn = () => {
    const newColumnHeader = {
      value: `New Size ${data[0].length - 1}`,
      readOnly: true,
      className: "header-cell",
    };
    const newData = data.map((row, rowIndex) => {
      if (rowIndex === 0) {
        return [...row, newColumnHeader];
      }
      return [...row, { value: "" }];
    });
    setData(newData);
  };

  const deleteRow = (rowIndex) => {
    if (data.length > 1 && rowIndex < data.length) {
      const newData = data.filter((_, index) => index !== rowIndex);
      setData(newData);
    }
  };

  const deleteColumn = (colIndex) => {
    if (data[0].length > 1 && colIndex < data[0].length) {
      const newData = data.map((row) =>
        row.filter((_, index) => index !== colIndex),
      );
      setData(newData);
    }
  };

  const handleStoreData = async () => {
    try {
      setLoading(true);
      const parsedValue = sessionUser ? JSON.parse(sessionUser.value) : {};
      console.log("PARSED USER", parsedValue);
      if (parsedValue && parsedValue.user.accessToken) {
        // Dynamic construction of the value array from state
        const dynamicValues = data.map((row) =>
          row.map((cell) => {
            if (typeof cell.value === "number") {
              return `{'value':${cell.value}}`;
            } else if (cell.className) {
              return `{'value':'${cell.value}','className':'${cell.className}'}`;
            } else {
              return `{'value':'${cell.value}'}`;
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
        console.log("FORMATTED JSON", formattedJSON);

        const result = await updateProductTableData(
          productId,
          formattedJSON,
          parsedValue.user.accessToken,
        );
        console.log(result);

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

  const [deleteRowIndex, setDeleteRowIndex] = useState(0);
  const [deleteColumnIndex, setDeleteColumnIndex] = useState(0);

  return (
    <div>
      <div className="w-full flex flex-col h-full">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button onClick={addRow} variant="outline">
            Add Row
          </Button>
          <Button onClick={addColumn} variant="outline">
            Add Column
          </Button>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={deleteRowIndex}
              onChange={(e) => setDeleteRowIndex(parseInt(e.target.value))}
              className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Row Index"
            />
            <Button
              onClick={() => deleteRow(deleteRowIndex)}
              variant="destructive"
            >
              Delete Row
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={deleteColumnIndex}
              onChange={(e) => setDeleteColumnIndex(parseInt(e.target.value))}
              className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Column Index"
            />
            <Button
              onClick={() => deleteColumn(deleteColumnIndex)}
              variant="destructive"
            >
              Delete Column
            </Button>
          </div>
          <Button onClick={handleStoreData} className="w-40">
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Save Data"
            )}
          </Button>
        </div>
        <Spreadsheet data={data} onChange={setData} className="" darkMode />
      </div>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import Spreadsheet, { CellBase, DataEditor, Matrix } from "react-spreadsheet";
import { Button } from "../ui/button";
import { updateProductMetaData } from "@/lib/queries";
import toast from "react-hot-toast";

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

const App = ({ productId }) => {
  const [headerSelectValue, setHeaderSelectValue] = useState("");

  const [data, setData] = useState<Matrix<CellBase>>([
    [
      {
        value: "",

        className: "header-cell",
      },
      { value: "Small", DataEditor: HeaderSelect, className: "header-cell" },
      { value: "Medium", DataEditor: HeaderSelect, className: "header-cell" },
      { value: "Large", DataEditor: HeaderSelect, className: "header-cell" },
      { value: "X-Large", DataEditor: HeaderSelect, className: "header-cell" },
    ],
    [
      { value: "Neck Girth", DataEditor: BodyPartEditor },
      { value: 34 },
      { value: 38 },
      { value: 42 },
      { value: 46 },
    ],
    [
      { value: "Chest Girth", DataEditor: BodyPartEditor },
      { value: 28 },
      { value: 32 },
      { value: 36 },
      { value: 40 },
    ],
    [
      { value: "Waist Girth", DataEditor: BodyPartEditor },
      { value: 36 },
      { value: 40 },
      { value: 44 },
      { value: 48 },
    ],
    [
      { value: "Maximum Hip Girth", DataEditor: BodyPartEditor },
      { value: 28 },
      { value: 29 },
      { value: 30 },
      { value: 31 },
    ],
    [
      { value: "Upper Arm Girth", DataEditor: BodyPartEditor },
      { value: 12 },
      { value: 13 },
      { value: 14 },
      { value: 15 },
    ],
    [
      { value: "Elbow Girth", DataEditor: BodyPartEditor },
      { value: 7 },
      { value: 8 },
      { value: 9 },
      { value: 10 },
    ],
    [
      { value: "Wrist Girth", DataEditor: BodyPartEditor },
      { value: 20 },
      { value: 22 },
      { value: 24 },
      { value: 26 },
    ],
    [
      { value: "Thigh Girth", DataEditor: BodyPartEditor },
      { value: 14 },
      { value: 15 },
      { value: 16 },
      { value: 17 },
    ],
    [
      { value: "Calf Girth", DataEditor: BodyPartEditor },
      { value: 8 },
      { value: 9 },
      { value: 10 },
      { value: 11 },
    ],
    [
      { value: "Ankle Girth", DataEditor: BodyPartEditor },
      { value: 15 },
      { value: 16 },
      { value: 17 },
      { value: 18 },
    ],
    [
      { value: "Across Back Shoulder Width", DataEditor: BodyPartEditor },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
    ],
    [
      { value: "Shoulder Length", DataEditor: BodyPartEditor },
      { value: 20 },
      { value: 21 },
      { value: 22 },
      { value: 23 },
    ],
    [
      { value: "Torso Height", DataEditor: BodyPartEditor },
      { value: 10 },
      { value: 11 },
      { value: 12 },
      { value: 13 },
    ],
    [
      { value: "Upper Arm Length", DataEditor: BodyPartEditor },
      { value: 12 },
      { value: 13 },
      { value: 14 },
      { value: 15 },
    ],
    [
      { value: "Lower Arm Length", DataEditor: BodyPartEditor },
      { value: 22 },
      { value: 23 },
      { value: 24 },
      { value: 25 },
    ],
    [
      { value: "Arm Length", DataEditor: BodyPartEditor },
      { value: 30 },
      { value: 31 },
      { value: 32 },
      { value: 33 },
    ],
    [
      { value: "Inside Leg Height", DataEditor: BodyPartEditor },
      { value: 30 },
      { value: 31 },
      { value: 32 },
      { value: 33 },
    ],
  ]);

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

  const handleStoreData = () => {
    const uniqueKey = `spreadsheetData-${Date.now()}`;
    const stringifiedData = JSON.stringify(data);
    const meta = {
      key: uniqueKey,
      value: stringifiedData,
    };

    const result = updateProductMetaData(productId, meta);
    console.log(result);
    if (result) {
      toast.success("Data saved successfully.");
    } else {
      toast.error("Something went wrong. Please try again.");
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
            Save Changes
          </Button>
        </div>
        <Spreadsheet data={data} onChange={setData} className="" darkMode />
      </div>
    </div>
  );
};

export default App;

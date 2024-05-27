import { useState, useEffect } from "react";
import Spreadsheet, { CellBase, Matrix } from "react-spreadsheet";

export default function App() {
  const [data, setData] = useState<Matrix<Cell>>([
    [
      { value: "Size", readOnly: true, className: "header-cell" },
      { value: "Chest (inches)", readOnly: true, className: "header-cell" },
      { value: "Waist (inches)", readOnly: true, className: "header-cell" },
      { value: "Hip (inches)", readOnly: true, className: "header-cell" },
      { value: "Length (inches)", readOnly: true, className: "header-cell" },
    ],
    [
      { value: "Small" },
      { value: 34 },
      { value: 28 },
      { value: 36 },
      { value: 28 },
    ],
    [
      { value: "Medium" },
      { value: 38 },
      { value: 32 },
      { value: 40 },
      { value: 29 },
    ],
    [
      { value: "Large" },
      { value: 42 },
      { value: 36 },
      { value: 44 },
      { value: 30 },
    ],
    [
      { value: "X-Large" },
      { value: 46 },
      { value: 40 },
      { value: 48 },
      { value: 31 },
    ],
  ]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className="w-full h-full">
      <Spreadsheet
        data={data}
        style={{
          height: "100%",
          width: "100%",
        }}
        onChange={setData}
        className=""
        darkMode
      />
    </div>
  );
}

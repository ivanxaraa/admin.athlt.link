import { X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./button";

type ChildProps = {
  key: string;
  // Add other props as needed
};

type ManipulatorProps = {
  label?: string;
  className?: string;
  data?: any[];
  children: React.ReactElement<ChildProps>[]; // Children must have a 'key' property
};

export default function Manipulator({
  label = "Item",
  className = "",
  data = [],
  children,
}: ManipulatorProps) {
  const [inputs, setInputs] = useState<any>(data);

  const handleChange = (index: number, key: string, value: string) => {
    const newData = [...inputs];
    newData[index][key] = value;
    setInputs(newData);
  };

  const addItem = () => {
    setInputs([...inputs, {}]);
  };

  const removeItem = (index: number) => {
    const newData = [...inputs];
    newData.splice(index, 1);
    setInputs(newData);
  };

  const renderRowManipulator = (item: any, index: number) => {
    const gridCols = index !== 0 ? "grid-cols-[1fr,38px]" : "grid-cols-1";
    return (
      <div
        className={`grid ${gridCols} gap-[10px] w-full ${className}`}
        key={index}
      >
        <div className="w-full flex flex-col gap-2">
          {React.Children.map(children, (child: any, childIndex: number) =>
            React.cloneElement(child, {
              value: inputs[index][child?.key],
              onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(index, child?.key, e.target.value),
              key: child.key, // Ensuring each input has a unique key
            })
          )}
        </div>
        {index !== 0 && (
          <button
            onClick={() => removeItem(index)}
            className="h-full rounded-md text-white bg-red-200 hover:bg-red-300 transition-opacity w-full grid place-items-center"
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      {inputs &&
        inputs.map((item: any, index: number) =>
          renderRowManipulator(item, index)
        )}
      <Button variant="outline" onClick={addItem}>
        Add {label}
      </Button>
    </>
  );
}

import React, { useEffect } from "react";
import { RangeModalProps } from "@/types/range";

const RangeModal: React.FC<RangeModalProps> = ({
  isOpen,
  onClose,
  value,
  onChange,
  minLimit,
  maxLimit,
  step,
  title,
}) => {
  const [tempValue, setTempValue] = React.useState<number | "">(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempValue !== "") {
      onChange(Number(tempValue));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={tempValue}
            onChange={(e) =>
              setTempValue(e.target.value === "" ? "" : Number(e.target.value))
            }
            step={step}
            min={minLimit}
            max={maxLimit}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
            >
              Accept
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RangeModal;
